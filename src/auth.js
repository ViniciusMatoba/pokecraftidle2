import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

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

export const deleteUserAccount = async (password) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Nenhum usuário logado.');

  // Firebase exige re-autenticação recente para deletar conta
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  // Apagar todos os dados do Firestore deste usuário
  await Promise.allSettled([
    deleteDoc(doc(db, 'saves', user.uid)),
    deleteDoc(doc(db, 'users', user.uid)),
    deleteDoc(doc(db, 'bossRankings', user.uid)),
  ]);

  // Apagar a conta do Firebase Auth
  await deleteUser(user);
};
