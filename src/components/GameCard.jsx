import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import StarRating from './StarRating';

function GameCard({ game, theme, user }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (user) {
        const favoriteDoc = doc(db, 'favorites', `${user.uid}_${game.id}`);
        const docSnap = await getDoc(favoriteDoc);
        setIsFavorite(docSnap.exists());
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`/api/ratings/${game.id}/average`);
        const data = await response.json();
        setAverageRating(data.averageRating || 0);
      } catch (err) {
        console.error('Error fetching average rating:', err);
        setAverageRating(0);
      }
    };

    fetchFavoriteStatus();
    fetchAverageRating();
  }, [user, game.id]);

  const handleFavorite = async () => {
    if (!user) return;
    const favoriteDoc = doc(db, 'favorites', `${user.uid}_${game.id}`);
    if (isFavorite) {
      await setDoc(favoriteDoc, { gameId: game.id, userId: user.uid, isFavorite: false });
      setIsFavorite(false);
    } else {
      await setDoc(favoriteDoc, { gameId: game.id, userId: user.uid, isFavorite: true });
      setIsFavorite(true);
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl ${
        theme === 'dark'
          ? 'bg-gray-800 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-gray-700 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]'
          : 'bg-white border border-blue-200 shadow-xl hover:bg-blue-50 hover:border-blue-400 hover:shadow-2xl'
      } hover:scale-105 transition-all duration-300 flex sm:flex-col md:flex-row items-start gap-4`} // Зміна: flex для розташування зображення зліва, sm:flex-col для мобільних
    >
      {/* Зображення гри: квадратне, зліва */}
      <img
        src={game.image}
        alt={game.title}
        className="w-32 h-32 object-cover rounded-lg sm:w-full sm:h-48 md:w-32 md:h-32" // Зміна: w-32 h-32 для квадратного формату, sm:w-full для мобільних
        loading="lazy"
      />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2
            className={`${
              theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
            } text-xl font-bold mb-2`}
          >
            {game.title}
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            {game.description}
          </p>
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } mb-4`}
          >
            Середній рейтинг: {averageRating}{' '}
            {averageRating > 0 ? `(з ${averageRating.count} оцінок)` : '(немає оцінок)'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <StarRating gameId={game.id} theme={theme} user={user} />
        </div>
      </div>
      {/* Зміна: Видалено <Link to={`/games/${game.id}`}>Детальніше</Link> */}
    </div>
  );
}

export default GameCard;