import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Credenciais via variáveis de ambiente (.env — nunca commitado)
// Fallback embutido para compatibilidade com ambientes sem .env configurado
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             || "AIzaSyC5hxL1_5ZrbQI3VWBfFsBY3DaOD3gt0oA",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         || "pokecraftidle.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          || "pokecraftidle",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      || "pokecraftidle.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "136347940441",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              || "1:136347940441:web:ac16d3aff155352287e348",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID      || "G-0CG76TEDB2",
};

const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
const auth      = getAuth(app);

/**
 * Helper de rastreamento — nunca lança erro e nunca rastreia em dev.
 * Uso: trackEvent('badge_earned', { gym_id: 'brock', region: 'kanto' })
 */
export const trackEvent = (name, params = {}) => {
  if (import.meta.env.DEV) return; // não polui métricas em desenvolvimento
  try {
    logEvent(analytics, name, params);
  } catch { /* silencia erros de analytics — nunca impacta o jogo */ }
};

export { app, analytics, db, auth };
