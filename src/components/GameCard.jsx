import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-gray-700 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]' : 'bg-white border border-blue-200 shadow-xl hover:bg-blue-50 hover:border-blue-400 hover:shadow-2xl'} hover:scale-105 transition-all duration-300 flex flex-col justify-between`}
    >
      <div>
        <img src={game.image} alt={game.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-xl font-bold mb-2`}>{game.title}</h2>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{game.description}</p>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Середній рейтинг: {averageRating} ({averageRating > 0 ? 'з ' + averageRating.count + ' оцінок' : 'немає оцінок'})</p>
      </div>
      <div className="flex justify-between items-center">
        <StarRating gameId={game.id} theme={theme} user={user} />
        <button
          onClick={handleFavorite}
          className={`${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' : 'text-blue-600 hover:text-blue-800'} text-2xl`}
        >
          <i className={`fas fa-heart ${isFavorite ? 'text-red-500' : ''}`}></i>
        </button>
      </div>
      <Link
        to={`/games/${game.id}`}
        className={`mt-4 block text-center py-2 rounded-lg font-bold ${theme === 'dark' ? 'bg-cyan-400 text-black hover:bg-cyan-300' : 'bg-blue-600 text-white hover:bg-blue-500'} transition`}
      >
        Детальніше
      </Link>
    </div>
  );
}

export default GameCard;