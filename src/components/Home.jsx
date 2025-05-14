function Home({ theme, toggleTheme }) {
  return (
    <main className={`p-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <section className="max-w-3xl mx-auto text-center">
        <h1 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-4xl font-bold mb-4`}>
          Ласкаво просимо до ігрової платформи!
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg mb-6`}>
          Приєднуйтесь до нашої спільноти геймерів, беріть участь у турнірах, оцінюйте улюблені ігри та здобувайте нагороди!
        </p>
        <div className={`${theme === 'dark' ? 'bg-gray-800 shadow-[0_0_10px_#0ff]' : 'bg-white shadow-lg'} p-6 rounded-xl`}>
          <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-2xl font-bold mb-4`}>
            Чому обирають нас?
          </h2>
          <ul className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} list-disc list-inside text-left`}>
            <li>Широкий вибір ігор для всіх жанрів</li>
            <li>Регулярні турніри з крутими призами</li>
            <li>Персоналізований профіль із вашими досягненнями</li>
            <li>Інтуїтивний інтерфейс із темною та світлою темами</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Home;