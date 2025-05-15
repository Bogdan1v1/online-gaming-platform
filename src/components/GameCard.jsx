import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { getAuth } from 'firebase/auth';

function GameCard({ game, theme, user }) {
  const [averageRating, setAverageRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Отримання середнього рейтингу і коментарів
  useEffect(() => {
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

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments/${game.id}`);
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      }
    };

    fetchAverageRating();
    fetchComments();
  }, [game.id]);

  // Обробка надсилання коментаря
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameId: game.id, comment: newComment.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const data = await response.json();
      setComments([{ id: data.commentId, userId: user.uid, displayName: user.displayName || user.email.split('@')[0], comment: newComment.trim(), timestamp: new Date().toISOString() }, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Не вдалося додати коментар. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:bg-gray-700 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.7)]' : 'bg-white border border-blue-200 shadow-xl hover:bg-blue-50 hover:border-blue-400 hover:shadow-2xl'} hover:scale-105 transition-all duration-300 flex flex-col sm:flex-row sm:items-start gap-4`}
    >
      <img
        src={game.image}
        alt={game.title}
        className="w-full sm:w-32 sm:h-32 h-48 sm:aspect-square object-cover rounded-lg"
      />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h2 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-xl font-bold mb-2`}>
            {game.title}
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{game.description}</p>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Середній рейтинг: {averageRating} ({averageRating > 0 ? 'з ' + averageRating.count + ' оцінок' : 'немає оцінок'})
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <StarRating gameId={game.id} theme={theme} user={user} />
          <div className="mt-4">
            <h3 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'} text-lg font-semibold mb-2`}>Коментарі</h3>
            {comments.length === 0 ? (
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Немає коментарів</p>
            ) : (
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {comments.map((comment) => (
                  <li key={comment.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} p-2 rounded-lg`}>
                    <p className={`${theme === 'dark' ? 'text-cyan-300' : 'text-blue-800'} font-medium`}>{comment.displayName}</p>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{comment.comment}</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{new Date(comment.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mt-4 flex flex-col gap-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Додайте коментар..."
                  className={`w-full p-2 rounded-lg resize-none ${theme === 'dark' ? 'bg-gray-700 text-gray-200 border-cyan-400/50 focus:border-cyan-300' : 'bg-white text-gray-800 border-blue-200 focus:border-blue-400'} border focus:outline-none`}
                  rows="3"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className={`py-2 px-4 rounded-lg font-bold ${theme === 'dark' ? 'bg-cyan-400 text-black hover:bg-cyan-300 disabled:bg-cyan-600' : 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-800'} transition disabled:opacity-50`}
                >
                  {isSubmitting ? 'Надсилання...' : 'Додати коментар'}
                </button>
              </form>
            ) : (
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-4`}>Увійдіть, щоб залишити коментар</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;