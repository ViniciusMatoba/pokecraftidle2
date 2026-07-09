import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Credenciais via variáveis de ambiente (.env — nunca commitado)
// Fallback embutido para compatibilidade com ambientes sem .env configurado
const _getFallback = (val, fallback) => {
  if (!val || val === "undefined" || val === "null" || String(val).trim() === "") {
    return fallback;
  }
  // Check if GitHub Actions literally passed the secret syntax because it was skipped
  if (String(val).includes("${{")) {
    return fallback;
  }
  return val;
};

const firebaseConfig = {
  apiKey: "AIzaSyC5hxL1_5ZrbQI3VWBfFsBY3DaOD3gt0oA",
  authDomain: "pokecraftidle.firebaseapp.com",
  projectId: "pokecraftidle",
  storageBucket: "pokecraftidle.firebasestorage.app",
  messagingSenderId: "136347940441",
  appId: "1:136347940441:web:ac16d3aff155352287e348",
  measurementId: "G-0CG76TEDB2",
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
