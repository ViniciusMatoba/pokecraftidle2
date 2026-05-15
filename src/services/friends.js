/**
 * friends.js — Serviço de amizade via Firestore
 *
 * Coleções:
 *   friends/{uid}/requests/{fromUid}  → solicitações pendentes recebidas
 *   friends/{uid}/list/{friendUid}    → amigos aceitos
 *
 * Campos do perfil público (snapshot enviado junto com a solicitação):
 *   name, level, powerScore, badges, caughtCount, shinyCapturedCount,
 *   worldFlags, appearance, selectedTitle, prestige
 */
import { db } from '../firebase';
import {
  collection, doc, getDoc, getDocs,
  setDoc, deleteDoc,
  query, where, limit,
  onSnapshot, serverTimestamp,
} from 'firebase/firestore';

/* ─── Busca ─────────────────────────────────────────────────────────────── */

/**
 * Busca usuários pelo nome exato (campo `name` na coleção `users`).
 * Retorna array de { uid, name, level, powerScore, ... }.
 */
export const searchUsersByName = async (name) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('name', '==', name),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (e) {
    console.error('friends/searchUsersByName:', e);
    return [];
  }
};

/* ─── Solicitações ──────────────────────────────────────────────────────── */

/**
 * Envia uma solicitação de amizade de `fromUid` para `toUid`.
 * Salva o perfil do remetente para exibição no card.
 */
export const sendFriendRequest = async (fromUid, fromProfile, toUid) => {
  try {
    await setDoc(doc(db, 'friends', toUid, 'requests', fromUid), {
      fromUid,
      fromName: fromProfile.name || 'Treinador',
      profile:  fromProfile,
      sentAt:   serverTimestamp(),
      status:   'pending',
    });
    return { ok: true };
  } catch (e) {
    console.error('friends/sendFriendRequest:', e);
    return { ok: false, error: e.message };
  }
};

/**
 * Verifica se já existe uma solicitação enviada de `fromUid` para `toUid`.
 */
export const hasPendingRequest = async (fromUid, toUid) => {
  try {
    const snap = await getDoc(doc(db, 'friends', toUid, 'requests', fromUid));
    return snap.exists();
  } catch { return false; }
};

/**
 * Aceita uma solicitação: cria o par de documentos de amizade e apaga a request.
 */
export const acceptFriendRequest = async (myUid, myProfile, fromUid, request) => {
  try {
    const fromProfile = request.profile || { name: request.fromName };
    // Adiciona o remetente à minha lista
    await setDoc(doc(db, 'friends', myUid, 'list', fromUid), {
      uid:      fromUid,
      name:     fromProfile.name || request.fromName || 'Treinador',
      profile:  fromProfile,
      addedAt:  serverTimestamp(),
    });
    // Adiciona eu à lista do remetente
    await setDoc(doc(db, 'friends', fromUid, 'list', myUid), {
      uid:      myUid,
      name:     myProfile.name || 'Treinador',
      profile:  myProfile,
      addedAt:  serverTimestamp(),
    });
    // Remove a solicitação
    await deleteDoc(doc(db, 'friends', myUid, 'requests', fromUid));
    return { ok: true };
  } catch (e) {
    console.error('friends/acceptFriendRequest:', e);
    return { ok: false, error: e.message };
  }
};

/**
 * Recusa uma solicitação: apenas apaga o documento de request.
 */
export const rejectFriendRequest = async (myUid, fromUid) => {
  try {
    await deleteDoc(doc(db, 'friends', myUid, 'requests', fromUid));
    return { ok: true };
  } catch (e) {
    console.error('friends/rejectFriendRequest:', e);
    return { ok: false };
  }
};

/* ─── Lista de amigos ───────────────────────────────────────────────────── */

/**
 * Retorna a lista de amigos aceitos de um usuário.
 */
export const getFriendList = async (uid) => {
  try {
    const snap = await getDocs(collection(db, 'friends', uid, 'list'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('friends/getFriendList:', e);
    return [];
  }
};

/**
 * Remove amizade de forma bidirecional.
 */
export const removeFriend = async (myUid, friendUid) => {
  try {
    await Promise.all([
      deleteDoc(doc(db, 'friends', myUid,     'list', friendUid)),
      deleteDoc(doc(db, 'friends', friendUid, 'list', myUid)),
    ]);
    return { ok: true };
  } catch (e) {
    console.error('friends/removeFriend:', e);
    return { ok: false };
  }
};

/* ─── Real-time listener ────────────────────────────────────────────────── */

/**
 * Escuta em tempo real as solicitações pendentes de um usuário.
 * Retorna a função de unsubscribe.
 */
export const subscribeToFriendRequests = (uid, callback) => {
  const ref = collection(db, 'friends', uid, 'requests');
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => {
    console.error('friends/subscribeToFriendRequests:', err);
  });
};

/* ─── Região de amigo ────────────────────────────────────────────────────── */

/**
 * Carrega a região publicada de um amigo.
 * A região fica em `userRegions/{uid}`.
 */
export const loadFriendRegion = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'userRegions', uid));
    if (!snap.exists()) return null;
    return snap.data();
  } catch (e) {
    console.error('friends/loadFriendRegion:', e);
    return null;
  }
};
