import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Profile({ theme, toggleTheme }) {
  const [registeredTournament, setRegisteredTournament] = useState(
    localStorage.getItem('registeredTournament') || 'Наразі не зареєстровано жодного турніру'
  );
  const [userRatings, setUserRatings] = useState([]);

  useEffect(() => {
    const gamesPlayed = 152;
    const gamesRequired = 200;
    const percentage = (gamesPlayed / gamesRequired) * 100;
    setTimeout(() => {
      document.getElementById('progress').style.width = `${percentage}%`;
    }, 100);

    // Fetch user ratings
    if (auth.currentUser) {
      const q = query(collection(db, 'ratings'), where('userId', '==', auth.currentUser.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ratingsData = snapshot.docs.map((doc) => doc.data());
        setUserRatings(ratingsData);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <main className="p-8">
      <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-3xl font-bold`}>Мій профіль</h1>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Інформація про користувача</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Електронна пошта: {auth.currentUser?.email || 'Немає даних'}</p>
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Прогрес до наступної нагороди</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Зіграно ігор: 152 / 200 для нагороди "Майстер гри"</p>
        <div className="w-full h-5 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div id="progress" className={`${theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-600'} h-full transition-width duration-2000 ease-in-out`}></div>
        </div>
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Ваші оцінки ігор</h2>
        {userRatings.length > 0 ? (
          <ul className={`list-disc pl-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {userRatings.map((rating) => (
              <li key={rating.gameId}>Гра {rating.gameId}: {rating.rating} ⭐</li>
            ))}
          </ul>
        ) : (
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ви ще не оцінили жодної гри</p>
        )}
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Статистика</h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ігор зіграно: 152</p>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Перемог: 78</p>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Рівень: 23</p>
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Історія ігор</h2>
        <ul className={`list-disc pl-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>15.04.2025 — Warzone — Перемога</li>
          <li>12.04.2025 — Minecraft — Поразка</li>
          <li>10.04.2025 — Apex Legends — Перемога</li>
        </ul>
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Нагороди</h2>
        <ul className={`list-disc pl-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>🏆 Переможець турніру "Cyber Spring 2025"</li>
          <li>🎖️ 100 годин гри</li>
          <li>🥇 MVP березня</li>
        </ul>
      </section>
      <section className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl mt-8`}>
        <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold`}>Турніри, в яких ви берете участь</h2>
        <ul className={`list-disc pl-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>{registeredTournament}</li>
        </ul>
      </section>
    </main>
  );
}

export default Profile;