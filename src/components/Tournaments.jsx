import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Tournaments({ theme, toggleTheme, user }) {
  const [tournaments, setTournaments] = useState([]);
  const [registeredTournament, setRegisteredTournament] = useState(null);
  const [expandedInfo, setExpandedInfo] = useState({});

  useEffect(() => {
    const q = query(collection(db, 'tournaments'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tournamentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTournaments(tournamentsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setRegisteredTournament(localStorage.getItem('registeredTournament'));
  }, []);

  const handleRegister = (tournamentId) => {
    if (!user) return;
    localStorage.setItem('registeredTournament', tournamentId);
    setRegisteredTournament(tournamentId);
  };

  const toggleMoreInfo = (tournamentId) => {
    setExpandedInfo((prev) => ({
      ...prev,
      [tournamentId]: !prev[tournamentId]
    }));
  };

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-3xl font-bold mb-8`}>Доступні турніри</h1>
      <section className="grid grid-cols-1 gap-8">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-gray-700 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]' : 'bg-white border border-blue-200 shadow-xl hover:bg-blue-50 hover:border-blue-400 hover:shadow-2xl'} hover:scale-105 transition-all duration-300 flex flex-col justify-between`}
          >
            <div>
              <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold mb-4`}>{tournament.title}</h2>
              <div className="space-y-3">
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                  <i className="fas fa-gamepad mr-2"></i> Гра: {tournament.game}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                  <i className="fas fa-calendar-alt mr-2"></i> Дата: {tournament.date}
                </p>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                  <i className="fas fa-users mr-2"></i> Умови: {tournament.conditions}
                </p>
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <button
                    onClick={() => toggleMoreInfo(tournament.id)}
                    className={`${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' : 'text-blue-600 hover:text-blue-800'} flex items-center`}
                  >
                    <i className="fas fa-info-circle mr-2"></i> Детальніше
                  </button>
                  {expandedInfo[tournament.id] && (
                    <p className="mt-2 text-sm">{tournament.moreInfo}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              {user ? (
                <button
                  onClick={() => handleRegister(tournament.id)}
                  disabled={registeredTournament === tournament.id}
                  className={`w-full py-2 rounded-lg font-bold transition ${
                    registeredTournament === tournament.id
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : theme === 'dark'
                      ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {registeredTournament === tournament.id ? 'Зареєстровано' : 'Зареєструватись'}
                </button>
              ) : (
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-sm text-center`}>
                  <Link
                    to="/register"
                    className={`${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' : 'text-blue-600 hover:text-blue-800'} font-bold`}
                  >
                    Зареєструйтесь
                  </Link>{' '}
                  або{' '}
                  <Link
                    to="/login"
                    className={`${theme === 'dark' ? 'text-cyan-400 hover:text-cyan-200' : 'text-blue-600 hover:text-blue-800'} font-bold`}
                  >
                    увійдіть
                  </Link>{' '}
                  для участі в турнірі
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Tournaments;