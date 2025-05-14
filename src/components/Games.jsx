import { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';

function Games({ theme, toggleTheme, user }) {
  const [games, setGames] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Fetch games
    const gamesQuery = query(collection(db, 'games'));
    const unsubscribeGames = onSnapshot(gamesQuery, (snapshot) => {
      const gamesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Fetch ratings and calculate averages
      const ratingsQuery = query(collection(db, 'ratings'));
      onSnapshot(ratingsQuery, (ratingsSnapshot) => {
        const ratingsMap = {};
        ratingsSnapshot.forEach((doc) => {
          const { gameId, rating } = doc.data();
          if (!ratingsMap[gameId]) {
            ratingsMap[gameId] = { total: 0, count: 0 };
          }
          ratingsMap[gameId].total += rating;
          ratingsMap[gameId].count += 1;
        });

        // Merge average ratings into games
        const updatedGames = gamesData.map((game) => ({
          ...game,
          averageRating: ratingsMap[game.id]
            ? (ratingsMap[game.id].total / ratingsMap[game.id].count).toFixed(1)
            : 0
        }));
        setGames(updatedGames);
      });
    });

    return () => unsubscribeGames();
  }, []);

  const sortGames = () => {
    const sortedGames = [...games].sort((a, b) => {
      const ratingA = parseFloat(a.averageRating) || 0;
      const ratingB = parseFloat(b.averageRating) || 0;
      return sortOrder === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
    setGames(sortedGames);
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <main className="p-8">
      <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-3xl font-bold`}>Список доступних ігор</h1>
      <button
        onClick={sortGames}
        className={`${theme === 'dark' ? 'bg-cyan-400 text-black hover:bg-cyan-300' : 'bg-blue-600 text-white hover:bg-blue-500'} mt-4 px-4 py-2 rounded-lg font-bold transition`}
      >
        Сортувати за рейтингом ({sortOrder === 'desc' ? 'спадання' : 'зростання'})
      </button>
      <section className="grid grid-cols-1 gap-8 mt-8">
        {games.map((game) => (
          <GameCard key={game.id} game={game} theme={theme} user={user} />
        ))}
      </section>
      <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-3xl font-bold mt-12`}>Рекомендовані ігри</h1>
      <section className="grid grid-cols-1 gap-8 mt-8">
        {games.slice(0, 2).map((game) => (
          <GameCard key={game.id + '-recommended'} game={game} theme={theme} user={user} />
        ))}
      </section>
    </main>
  );
}

export default Games;