import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Home from './components/Home';
import Games from './components/Games';
import Tournaments from './components/Tournaments';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('registeredTournament');
      localStorage.removeItem('favoriteGames');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <div data-theme={theme} className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} min-h-screen`}>
      <header className={`${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-200'} p-4`}>
        <nav className="flex justify-center items-center gap-8">
          <Link
            to="/"
            className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg hover:${theme === 'dark' ? 'text-cyan-200' : 'text-blue-800'} transition`}
          >
            Головна
          </Link>
          <Link
            to="/games"
            className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg hover:${theme === 'dark' ? 'text-cyan-200' : 'text-blue-800'} transition`}
          >
            Ігри
          </Link>
          <Link
            to="/tournaments"
            className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg hover:${theme === 'dark' ? 'text-cyan-200' : 'text-blue-800'} transition`}
          >
            Турніри
          </Link>
          {user ? (
            <Link
              to="/profile"
              className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg hover:${theme === 'dark' ? 'text-cyan-200' : 'text-blue-800'} transition`}
            >
              Мій профіль
            </Link>
          ) : (
            <Link
              to="/login"
              className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} font-bold text-lg hover:${theme === 'dark' ? 'text-cyan-200' : 'text-blue-800'} transition`}
            >
              Увійти
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className={`${theme === 'dark' ? 'bg-cyan-400 text-black' : 'bg-blue-600 text-white'} px-6 py-2 rounded-lg font-bold hover:${theme === 'dark' ? 'bg-cyan-300' : 'bg-blue-500'} transition`}
          >
            {theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          </button>
          {user && (
            <button
              onClick={handleSignOut}
              className={`${theme === 'dark' ? 'bg-red-400 text-black' : 'bg-red-600 text-white'} px-6 py-2 rounded-lg font-bold hover:${theme === 'dark' ? 'bg-red-300' : 'bg-red-500'} transition`}
            >
              Вийти
            </button>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/games" element={<Games theme={theme} toggleTheme={toggleTheme} user={user} />} />
        <Route path="/tournaments" element={<Tournaments theme={theme} toggleTheme={toggleTheme} user={user} />} />
        <Route path="/profile" element={user ? <Profile theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
      </Routes>
    </div>
  );
}

export default App;