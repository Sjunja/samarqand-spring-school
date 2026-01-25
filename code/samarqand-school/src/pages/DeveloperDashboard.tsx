import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { createDevUser, getDevSummary, impersonateUser } from '../lib/backend';

export default function DeveloperDashboard() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin', name: '' });
  const [message, setMessage] = useState('');

  const labels = {
    title: language === 'ru' ? 'Кабинет разработчика' : language === 'uz' ? 'Dasturchi kabineti' : 'Developer Dashboard',
    create: language === 'ru' ? 'Создать пользователя' : language === 'uz' ? 'Foydalanuvchi yaratish' : 'Create user',
    impersonate: language === 'ru' ? 'Войти как' : language === 'uz' ? 'Kirish' : 'Login as',
  };

  const refresh = async () => {
    const data = await getDevSummary();
    setSummary(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async () => {
    const ok = await createDevUser(form.email, form.password, form.role, form.name);
    setMessage(ok ? 'OK' : 'Error');
    refresh();
  };

  const handleImpersonate = async (userId: string, role: string) => {
    const ok = await impersonateUser(userId);
    if (ok) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 text-center text-neutral-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-bold text-neutral-900">{labels.title}</h1>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{labels.create}</h2>
          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            />
            <input
              type="text"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            >
              <option value="admin">admin</option>
              <option value="participant">participant</option>
              <option value="developer">developer</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-sm"
          >
            {labels.create}
          </button>
          {message && <p className="text-sm text-neutral-500">{message}</p>}
        </section>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">Users</h2>
          <div className="text-sm text-neutral-600">
            {summary?.stats && (
              <div className="flex flex-wrap gap-4">
                <span>Registrations: {summary.stats.registrations}</span>
                <span>Payments: {summary.stats.payments}</span>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {(summary?.users || []).map((user: any) => (
                  <tr key={user.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">{user.role}</td>
                    <td className="py-3 pr-4">{user.name || '-'}</td>
                    <td className="py-3 pr-4">
                      <button
                        type="button"
                        onClick={() => handleImpersonate(user.id, user.role)}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        {labels.impersonate}
                      </button>
                    </td>
                  </tr>
                ))}
                {(summary?.users || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-neutral-500 text-center">
                      No users yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
