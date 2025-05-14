import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function StarRating({ gameId, theme, user }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchRating = async () => {
        try {
          const ratingDoc = doc(db, 'ratings', `${user.uid}_${gameId}`);
          const docSnap = await getDoc(ratingDoc);
          if (docSnap.exists()) {
            const fetchedRating = docSnap.data().rating;
            setRating(fetchedRating);
            console.log(`Fetched rating for ${gameId}: ${fetchedRating}`);
          } else {
            setRating(0);
            console.log(`No rating found for ${gameId}`);
          }
        } catch (err) {
          console.error('Error fetching rating:', err);
        }
      };
      fetchRating();
    } else {
      setRating(0); // Reset rating for unauthenticated users
    }
  }, [user, gameId]);

  const handleRating = async (newRating) => {
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      const ratingDoc = doc(db, 'ratings', `${user.uid}_${gameId}`);
      await setDoc(ratingDoc, {
        gameId,
        userId: user.uid,
        rating: newRating,
        timestamp: new Date()
      });
      setRating(newRating);
      console.log(`Saved rating for ${gameId}: ${newRating}`);
    } catch (err) {
      console.error('Error setting rating:', err);
    }
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            onClick={() => handleRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} ${ratingValue <= (hover || rating) ? 'text-yellow-400' : ''}`}
          >
            ★
          </button>
        );
      })}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-xl shadow-lg max-w-sm w-full`}>
            <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-xl font-bold mb-4`}>
              Потрібна реєстрація
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              Будь ласка, зареєструйтесь або увійдіть, щоб оцінити гру!
            </p>
            <div className="flex gap-4">
              <Link
                to="/register"
                className={`${theme === 'dark' ? 'bg-cyan-400 text-black hover:bg-cyan-300' : 'bg-blue-600 text-white hover:bg-blue-500'} px-4 py-2 rounded-lg font-bold transition`}
                onClick={() => setShowModal(false)}
              >
                Зареєструватись
              </Link>
              <Link
                to="/login"
                className={`${theme === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-400 text-black hover:bg-gray-300'} px-4 py-2 rounded-lg font-bold transition`}
                onClick={() => setShowModal(false)}
              >
                Увійти
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className={`${theme === 'dark' ? 'bg-red-400 text-black hover:bg-red-300' : 'bg-red-600 text-white hover:bg-red-500'} px-4 py-2 rounded-lg font-bold transition`}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StarRating;