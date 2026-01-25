import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { getAdminRegistrations, getAdminSubmissions, confirmPayment, rejectPayment, logout } from '../lib/backend';

export default function AdminDashboard() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  const labels = {
    title: language === 'ru' ? 'Кабинет администратора' : language === 'uz' ? 'Administrator kabineti' : 'Admin Dashboard',
    registrations: language === 'ru' ? 'Регистрации' : language === 'uz' ? 'Ro‘yxatlar' : 'Registrations',
    submissions: language === 'ru' ? 'Материалы' : language === 'uz' ? 'Materiallar' : 'Submissions',
    confirm: language === 'ru' ? 'Подтвердить' : language === 'uz' ? 'Tasdiqlash' : 'Confirm',
    reject: language === 'ru' ? 'Отклонить' : language === 'uz' ? 'Rad etish' : 'Reject',
    logout: language === 'ru' ? 'Выйти' : language === 'uz' ? 'Chiqish' : 'Sign out',
  };

  const refresh = async () => {
    const [regs, subs] = await Promise.all([getAdminRegistrations(), getAdminSubmissions()]);
    if (regs === null || subs === null) {
      navigate('/admin/login');
      return;
    }
    setRegistrations(regs);
    setSubmissions(subs);
    setLoading(false);
  };

  useEffect(() => {
    refresh().catch(() => navigate('/admin/login'));
  }, [navigate]);

  const handleConfirm = async (paymentId: string) => {
    await confirmPayment(paymentId);
    refresh();
  };

  const handleReject = async (paymentId: string) => {
    const reason = rejectReasons[paymentId] || '';
    await rejectPayment(paymentId, reason);
    refresh();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{labels.title}</h1>
          <button onClick={handleLogout} className="text-sm text-primary-500 hover:text-primary-600">
            {labels.logout}
          </button>
        </div>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{labels.registrations}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-neutral-500 border-b">
                  <th className="py-2 pr-4">ФИО</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Статус</th>
                  <th className="py-2 pr-4">Сумма</th>
                  <th className="py-2 pr-4">Чек</th>
                  <th className="py-2 pr-4">Членство</th>
                  <th className="py-2 pr-4">Действия</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4">{item.name}</td>
                    <td className="py-3 pr-4">{item.email}</td>
                    <td className="py-3 pr-4">{item.payment_status || '-'}</td>
                    <td className="py-3 pr-4">
                      {item.payment_amount ? `${item.payment_amount} ${item.payment_currency}` : '-'}
                    </td>
                    <td className="py-3 pr-4">
                      {item.payment_receipt_path ? (
                        <a
                          href={`/api/files?path=${encodeURIComponent(item.payment_receipt_path)}`}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          Скачать
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {item.membership_proof_path ? (
                        <a
                          href={`/api/files?path=${encodeURIComponent(item.membership_proof_path)}`}
                          className="text-primary-500 hover:text-primary-600"
                        >
                          Скачать
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirm(item.payment_id)}
                          className="h-9 px-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-sm"
                          disabled={!item.payment_id}
                        >
                          {labels.confirm}
                        </button>
                        <input
                          type="text"
                          placeholder={language === 'ru' ? 'Причина' : language === 'uz' ? 'Sabab' : 'Reason'}
                          value={rejectReasons[item.payment_id] || ''}
                          onChange={(e) => setRejectReasons({ ...rejectReasons, [item.payment_id]: e.target.value })}
                          className="h-9 px-2 border border-neutral-200 rounded-sm"
                          disabled={!item.payment_id}
                        />
                        <button
                          type="button"
                          onClick={() => handleReject(item.payment_id)}
                          className="h-9 px-3 bg-error hover:bg-error/80 text-white rounded-sm"
                          disabled={!item.payment_id}
                        >
                          {labels.reject}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-4 text-neutral-500 text-center">
                      {language === 'ru' ? 'Регистраций пока нет.' : language === 'uz' ? 'Hali ro‘yxatlar yo‘q.' : 'No registrations yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{labels.submissions}</h2>
          <div className="space-y-2 text-sm">
            {submissions.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 border-b last:border-b-0 py-2">
                <div>
                  <div className="font-medium">{item.title || item.type}</div>
                  <div className="text-neutral-500">{item.participant_name} · {item.participant_email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{item.status}</span>
                  {item.file_path && (
                    <a
                      href={`/api/files?path=${encodeURIComponent(item.file_path)}`}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      Скачать
                    </a>
                  )}
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <p className="text-neutral-500">
                {language === 'ru' ? 'Материалы пока не поступали.' : language === 'uz' ? 'Materiallar hali yo‘q.' : 'No submissions yet.'}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
