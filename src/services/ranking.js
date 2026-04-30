import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

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
