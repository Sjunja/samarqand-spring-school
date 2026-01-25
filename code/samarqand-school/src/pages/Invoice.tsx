import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { getParticipantOverview } from '../lib/backend';

const bankDetails = {
  local: [
    'ННО "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
    'г. Ташкент, ул. Мехржон 35',
    'р/с 20212000205048580001',
    'ОПЕРУ ЧАКБ «DAVR BANK»',
    'МФО: 00981',
    'ИНН: 207293171',
  ],
  foreign: [
    'ННО "O`ZBEKISTON PSIXIATRLARI ASSOTSIATSIYASI"',
    'г. Ташкент, ул. Мехржон 35',
    'р/с вал: 20212840905048580001',
    'ОПЕРУ ЧАКБ «DAVR BANK»',
    'МФО: 00981',
    'ИНН: 207293171',
  ],
};

export default function Invoice() {
  const { language } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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

  const payment = useMemo(() => (overview as any)?.payment || null, [overview]);
  const registration = useMemo(() => (overview as any)?.registration || null, [overview]);

  if (loading) {
    return (
      <main className="pt-24 pb-16">
        <div className="max-w-[800px] mx-auto px-4 text-center text-neutral-600">Loading...</div>
      </main>
    );
  }

  if (!payment || payment.id !== id) {
    return (
      <main className="pt-24 pb-16">
        <div className="max-w-[800px] mx-auto px-4 text-center text-neutral-600">
          {language === 'ru' ? 'Счет не найден.' : language === 'uz' ? 'Hisob topilmadi.' : 'Invoice not found.'}
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16">
      <div className="max-w-[800px] mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">
            {language === 'ru' ? 'Счет на оплату' : language === 'uz' ? 'Hisob' : 'Invoice'}
          </h1>
          <button
            onClick={() => window.print()}
            className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-sm"
          >
            {language === 'ru' ? 'Печать / PDF' : language === 'uz' ? 'Chop etish / PDF' : 'Print / PDF'}
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-md p-6 space-y-4">
          <div className="text-sm text-neutral-700 space-y-1">
            <div><strong>{language === 'ru' ? 'Получатель:' : language === 'uz' ? 'Qabul qiluvchi:' : 'Payee:'}</strong></div>
            {bankDetails.local.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-neutral-500">{language === 'ru' ? 'Счет' : language === 'uz' ? 'Hisob' : 'Invoice'}</div>
              <div className="font-medium text-neutral-900">{payment.invoice_number || '-'}</div>
            </div>
            <div>
              <div className="text-neutral-500">{language === 'ru' ? 'Сумма' : language === 'uz' ? 'Summa' : 'Amount'}</div>
              <div className="font-medium text-neutral-900">{payment.amount} {payment.currency}</div>
            </div>
            <div>
              <div className="text-neutral-500">{language === 'ru' ? 'Плательщик' : language === 'uz' ? 'Toʻlovchi' : 'Payer'}</div>
              <div className="font-medium text-neutral-900">{registration?.name || '-'}</div>
            </div>
            <div>
              <div className="text-neutral-500">Email</div>
              <div className="font-medium text-neutral-900">{registration?.email || '-'}</div>
            </div>
          </div>

          <div className="text-sm text-neutral-700 space-y-2">
            <div><strong>{language === 'ru' ? 'Реквизиты для оплаты в иностранной валюте:' : language === 'uz' ? 'Xorijiy valyutada toʻlov rekvizitlari:' : 'Foreign currency details:'}</strong></div>
            {bankDetails.foreign.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
