import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { getAdminRegistrations, getAdminSubmissions, confirmPayment, rejectPayment, logout, getAdminNews, createNews, updateNews, deleteNews } from '../lib/backend';

export default function AdminDashboard() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<any | null>(null);
  const [newsForm, setNewsForm] = useState({
    title_en: '',
    title_ru: '',
    title_uz: '',
    content_en: '',
    content_ru: '',
    content_uz: '',
    is_published: false,
  });

  const labels = {
    title: language === 'ru' ? 'Кабинет администратора' : language === 'uz' ? 'Administrator kabineti' : 'Admin Dashboard',
    registrations: language === 'ru' ? 'Регистрации' : language === 'uz' ? 'Roʻyxatlar' : 'Registrations',
    submissions: language === 'ru' ? 'Материалы' : language === 'uz' ? 'Materiallar' : 'Submissions',
    news: language === 'ru' ? 'Новости' : language === 'uz' ? 'Yangiliklar' : 'News',
    confirm: language === 'ru' ? 'Подтвердить' : language === 'uz' ? 'Tasdiqlash' : 'Confirm',
    reject: language === 'ru' ? 'Отклонить' : language === 'uz' ? 'Rad etish' : 'Reject',
    logout: language === 'ru' ? 'Выйти' : language === 'uz' ? 'Chiqish' : 'Sign out',
    addNews: language === 'ru' ? 'Добавить новость' : language === 'uz' ? 'Yangilik qoʻshish' : 'Add News',
    edit: language === 'ru' ? 'Редактировать' : language === 'uz' ? 'Tahrirlash' : 'Edit',
    delete: language === 'ru' ? 'Удалить' : language === 'uz' ? 'Oʻchirish' : 'Delete',
    save: language === 'ru' ? 'Сохранить' : language === 'uz' ? 'Saqlash' : 'Save',
    cancel: language === 'ru' ? 'Отмена' : language === 'uz' ? 'Bekor qilish' : 'Cancel',
    published: language === 'ru' ? 'Опубликовано' : language === 'uz' ? 'Nashr etilgan' : 'Published',
    draft: language === 'ru' ? 'Черновик' : language === 'uz' ? 'Qoralama' : 'Draft',
  };

  const refresh = async () => {
    const [regs, subs, newsData] = await Promise.all([
      getAdminRegistrations(),
      getAdminSubmissions(),
      getAdminNews(),
    ]);
    if (regs === null || subs === null || newsData === null) {
      navigate('/admin/login');
      return;
    }
    setRegistrations(regs);
    setSubmissions(subs);
    setNews(newsData);
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

  const handleNewsSubmit = async () => {
    if (editingNews) {
      await updateNews(editingNews.id, newsForm);
    } else {
      await createNews(newsForm);
    }
    setShowNewsForm(false);
    setEditingNews(null);
    setNewsForm({
      title_en: '',
      title_ru: '',
      title_uz: '',
      content_en: '',
      content_ru: '',
      content_uz: '',
      is_published: false,
    });
    refresh();
  };

  const handleEditNews = (item: any) => {
    setEditingNews(item);
    setNewsForm({
      title_en: item.title_en,
      title_ru: item.title_ru,
      title_uz: item.title_uz,
      content_en: item.content_en,
      content_ru: item.content_ru,
      content_uz: item.content_uz,
      is_published: Boolean(item.is_published),
    });
    setShowNewsForm(true);
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm(language === 'ru' ? 'Удалить новость?' : language === 'uz' ? 'Yangilikni o\'chirish?' : 'Delete news?')) {
      await deleteNews(id);
      refresh();
    }
  };

  const handleTogglePublish = async (item: any) => {
    await updateNews(item.id, { is_published: !item.is_published });
    refresh();
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
                      {language === 'ru' ? 'Регистраций пока нет.' : language === 'uz' ? 'Hali roʻyxatlar yoʻq.' : 'No registrations yet.'}
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
                {language === 'ru' ? 'Материалы пока не поступали.' : language === 'uz' ? 'Materiallar hali yoʻq.' : 'No submissions yet.'}
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">{labels.news}</h2>
            <button
              onClick={() => {
                setShowNewsForm(true);
                setEditingNews(null);
                setNewsForm({
                  title_en: '',
                  title_ru: '',
                  title_uz: '',
                  content_en: '',
                  content_ru: '',
                  content_uz: '',
                  is_published: false,
                });
              }}
              className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-sm"
            >
              {labels.addNews}
            </button>
          </div>

          {showNewsForm && (
            <div className="border border-neutral-300 rounded-md p-4 space-y-4 bg-neutral-50">
              <h3 className="font-semibold text-neutral-900">
                {editingNews ? labels.edit : labels.addNews}
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={newsForm.title_en}
                    onChange={(e) => setNewsForm({ ...newsForm, title_en: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Заголовок (Русский)
                  </label>
                  <input
                    type="text"
                    value={newsForm.title_ru}
                    onChange={(e) => setNewsForm({ ...newsForm, title_ru: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Sarlavha (O'zbekcha)
                  </label>
                  <input
                    type="text"
                    value={newsForm.title_uz}
                    onChange={(e) => setNewsForm({ ...newsForm, title_uz: e.target.value })}
                    className="w-full h-10 px-3 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Content (English)
                  </label>
                  <textarea
                    value={newsForm.content_en}
                    onChange={(e) => setNewsForm({ ...newsForm, content_en: e.target.value })}
                    className="w-full min-h-32 px-3 py-2 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Содержание (Русский)
                  </label>
                  <textarea
                    value={newsForm.content_ru}
                    onChange={(e) => setNewsForm({ ...newsForm, content_ru: e.target.value })}
                    className="w-full min-h-32 px-3 py-2 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Mazmun (O'zbekcha)
                  </label>
                  <textarea
                    value={newsForm.content_uz}
                    onChange={(e) => setNewsForm({ ...newsForm, content_uz: e.target.value })}
                    className="w-full min-h-32 px-3 py-2 border border-neutral-200 rounded-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={newsForm.is_published}
                    onChange={(e) => setNewsForm({ ...newsForm, is_published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-neutral-700">
                    {labels.published}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleNewsSubmit}
                  className="h-10 px-4 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-semibold rounded-sm"
                >
                  {labels.save}
                </button>
                <button
                  onClick={() => {
                    setShowNewsForm(false);
                    setEditingNews(null);
                  }}
                  className="h-10 px-4 bg-neutral-300 hover:bg-neutral-400 text-neutral-900 text-sm font-semibold rounded-sm"
                >
                  {labels.cancel}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {news.map((item) => (
              <div key={item.id} className="border border-neutral-200 rounded-md p-4 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">{item.title_ru}</div>
                    <div className="text-neutral-600 mt-1">{item.content_ru.substring(0, 150)}...</div>
                    <div className="text-xs text-neutral-500 mt-2">
                      {new Date(item.published_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US')}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.is_published ? 'bg-secondary-100 text-secondary-700' : 'bg-neutral-200 text-neutral-700'}`}>
                      {item.is_published ? labels.published : labels.draft}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-neutral-200">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className="h-8 px-3 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 text-xs font-semibold rounded-sm"
                  >
                    {item.is_published ? (language === 'ru' ? 'Снять с публикации' : language === 'uz' ? 'Nashrdan olib tashlash' : 'Unpublish') : (language === 'ru' ? 'Опубликовать' : language === 'uz' ? 'Nashr etish' : 'Publish')}
                  </button>
                  <button
                    onClick={() => handleEditNews(item)}
                    className="h-8 px-3 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-sm"
                  >
                    {labels.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteNews(item.id)}
                    className="h-8 px-3 bg-error hover:bg-error/80 text-white text-xs font-semibold rounded-sm"
                  >
                    {labels.delete}
                  </button>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <p className="text-neutral-500">
                {language === 'ru' ? 'Новостей пока нет.' : language === 'uz' ? 'Yangiliklar hali yoʻq.' : 'No news yet.'}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
