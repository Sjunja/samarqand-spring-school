import { useI18n } from '../lib/i18n';

interface PriceCalculatorProps {
  participationType: 'in-person' | 'online' | '';
  participationPackage?: 'basic' | 'premium' | 'starter' | '';
  participantCategory: 'standard' | 'apu-member' | 'international' | '';
  packageLabel?: string;
  calculatedAmount: {
    amount: number;
    currency: string;
    discount: number;
    originalAmount: number;
  } | null;
}

export default function PriceCalculator({
  participationType,
  participationPackage,
  participantCategory,
  packageLabel,
  calculatedAmount,
}: PriceCalculatorProps) {
  const { language } = useI18n();

  if (!calculatedAmount) {
    return (
      <div className="bg-neutral-100 border border-neutral-200 rounded-md p-6">
        <h3 className="font-semibold text-neutral-900 mb-3">
          {language === 'ru' ? 'Стоимость участия' : language === 'uz' ? 'Ishtirok narxi' : 'Participation Fee'}
        </h3>
        <p className="text-sm text-neutral-600">
          {language === 'ru'
            ? 'Выберите тип участия, пакет и категорию для расчета стоимости'
            : language === 'uz'
            ? 'Narxni hisoblash uchun ishtirok turi, paket va toifani tanlang'
            : 'Select participation type, package, and category to calculate fee'}
        </p>
      </div>
    );
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
  };

  const participationLabel = participationType === 'in-person'
    ? (language === 'ru' ? 'Очное участие' : language === 'uz' ? 'Shaxsan ishtirok' : 'In-person')
    : (language === 'ru' ? 'Онлайн участие' : language === 'uz' ? 'Onlayn ishtirok' : 'Online');

  const categoryLabel = participantCategory === 'apu-member'
    ? (language === 'ru' ? 'Член АПУ' : language === 'uz' ? 'APU aʼzosi' : 'APU member')
    : participantCategory === 'international'
    ? (language === 'ru' ? 'Иностранный участник' : language === 'uz' ? 'Xorijiy ishtirokchi' : 'International')
    : (language === 'ru' ? 'Стандартная' : language === 'uz' ? 'Standart' : 'Standard');

  return (
    <div className="bg-secondary-50 border border-secondary-200 rounded-md p-6">
      <h3 className="font-semibold text-neutral-900 mb-4">
        {language === 'ru' ? 'Стоимость участия' : language === 'uz' ? 'Ishtirok narxi' : 'Participation Fee'}
      </h3>

      <div className="space-y-3">
        {/* Participation Type */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-700">
            {packageLabel ? `${participationLabel} · ${packageLabel}` : participationLabel}
          </span>
          <span className="font-medium text-neutral-900">
            {formatAmount(calculatedAmount.originalAmount, calculatedAmount.currency)}
          </span>
        </div>

        {/* Category */}
        {participantCategory && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-700">
              {language === 'ru' ? 'Категория' : language === 'uz' ? 'Toifa' : 'Category'}
            </span>
            <span className="font-medium text-neutral-900">{categoryLabel}</span>
          </div>
        )}

        {/* Discount */}
        {calculatedAmount.discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-700">
              {language === 'ru' ? 'Скидка (член АПУ)' : language === 'uz' ? 'Chegirma (APU aʼzosi)' : 'Discount (APU member)'}
            </span>
            <span className="font-medium text-secondary-600">
              -{formatAmount(calculatedAmount.discount, calculatedAmount.currency)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-secondary-200 my-3"></div>

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-neutral-900">
            {language === 'ru' ? 'ИТОГО К ОПЛАТЕ' : language === 'uz' ? 'JAMI TOʻLOV' : 'TOTAL'}
          </span>
          <span className="text-2xl font-bold text-primary-500">
            {formatAmount(calculatedAmount.amount, calculatedAmount.currency)}
          </span>
        </div>
      </div>

      {/* Payment Note */}
      <div className="mt-4 pt-4 border-t border-secondary-200">
        <p className="text-xs text-neutral-600">
          {language === 'ru'
            ? 'После регистрации вы получите реквизиты для оплаты на указанный email'
            : language === 'uz'
            ? 'Roʻyxatdan oʻtgandan soʻng, siz koʻrsatilgan emailga toʻlov rekvizitlarini olasiz'
            : 'After registration, you will receive payment details at the provided email'}
        </p>
      </div>
    </div>
  );
}
