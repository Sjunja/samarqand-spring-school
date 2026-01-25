import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { getParticipantOverview, uploadPaymentReceipt, submitMaterial, logout } from '../lib/backend';

export default function Dashboard() {
  const { language } = useI18n();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionType, setSubmissionType] = useState('abstract');
  const [submissionTitle, setSubmissionTitle] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const labels = {
    title: language === 'ru' ? 'Личный кабинет' : language === 'uz' ? 'Shaxsiy kabinet' : 'Participant Dashboard',
    payment: language === 'ru' ? 'Оплата' : language === 'uz' ? 'Toʻlov' : 'Payment',
    status: language === 'ru' ? 'Статус' : language === 'uz' ? 'Holat' : 'Status',
    uploadReceipt: language === 'ru' ? 'Загрузить чек' : language === 'uz' ? 'Chek yuklash' : 'Upload receipt',
    submit: language === 'ru' ? 'Отправить' : language === 'uz' ? 'Yuborish' : 'Submit',
    submissions: language === 'ru' ? 'Материалы' : language === 'uz' ? 'Materiallar' : 'Submissions',
    logout: language === 'ru' ? 'Выйти' : language === 'uz' ? 'Chiqish' : 'Sign out',
    invoice: language === 'ru' ? 'Счет' : language === 'uz' ? 'Hisob' : 'Invoice',
  };

  useEffect(() => {
    getParticipantOverview().then((data) => {
      if (!data) {
        navigate('/login');
        return;
      }
      setOverview(data);
      setLoading(false);
    });
  }, [navigate]);

  const payment = (overview as any)?.payment || null;
  const submissions = (overview as any)?.submissions || [];

  const statusLabel = (status?: string) => {
    if (!status) return '-';
    const map: Record<string, string> = {
      pending: language === 'ru' ? 'Ожидает оплаты' : language === 'uz' ? 'Toʻlov kutilmoqda' : 'Pending payment',
      under_review: language === 'ru' ? 'На проверке' : language === 'uz' ? 'Tekshiruvda' : 'Under review',
      confirmed: language === 'ru' ? 'Подтверждено' : language === 'uz' ? 'Tasdiqlangan' : 'Confirmed',
      rejected: language === 'ru' ? 'Отклонено' : language === 'uz' ? 'Rad etilgan' : 'Rejected',
    };
    return map[status] || status;
  };

  const handleReceiptSubmit = async () => {
    if (!receiptFile || !payment?.id) return;
    const ok = await uploadPaymentReceipt(payment.id, receiptFile);
    if (ok) {
      setActionMessage(language === 'ru'
        ? 'Чек загружен, ожидайте подтверждения.'
        : language === 'uz'
        ? 'Chek yuklandi, tasdiqlashni kuting.'
        : 'Receipt uploaded, awaiting confirmation.');
      setReceiptFile(null);
      const refreshed = await getParticipantOverview();
      if (refreshed) setOverview(refreshed);
    }
  };

  const handleSubmission = async () => {
    if (!submissionFile) return;
    const ok = await submitMaterial(submissionType, submissionTitle, submissionFile);
    if (ok) {
      setActionMessage(language === 'ru'
        ? 'Материал отправлен.'
        : language === 'uz'
        ? 'Material yuborildi.'
        : 'Submission sent.');
      setSubmissionFile(null);
      setSubmissionTitle('');
      const refreshed = await getParticipantOverview();
      if (refreshed) setOverview(refreshed);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16">
        <div className="max-w-[1000px] mx-auto px-4 text-center text-neutral-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-[1100px] mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{labels.title}</h1>
          <button onClick={handleLogout} className="text-sm text-primary-500 hover:text-primary-600">
            {labels.logout}
          </button>
        </div>

        {actionMessage && (
          <div className="p-3 bg-secondary-50 border border-secondary-200 text-secondary-700 rounded-md text-sm">
            {actionMessage}
          </div>
        )}

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{labels.payment}</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-neutral-500">{labels.status}</div>
              <div className="font-medium text-neutral-900">{statusLabel(payment?.status)}</div>
            </div>
            <div>
              <div className="text-neutral-500">{language === 'ru' ? 'Сумма' : language === 'uz' ? 'Summa' : 'Amount'}</div>
              <div className="font-medium text-neutral-900">
                {payment?.amount ? `${payment.amount} ${payment.currency}` : '-'}
              </div>
            </div>
            <div>
              <div className="text-neutral-500">{labels.invoice}</div>
              {payment?.id ? (
                <Link to={`/invoice/${payment.id}`} className="text-primary-500 hover:text-primary-600 font-medium">
                  {payment?.invoice_number || (language === 'ru' ? 'Открыть счет' : language === 'uz' ? 'Hisobni ochish' : 'Open invoice')}
                </Link>
              ) : (
                <span className="text-neutral-500">-</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="file"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            <button
              type="button"
              onClick={handleReceiptSubmit}
              disabled={!receiptFile || !payment?.id}
              className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-sm disabled:opacity-60"
            >
              {labels.uploadReceipt}
            </button>
            {payment?.receipt_path && (
              <a
                href={`/api/files?path=${encodeURIComponent(payment.receipt_path)}`}
                className="text-sm text-primary-500 hover:text-primary-600"
              >
                {language === 'ru' ? 'Скачать чек' : language === 'uz' ? 'Chekni yuklash' : 'Download receipt'}
              </a>
            )}
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{labels.submissions}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={submissionType}
              onChange={(e) => setSubmissionType(e.target.value)}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            >
              <option value="abstract">{language === 'ru' ? 'Тезисы' : language === 'uz' ? 'Tezis' : 'Abstract'}</option>
              <option value="article">{language === 'ru' ? 'Статья' : language === 'uz' ? 'Maqola' : 'Article'}</option>
              <option value="poster">{language === 'ru' ? 'Постер' : language === 'uz' ? 'Poster' : 'Poster'}</option>
            </select>
            <input
              type="text"
              value={submissionTitle}
              onChange={(e) => setSubmissionTitle(e.target.value)}
              placeholder={language === 'ru' ? 'Название' : language === 'uz' ? 'Sarlavha' : 'Title'}
              className="h-10 px-3 border border-neutral-200 rounded-sm"
            />
            <input type="file" onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
          <button
            type="button"
            onClick={handleSubmission}
            disabled={!submissionFile}
            className="h-10 px-4 bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-semibold rounded-sm disabled:opacity-60"
          >
            {labels.submit}
          </button>

          <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
            {submissions.length === 0 && (
              <p className="text-neutral-500">
                {language === 'ru'
                  ? 'Материалы еще не отправлены.'
                  : language === 'uz'
                  ? 'Hali material yuborilmadi.'
                  : 'No submissions yet.'}
              </p>
            )}
            {submissions.map((item: any) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium">{item.title || item.type}</span>
                  <span className="text-neutral-500 ml-2">({item.type})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500">{item.status}</span>
                  {item.file_path && (
                    <a
                      href={`/api/files?path=${encodeURIComponent(item.file_path)}`}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {language === 'ru' ? 'Скачать' : language === 'uz' ? 'Yuklab olish' : 'Download'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
