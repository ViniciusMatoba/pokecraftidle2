import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { collection, doc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';
import { deleteAvatarSlotData, loadAvatarMeta } from './services/avatars';

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const monitorAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const deleteFriendData = async (uid) => {
  const [friendsSnap, requestsSnap] = await Promise.all([
    getDocs(collection(db, 'friends', uid, 'list')),
    getDocs(collection(db, 'friends', uid, 'requests')),
  ]);

  const batch = writeBatch(db);
  friendsSnap.docs.forEach(friendDoc => {
    const friendUid = friendDoc.id;
    batch.delete(friendDoc.ref);
    batch.delete(doc(db, 'friends', friendUid, 'list', uid));
  });
  requestsSnap.docs.forEach(requestDoc => batch.delete(requestDoc.ref));

  await batch.commit();
};

export const deleteUserAccount = async (password) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');

  // Firebase exige re-autenticação recente para deletar conta
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  const avatarMeta = await loadAvatarMeta(user.uid);
  const avatars = avatarMeta?.avatars?.length
    ? avatarMeta.avatars
    : [{ slot: 1, nick: null }];

  await Promise.allSettled(
    avatars.map(avatar => deleteAvatarSlotData(user.uid, avatar.slot, avatar))
  );

  await Promise.allSettled([
    deleteFriendData(user.uid),
    deleteDoc(doc(db, 'avatarMeta', user.uid)),
    deleteDoc(doc(db, 'userRegions', user.uid)),
    deleteDoc(doc(db, 'bossRankings', user.uid)),
  ]);

  // Apagar a conta do Firebase Auth
  await deleteUser(user);
};
