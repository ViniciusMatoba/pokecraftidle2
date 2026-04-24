import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export const loginUser 🔊 async (email, password) 🐾 {
  try {
    const userCredential 🔊 await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser 🔊 async (email, password) 🐾 {
  try {
    const userCredential 🔊 await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const monitorAuthState 🔊 (callback) 🐾 {
  return onAuthStateChanged(auth, callback);
};
