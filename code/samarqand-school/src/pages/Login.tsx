import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { login } from '../lib/backend';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { language } = useI18n();
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const labels = {
    title: language === 'ru' ? 'Личный кабинет' : language === 'uz' ? 'Shaxsiy kabinet' : 'Participant Account',
    email: language === 'ru' ? 'Email' : language === 'uz' ? 'Email' : 'Email',
    password: language === 'ru' ? 'Пароль' : language === 'uz' ? 'Parol' : 'Password',
    submit: language === 'ru' ? 'Войти' : language === 'uz' ? 'Kirish' : 'Sign in',
    register: language === 'ru' ? 'Нет аккаунта? Зарегистрироваться' : language === 'uz' ? 'Hisob yo‘qmi? Ro‘yxatdan o‘ting' : 'No account? Register',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result?.success) {
      await refreshUser(); // Обновляем глобальный контекст авторизации
      const role = result?.user?.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'developer') {
        navigate('/developer');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(language === 'ru'
        ? 'Неверный email или пароль'
        : language === 'uz'
        ? 'Email yoki parol notoʻgʻri'
        : 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6 text-center">{labels.title}</h1>
        <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 text-error rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{labels.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">{labels.password}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-sm transition-colors"
          >
            {loading ? '...' : labels.submit}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/registration" className="text-sm text-primary-500 hover:text-primary-600">
            {labels.register}
          </Link>
        </div>
      </div>
    </main>
  );
}
