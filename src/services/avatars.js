/**
 * Avatar Management Service
 * Cada e-mail suporta até 3 avatares (slots 1-3), cada um com nick único global.
 * Nick = Nome do treinador dentro do jogo.
 *
 * Estrutura Firestore:
 *   avatarMeta/{uid}          → { avatars: [{ slot, nick, createdAt }] }
 *   nicknames/{nick_lower}    → { uid, slot, nick }  (índice de unicidade global)
 *   saves/{uid}               → save do slot 1 (backward compat)
 *   saves/{uid}_s2            → save do slot 2
 *   saves/{uid}_s3            → save do slot 3
 *   users/{uid}               → perfil público do slot 1
 *   users/{uid}_s2            → perfil público do slot 2
 *   users/{uid}_s3            → perfil público do slot 3
 */

import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  runTransaction, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { getSlotDocId } from '../utils/avatarSlots';

export const MAX_AVATARS = 3;

// 1.5 — Nick: 2-16 chars, apenas letras (incluindo acentuadas), números, hífen, underscore e espaço.
// Proíbe `/`, `\` e outros chars que criam subcoleções involuntárias em IDs Firestore.
const NICK_REGEX = /^[a-zA-Z0-9áéíóúàâêôãõçüñ\-_ ]{2,16}$/u;

const validateNick = (nick) => {
  const trimmed = (nick || '').trim();
  if (!NICK_REGEX.test(trimmed)) {
    throw new Error('Nick deve ter 2 a 16 caracteres e usar apenas letras, números, hífen ou underscore.');
  }
  return trimmed;
};

export { getSlotDocId };

const deleteSnapshotCollection = async (docId) => {
  const snap = await getDocs(collection(db, 'saves', docId, 'snapshots'));
  if (snap.empty) return;

  const batch = writeBatch(db);
  snap.docs.forEach(snapshotDoc => batch.delete(snapshotDoc.ref));
  await batch.commit();
};

export const deleteAvatarSlotData = async (uid, slot, avatar) => {
  const docId = getSlotDocId(uid, slot);
  await deleteSnapshotCollection(docId).catch(e => {
    console.error('[Avatar] delete snapshots failed:', e);
  });

  await Promise.allSettled([
    deleteDoc(doc(db, 'saves', docId)),
    deleteDoc(doc(db, 'users', docId)),
    avatar?.nick ? releaseNick(uid, slot, avatar.nick) : Promise.resolve(),
  ]);
};

/** Carrega os metadados de avatar de um usuário */
export const loadAvatarMeta = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'avatarMeta', uid));
    if (snap.exists()) return snap.data();
    return null;
  } catch (e) {
    console.error('[Avatar] loadAvatarMeta failed:', e);
    return null;
  }
};

/** Inicializa o documento de metadados para o slot 1 (migração de conta existente) */
export const initAvatarMetaSlot1 = async (uid, nick) => {
  const meta = {
    avatars: [{ slot: 1, nick: nick || '', createdAt: Date.now() }],
    updatedAt: serverTimestamp(),
  };
  await setDoc(doc(db, 'avatarMeta', uid), meta);
  return meta;
};

/**
 * Verifica se um nick está disponível (case-insensitive, trim).
 * Retorna true se livre, false se já usado.
 */
export const checkNickAvailable = async (nick) => {
  if (!nick || nick.trim().length < 2) return false;
  try {
    validateNick(nick); // rejeita chars inválidos antes de ir ao Firestore
    const key = nick.trim().toLowerCase();
    const snap = await getDoc(doc(db, 'nicknames', key));
    return !snap.exists();
  } catch (e) {
    if (e.message?.includes('Nick deve')) return false; // nick inválido = indisponível
    console.error('[Avatar] checkNickAvailable failed:', e);
    return false;
  }
};

/**
 * Reserva um nick atomicamente via transação.
 * Lança erro se o nick já está em uso por outro uid/slot.
 */
