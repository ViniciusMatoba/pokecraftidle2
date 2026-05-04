import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * Busca dados de perfil de um usuário específico.
 */
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }
};

/**
 * Busca o Top 50 do ranking global.
 * Ordenação: powerScore DESC
 */
export const getGlobalRanking = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("powerScore", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    
    const ranking = [];
    querySnapshot.forEach((doc) => {
      ranking.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return ranking;
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return [];
  }
};
