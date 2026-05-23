import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Credenciais via variáveis de ambiente (.env — nunca commitado)
// Configurar o arquivo .env.example com os valores corretos antes do deploy
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