export const reserveNick = async (uid, slot, nick) => {
  validateNick(nick); // lança se chars inválidos ou fora do range 2-16
  const key = nick.trim().toLowerCase();
  const nickRef = doc(db, 'nicknames', key);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(nickRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.uid !== uid || data.slot !== slot) {
        throw new Error(`O nick "${nick}" já está em uso. Escolha outro nome.`);
      }
    }
    tx.set(nickRef, { uid, slot, nick: nick.trim(), reservedAt: Date.now() });
  });
};

/**
 * Libera o nick reservado (chamado ao deletar avatar).
 * Só libera se a reserva pertence ao uid+slot informado.
 */
export const releaseNick = async (uid, slot, nick) => {
  if (!nick) return;
  try {
    const key = nick.trim().toLowerCase();
    const nickRef = doc(db, 'nicknames', key);
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(nickRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.uid === uid && data.slot === slot) tx.delete(nickRef);
    });
  } catch (e) {
    console.error('[Avatar] releaseNick failed:', e);
  }
};

/**
 * Cria um novo slot de avatar.
 * 1. Reserva o nick (transação — lança se duplicado)
 * 2. Adiciona entrada nos metadados do usuário
 * Retorna o meta atualizado.
 */
export const createAvatarSlot = async (uid, slot, nick, existingMeta) => {
  // Valida
  if (slot < 1 || slot > MAX_AVATARS) throw new Error('Slot inválido.');
  const currentAvatars = existingMeta?.avatars || [];
  if (currentAvatars.some(a => a.slot === slot)) throw new Error('Slot já existe.');
  if (currentAvatars.length >= MAX_AVATARS) throw new Error(`Limite de ${MAX_AVATARS} avatares atingido.`);

  // Reserva o nick atomicamente
  await reserveNick(uid, slot, nick);

  // Atualiza metadados
  const newAvatars = [
    ...currentAvatars,
    { slot, nick: nick.trim(), createdAt: Date.now() },
  ].sort((a, b) => a.slot - b.slot);

  const newMeta = { avatars: newAvatars, updatedAt: serverTimestamp() };
  await setDoc(doc(db, 'avatarMeta', uid), newMeta);
  return { ...newMeta, avatars: newAvatars };
};

/**
 * Deleta permanentemente um slot de avatar:
 * - Remove save do Firestore
 * - Remove perfil público
 * - Libera o nick
 * - Atualiza avatarMeta
 */
export const deleteAvatarSlot = async (uid, slot, existingMeta, { allowLastAvatar = false } = {}) => {
  if (!allowLastAvatar && slot === 1 && (existingMeta?.avatars || []).length === 1) {
    throw new Error('Não é possível deletar o único avatar da conta.');
  }

  const avatar = (existingMeta?.avatars || []).find(a => a.slot === slot);

  await deleteAvatarSlotData(uid, slot, avatar);

  const newAvatars = (existingMeta?.avatars || []).filter(a => a.slot !== slot);
  const newMeta = { avatars: newAvatars, updatedAt: serverTimestamp() };
  await setDoc(doc(db, 'avatarMeta', uid), newMeta);
  return { ...newMeta, avatars: newAvatars };
};

/**
 * Atualiza o nick de um avatar existente.
 * 1. Reserva o novo nick
 * 2. Libera o nick antigo
 * 3. Atualiza avatarMeta
 */
export const updateAvatarNick = async (uid, slot, newNick, oldNick, existingMeta) => {
  await reserveNick(uid, slot, newNick); // lança se indisponível
  if (oldNick && oldNick.toLowerCase() !== newNick.trim().toLowerCase()) {
    await releaseNick(uid, slot, oldNick);
  }
  const newAvatars = (existingMeta?.avatars || []).map(a =>
    a.slot === slot ? { ...a, nick: newNick.trim() } : a
  );
  const newMeta = { avatars: newAvatars, updatedAt: serverTimestamp() };
  await setDoc(doc(db, 'avatarMeta', uid), newMeta);
  return { ...newMeta, avatars: newAvatars };
};
