import { useState } from 'react';
   import { signInWithEmailAndPassword } from 'firebase/auth';
   import { auth } from '../firebase';
   import { useNavigate, Link } from 'react-router-dom';

   function Login({ theme }) {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const navigate = useNavigate();

     const handleLogin = async (e) => {
       e.preventDefault();
       try {
         await signInWithEmailAndPassword(auth, email, password);
         navigate('/profile');
       } catch (err) {
         setError(err.message);
       }
     };

     return (
       <main className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
         <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-3xl font-bold`}>Вхід</h1>
         <form onSubmit={handleLogin} className="mt-8 max-w-md mx-auto">
           <div className="mb-4">
             <label className="block mb-2">Електронна пошта</label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 border-cyan-400' : 'bg-white border-blue-600'} border`}
               required
             />
           </div>
           <div className="mb-4">
             <label className="block mb-2">Пароль</label>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-800 border-cyan-400' : 'bg-white border-blue-600'} border`}
               required
             />
           </div>
           {error && <p className="text-red-500 mb-4">{error}</p>}
           <button
             type="submit"
             className={`${theme === 'dark' ? 'bg-cyan-400 text-black hover:bg-cyan-300' : 'bg-blue-600 text-white hover:bg-blue-500'} w-full py-2 rounded font-bold transition`}
           >
             Увійти
           </button>
         </form>
         <p className="mt-4 text-center">
           Немає акаунту?{' '}
           <Link to="/register" className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} hover:underline`}>
             Зареєструватися
           </Link>
         </p>
       </main>
     );
   }

   export default Login;