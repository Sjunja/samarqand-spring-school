import { useState, useEffect, useMemo } from 'react';
import { useI18n, type Language } from '../lib/i18n';
import { submitRegistration, getRegistrationCount, isBackendConfigured } from '../lib/backend';
import { AlertCircle, CheckCircle, Users, Clock, Check, Upload, X } from 'lucide-react';
import PriceCalculator from '../components/PriceCalculator';

const MAX_PARTICIPANTS = 100;
const REGISTRATION_DEADLINE = '2026-03-01';
const DISCOUNT_RATE = 0.1;

type ParticipationType = 'in-person' | 'online';
type ParticipationPackage = 'basic' | 'premium' | 'starter';
type ParticipantCategory = 'standard' | 'apu-member' | 'international';
type SpecialtyType = 'psychiatrist' | 'psychotherapist' | 'narcologist' | 'other';

type FeePackage = {
  name: string;
  features: string[];
  priceUz: string;
  priceIntl: string;
};

type FeeFormat = {
  title: string;
  packages: FeePackage[];
  discountNote: string;
};

type FeeContent = {
  title: string;
  formats: FeeFormat[];
  costUzLabel: string;
  costIntlLabel: string;
};

type PaymentContent = {
  title: string;
  intro: string;
  localTitle: string;
  foreignTitle: string;
};

interface RegistrationFormData {
  // Personal
  name: string;
  birthdate: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
  telegram: string;
  city: string;
  country: string;

  // Professional
  organization: string;
  position: string;
  specialty: SpecialtyType | '';
  specialtyOther: string;
  experience: string;

  // Participation
  participationType: ParticipationType | '';
  participationPackage: ParticipationPackage | '';
  participantCategory: ParticipantCategory | '';
  membershipProof: File | null;

  // Consents
  consentData: boolean;
  consentRules: boolean;
  consentMedia: boolean;
}

const PRICING: Record<ParticipationType, Partial<Record<ParticipationPackage, { uz: number; intl: number }>>> = {
  'in-person': {
    basic: { uz: 1500000, intl: 250 },
    premium: { uz: 2500000, intl: 350 },
  },
  online: {
    starter: { uz: 2000000, intl: 300 },
  },
};

const feeContent: Record<Language, FeeContent> = {
  ru: {
    title: 'Регистрационный взнос для участия в III Самаркандской весенней школе молодых психиатров и наркологов',
    costUzLabel: 'Стоимость для граждан Узбекистана',
    costIntlLabel: 'Стоимость для иностранных граждан',
    formats: [
      {
        title: 'Офлайн формат',
        packages: [
          {
            name: 'БАЗОВЫЙ ПАКЕТ',
            priceUz: '1 500 000 сум',
            priceIntl: '250 долларов США',
            features: [
              'Участие во всех научно-образовательных мероприятиях',
              'Ланч на все дни мероприятия',
              'Гала ужин',
              'Именной бейдж',
              'Брендированная ручка',
              'Брендированный блокнот',
              'Сертификат участника - 36 часов',
            ],
          },
          {
            name: 'ПРЕМИУМ ПАКЕТ',
            priceUz: '2 500 000 сум',
            priceIntl: '350 долларов США',
            features: [
              'Участие во всех научно-образовательных мероприятиях',
              'Ланч и ужин на все дни мероприятия с гостями',
              'Гала ужин',
              'Именной бейдж',
              'Брендированная ручка',
              'Брендированный блокнот',
              'Прогулка по Самарканду со спикерами',
              'Сертификат участника - 36 часов',
            ],
          },
        ],
        discountNote: '* Для членов Ассоциации психиатров Узбекистана, оплативших членский взнос за 2026 год: скидка 10% при предоставлении чека',
      },
      {
        title: 'Онлайн формат',
        packages: [
          {
            name: 'СТАРТОВЫЙ ПАКЕТ',
            priceUz: '2 000 000 сум',
            priceIntl: '300 долларов США',
            features: [
              'Индивидуальный доступ к видео/аудио трансляции тематических лекций, разбора клинических кейсов',
              'Сертификат участника - 36 часов',
            ],
          },
        ],
        discountNote: '* Для членов Ассоциации психиатров Узбекистана, оплативших членский взнос за 2026 год: скидка 10% при предоставлении чека',
      },
    ],
  },
  en: {
    title: 'Registration fee for participation in the III Samarqand Spring School for Young Psychiatrists and Narcologists',
    costUzLabel: 'Cost for citizens of Uzbekistan',
    costIntlLabel: 'Cost for foreign citizens',
    formats: [
      {
        title: 'In-person format',
        packages: [
          {
            name: 'BASIC PACKAGE',
            priceUz: '1,500,000 UZS',
            priceIntl: '250 USD',
            features: [
              'Participation in all scientific and educational events',
              'Lunch for all days of the event',
              'Gala Dinner',
              'Name badge',
              'Branded pen',
              'Branded notebook',
              'Participant certificate - 36 hours',
            ],
          },
          {
            name: 'PREMIUM PACKAGE',
            priceUz: '2,500,000 UZS',
            priceIntl: '350 USD',
            features: [
              'Participation in all scientific and educational events',
              'Lunch and dinner for all days of the event with guests',
              'Gala Dinner',
              'Name badge',
              'Branded pen',
              'Branded notebook',
              'Samarkand city walk with speakers',
              'Participant certificate - 36 hours',
            ],
          },
        ],
        discountNote: '* For members of the Psychiatric Association of Uzbekistan who have paid the 2026 membership fee: 10% discount upon presenting the receipt',
      },
      {
        title: 'Online format',
        packages: [
          {
            name: 'STARTER PACKAGE',
            priceUz: '2,000,000 UZS',
            priceIntl: '300 USD',
            features: [
              'Individual access to video/audio streaming of thematic lectures and clinical case reviews',
              'Participant certificate - 36 hours',
            ],
          },
        ],
        discountNote: '* For members of the Psychiatric Association of Uzbekistan who have paid the 2026 membership fee: 10% discount upon presenting the receipt',
      },
    ],
  },
  uz: {
    title: 'III Samarqand bahorgi yosh psixiatrlar va narkologlar maktabida ishtirok etish uchun roʻyxatdan oʻtish badali',
    costUzLabel: 'Oʻzbekiston fuqarolari uchun narx',
    costIntlLabel: 'Xorijiy fuqarolar uchun narx',
    formats: [
      {
        title: 'Oflayn format',
        packages: [
          {
            name: 'BAZAVIY PAKET',
            priceUz: '1 500 000 soʻm',
            priceIntl: '250 AQSH dollari',
            features: [
              'Barcha ilmiy-taʼlimiy tadbirlarda ishtirok',
              'Tadbirning barcha kunlari uchun tushlik',
              'Gala kechki ovqat',
              'Nomli beydj',
              'Brendlangan ruchka',
              'Brendlangan daftar',
              'Ishtirokchi sertifikati - 36 soat',
            ],
          },
          {
            name: 'PREMIUM PAKET',
            priceUz: '2 500 000 soʻm',
            priceIntl: '350 AQSH dollari',
            features: [
              'Barcha ilmiy-taʼlimiy tadbirlarda ishtirok',
              'Mehmonlar bilan tadbirning barcha kunlari uchun tushlik va kechki ovqat',
              'Gala kechki ovqat',
              'Nomli beydj',
              'Brendlangan ruchka',
              'Brendlangan daftar',
              'Spikerlar bilan Samarqand boʻylab sayr',
              'Ishtirokchi sertifikati - 36 soat',
            ],
          },
        ],
        discountNote: '* Oʻzbekiston Psixiatrlari Assotsiatsiyasi aʼzolari uchun (2026 yil aʼzolik badali toʻlangan): chek taqdim etilganda 10% chegirma',
      },
      {
        title: 'Onlayn format',
        packages: [
          {
            name: 'STARTER PAKET',
            priceUz: '2 000 000 soʻm',
            priceIntl: '300 AQSH dollari',
            features: [
              'Tematik maʼruzalar va klinik holatlarni tahlil qilishning video/audio translyatsiyasiga individual kirish',
              'Ishtirokchi sertifikati - 36 soat',
            ],
          },
        ],
        discountNote: '* Oʻzbekiston Psixiatrlari Assotsiatsiyasi aʼzolari uchun (2026 yil aʼzolik badali toʻlangan): chek taqdim etilganda 10% chegirma',
      },
    ],
  },
};

const paymentContent: Record<Language, PaymentContent> = {
  ru: {
    title: 'Оплата',
    intro: 'Оплата производится на расчетный счет Ассоциации психиатров Узбекистана.',
    localTitle: 'Банковские реквизиты для оплаты в национальной валюте:',
    foreignTitle: 'Банковские реквизиты для оплаты в иностранной валюте:',
  },
  en: {
    title: 'Payment',
    intro: 'Payment is made to the settlement account of the Psychiatric Association of Uzbekistan.',
    localTitle: 'Bank details for payment in national currency:',
    foreignTitle: 'Bank details for payment in foreign currency:',
  },
  uz: {
    title: 'Toʻlov',
    intro: 'Toʻlov Oʻzbekiston Psixiatrlari Assotsiatsiyasining hisob raqamiga amalga oshiriladi.',
    localTitle: 'Milliy valyutada toʻlov uchun bank rekvizitlari:',
    foreignTitle: 'Xorijiy valyutada toʻlov uchun bank rekvizitlari:',
  },
};

const packageLabels: Record<Language, { title: string; basic: string; premium: string; starter: string }> = {
  ru: {
    title: 'Пакет участия',
    basic: 'Базовый пакет',
    premium: 'Премиум пакет',
    starter: 'Стартовый пакет',
  },
  en: {
    title: 'Participation Package',
    basic: 'Basic package',
    premium: 'Premium package',
    starter: 'Starter package',
  },
  uz: {
    title: 'Ishtirok paketi',
    basic: 'Bazaviy paket',
    premium: 'Premium paket',
    starter: 'Starter paket',
  },
};

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

export default function Registration() {
  const { language, t } = useI18n();
  const [slots, setSlots] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dbAvailable, setDbAvailable] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    birthdate: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    telegram: '',
    city: '',
    country: 'Узбекистан',
    organization: '',
    position: '',
    specialty: '',
    specialtyOther: '',
    experience: '',
    participationType: '',
    participationPackage: '',
    participantCategory: '',
    membershipProof: null,
    consentData: false,
    consentRules: false,
    consentMedia: false,
  });

  // Check if registration is closed by deadline
  const isDeadlinePassed = useMemo(() => {
    const deadline = new Date(REGISTRATION_DEADLINE);
    const now = new Date();
    return now > deadline;
  }, []);

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    const deadline = new Date(REGISTRATION_DEADLINE);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, []);

  // Calculate registration amount
  const calculatedAmount = useMemo(() => {
    if (!formData.participationType || !formData.participationPackage || !formData.participantCategory) {
      return null;
    }

    const pricingByType = PRICING[formData.participationType];
    const pricing = pricingByType?.[formData.participationPackage];

    if (!pricing) {
      return null;
    }

    if (formData.participantCategory === 'international') {
      return {
        amount: pricing.intl,
        currency: 'USD',
        discount: 0,
        originalAmount: pricing.intl,
      };
    }

    const baseAmount = pricing.uz;
    const discount = formData.participantCategory === 'apu-member'
      ? Math.round(baseAmount * DISCOUNT_RATE)
      : 0;

    return {
      amount: baseAmount - discount,
      currency: 'UZS',
      discount,
      originalAmount: baseAmount,
    };
  }, [formData.participationType, formData.participationPackage, formData.participantCategory]);

  useEffect(() => {
    if (isDeadlinePassed) {
      setSlots(0);
      return;
    }
    if (!isBackendConfigured) {
      setDbAvailable(false);
      setSlots(MAX_PARTICIPANTS);
      return;
    }

    let isMounted = true;
    setDbAvailable(true);
    getRegistrationCount()
      .then((count) => {
        if (!isMounted) return;
        const remaining = Math.max(0, MAX_PARTICIPANTS - count);
        setSlots(remaining);
      })
      .catch(() => {
        if (!isMounted) return;
        setDbAvailable(false);
        setSlots(MAX_PARTICIPANTS);
      });

    return () => {
      isMounted = false;
    };
  }, [isDeadlinePassed]);

  useEffect(() => {
    setFormData(prev => {
      if (prev.participationType === 'online' && prev.participationPackage !== 'starter') {
        return { ...prev, participationPackage: 'starter' };
      }
      if (prev.participationType === 'in-person' && prev.participationPackage === 'starter') {
        return { ...prev, participationPackage: '' };
      }
      return prev;
    });
  }, [formData.participationType]);

  useEffect(() => {
    if (formData.participantCategory !== 'apu-member' && formData.membershipProof) {
      setFormData(prev => ({ ...prev, membershipProof: null }));
    }
  }, [formData.participantCategory]);

  // Validate age (must be under 40)
  const validateAge = (birthdate: string): boolean => {
    if (!birthdate) return false;

    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age <= 40;
  };

  // Validate telegram username
  const validateTelegram = (telegram: string): boolean => {
    if (!telegram) return true;
    return telegram.startsWith('@');
  };

  // Validate experience
  const validateExperience = (experience: string): boolean => {
    if (!experience) return true;
    const exp = parseInt(experience);
    return !isNaN(exp) && exp >= 1;
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          membershipProof: language === 'ru'
            ? 'Файл слишком большой (макс 5MB)'
            : language === 'uz'
            ? 'Fayl hajmi juda katta (maks 5MB)'
            : 'File too large (max 5MB)'
        }));
        return;
      }

      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          membershipProof: language === 'ru'
            ? 'Разрешены только PDF, JPG, PNG'
            : language === 'uz'
            ? 'Faqat PDF, JPG, PNG ruxsat etiladi'
            : 'Only PDF, JPG, PNG allowed'
        }));
        return;
      }

      setFormData({ ...formData, membershipProof: file });
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.membershipProof;
        return newErrors;
      });
    }
  };

  const handleFileRemove = () => {
    setFormData({ ...formData, membershipProof: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!formData.participationType) {
      errors.participationType = language === 'ru'
        ? 'Выберите формат участия'
        : language === 'uz'
        ? 'Ishtirok formatini tanlang'
        : 'Select participation format';
    }

    if (!formData.participationPackage) {
      errors.participationPackage = language === 'ru'
        ? 'Выберите пакет участия'
        : language === 'uz'
        ? 'Ishtirok paketini tanlang'
        : 'Select participation package';
    }

    if (!formData.participantCategory) {
      errors.participantCategory = language === 'ru'
        ? 'Выберите категорию участника'
        : language === 'uz'
        ? 'Ishtirokchi toifasini tanlang'
        : 'Select participant category';
    }

    if (formData.participationType === 'in-person') {
      if (!formData.birthdate) {
        errors.birthdate = language === 'ru'
          ? 'Укажите дату рождения'
          : language === 'uz'
          ? 'Tugʻilgan sanani kiriting'
          : 'Enter your date of birth';
      } else if (!validateAge(formData.birthdate)) {
        errors.birthdate = t('form.validation.age');
      }
    }

    if (!formData.password || formData.password.length < 8) {
      errors.password = language === 'ru'
        ? 'Пароль должен быть не менее 8 символов'
        : language === 'uz'
        ? 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak'
        : 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = language === 'ru'
        ? 'Пароли не совпадают'
        : language === 'uz'
        ? 'Parollar mos kelmadi'
        : 'Passwords do not match';
    }

    if (formData.specialty === 'other' && !formData.specialtyOther.trim()) {
      errors.specialtyOther = language === 'ru'
        ? 'Укажите специальность'
        : language === 'uz'
        ? 'Ixtisoslikni kiriting'
        : 'Please specify the specialty';
    }

    if (!validateExperience(formData.experience)) {
      errors.experience = t('form.validation.experience');
    }

    if (formData.telegram && !validateTelegram(formData.telegram)) {
      errors.telegram = t('form.validation.telegram');
    }

    if (formData.participantCategory === 'apu-member' && !formData.membershipProof) {
      errors.membershipProof = language === 'ru'
        ? 'Требуется подтверждение членства АПУ'
        : language === 'uz'
        ? 'APU aʼzoligi tasdiqlovi talab qilinadi'
        : 'APU membership proof required';
    }

    if (!formData.consentData || !formData.consentRules) {
      errors.consent = language === 'ru'
        ? 'Необходимо согласие на обработку данных и правила участия'
        : language === 'uz'
        ? 'Maʼlumotlarni qayta ishlash va ishtirok qoidalariga rozilik talab qilinadi'
        : 'Data processing and rules consent required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(language === 'ru'
        ? 'Проверьте правильность заполнения формы'
        : language === 'uz'
        ? 'Iltimos, formani tekshiring'
        : 'Please check the form');
      return;
    }

    if (!isBackendConfigured || !dbAvailable) {
      setError(language === 'ru'
        ? 'Регистрация временно недоступна. Попробуйте позже.'
        : language === 'uz'
        ? 'Roʻyxatdan oʻtish vaqtincha mavjud emas. Keyinroq qayta urinib koʻring.'
        : 'Registration temporarily unavailable. Please try again later.');
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    const result = await submitRegistration(formData);

    if (result.success) {
      setSuccess(true);
      setFormData({
        name: '',
        birthdate: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        telegram: '',
        city: '',
        country: 'Узбекистан',
        organization: '',
        position: '',
        specialty: '',
        specialtyOther: '',
        experience: '',
        participationType: '',
        participationPackage: '',
        participantCategory: '',
        membershipProof: null,
        consentData: false,
        consentRules: false,
        consentMedia: false,
      });
      if (slots !== null) setSlots(slots - 1);
    } else {
      if (result.error === 'Database not configured' || result.error === 'Connection error') {
        setDbAvailable(false);
        setError(language === 'ru'
          ? 'Ошибка подключения к базе данных. Попробуйте позже.'
          : language === 'uz'
          ? 'Maʼlumotlar bazasiga ulanishda xatolik. Keyinroq qayta urinib koʻring.'
          : 'Database connection error. Please try again later.');
      } else {
        setError(result.error || t('form.error'));
      }
    }

    setLoading(false);
  };

  const requirements = [
    t('reg.req.1'),
    t('reg.req.2'),
    t('reg.req.3'),
    t('reg.req.4'),
  ];

  const feeData = feeContent[language];
  const paymentData = paymentContent[language];
  const packageData = packageLabels[language];
  const packageLabel = formData.participationPackage ? packageData[formData.participationPackage] : '';

  const isClosed = (slots !== null && slots <= 0) || isDeadlinePassed;

  const personalTitle = language === 'ru' ? 'Личные данные' : language === 'uz' ? 'Shaxsiy maʼlumotlar' : 'Personal Information';
  const professionalTitle = language === 'ru' ? 'Профессиональные данные' : language === 'uz' ? 'Kasbiy maʼlumotlar' : 'Professional Information';
  const participationTitle = language === 'ru' ? 'Формат участия' : language === 'uz' ? 'Ishtirok formati' : 'Participation';
  const consentsTitle = language === 'ru' ? 'Согласия' : language === 'uz' ? 'Roziliklar' : 'Consents';

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white mb-4">{t('reg.title')}</h1>
          <p className="text-xl text-white/90">{t('reg.deadline')}</p>
          {!isDeadlinePassed && daysRemaining > 0 && (
            <p className="text-lg text-white/80 mt-2">
              {language === 'ru'
                ? `До окончания регистрации: ${daysRemaining} дн.`
                : language === 'uz'
                ? `Roʻyxatdan oʻtish tugashiga: ${daysRemaining} kun`
                : `Days remaining: ${daysRemaining}`}
            </p>
          )}
        </div>
      </section>

      {isDeadlinePassed && (
        <section className="py-12">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-error/10 border border-error/30 rounded-md p-8 text-center">
              <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {language === 'ru' ? 'Регистрация закрыта' : language === 'uz' ? 'Roʻyxatdan oʻtish yopildi' : 'Registration Closed'}
              </h2>
              <p className="text-neutral-700 mb-4">
                {language === 'ru'
                  ? `Дедлайн регистрации (1 марта 2026) истек.`
                  : language === 'uz'
                  ? `Roʻyxatdan oʻtish muddati (2026-yil 1-mart) tugadi.`
                  : `Registration deadline (March 1, 2026) has passed.`}
              </p>
              <p className="text-sm text-neutral-600">
                {language === 'ru'
                  ? 'Для получения дополнительной информации свяжитесь с оргкомитетом.'
                  : language === 'uz'
                  ? 'Qoʻshimcha maʼlumot olish uchun tashkiliy qoʻmita bilan bogʻlaning.'
                  : 'For more information, please contact the organizing committee.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {!isDeadlinePassed && (
        <section className="py-12 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                {/* Slots Counter */}
                <div className="bg-primary-50 border border-primary-200 rounded-md p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-primary-500" />
                    <span className="font-semibold text-neutral-900">{t('reg.slots')}</span>
                  </div>
                  <div className={`text-4xl font-bold ${isClosed ? 'text-error' : 'text-primary-500'}`}>
                    {slots !== null ? (isClosed ? t('reg.closed') : `${slots} / 100`) : '100 / 100'}
                  </div>
                </div>

                {/* Notice */}
                <div className="bg-warning/10 border border-warning/30 rounded-md p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-700">{t('reg.notice')}</p>
                </div>

                {/* Price Calculator */}
                <PriceCalculator
                  participationType={formData.participationType}
                  participationPackage={formData.participationPackage}
                  participantCategory={formData.participantCategory}
                  packageLabel={packageLabel}
                  calculatedAmount={calculatedAmount}
                />

                {/* Registration Fees */}
                <div className="bg-secondary-50 border border-secondary-200 rounded-md p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">{feeData.title}</h3>
                  <div className="space-y-6">
                    {feeData.formats.map((format, formatIdx) => (
                      <div key={formatIdx} className="space-y-3">
                        <div className="text-sm font-semibold uppercase text-neutral-700">{format.title}</div>
                        <div className="space-y-4">
                          {format.packages.map((pkg, pkgIdx) => (
                            <div key={pkgIdx} className="rounded-sm border border-secondary-200 bg-white/60 p-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="text-sm font-semibold text-neutral-900">{pkg.name}</div>
                                <div className="text-sm font-semibold text-primary-500">{pkg.priceUz}</div>
                              </div>
                              <div className="text-xs text-neutral-500">{feeData.costUzLabel}</div>
                              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-neutral-700">
                                {pkg.features.map((feature, featureIdx) => (
                                  <li key={featureIdx}>{feature}</li>
                                ))}
                              </ul>
                              <div className="mt-3 text-xs text-neutral-600">
                                <span className="font-medium">{feeData.costIntlLabel}:</span> {pkg.priceIntl}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-neutral-600">{format.discountNote}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-info/10 border border-info/30 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{paymentData.title}</h3>
                  <p className="text-xs text-neutral-700 mb-3">{paymentData.intro}</p>
                  <div className="space-y-3 text-xs text-neutral-700">
                    <div>
                      <div className="font-medium">{paymentData.localTitle}</div>
                      <div className="mt-1 space-y-1">
                        {bankDetails.local.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{paymentData.foreignTitle}</div>
                      <div className="mt-1 space-y-1">
                        {bankDetails.foreign.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journal Publication */}
                <div className="bg-info/10 border border-info/30 rounded-md p-4">
                  <p className="text-sm text-neutral-700 font-medium mb-1">{t('reg.journal')}</p>
                  <p className="text-xs text-neutral-600">
                    {language === 'ru'
                      ? 'Материалы конференции будут опубликованы в научно-практическом журнале'
                      : language === 'uz'
                      ? 'Konferensiya materiallari ilmiy-amaliy jurnalda nashr etiladi'
                      : 'Conference materials will be published in the scientific-practical journal'}
                  </p>
                </div>

                {/* Accommodation Info */}
                <div className="bg-warning/10 border border-warning/30 rounded-md p-4">
                  <p className="text-sm text-neutral-700 font-medium mb-1">
                    {language === 'ru' ? 'Проживание' : language === 'uz' ? 'Turar joy' : 'Accommodation'}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {language === 'ru'
                      ? 'Оргкомитет не участвует в организации размещения. Список рекомендованных отелей будет опубликован на сайте.'
                      : language === 'uz'
                      ? 'Tashkiliy qoʻmita turar joy tashkil etishda ishtirok etmaydi. Tavsiya etilgan mehmonxonalar roʻyxati saytda eʼlon qilinadi.'
                      : 'Organizing committee does not participate in accommodation arrangements. List of recommended hotels will be published on the website.'}
                  </p>
                </div>

                {/* Requirements */}
                <div className="bg-white border border-neutral-200 rounded-md p-6">
                  <h3 className="font-semibold text-neutral-900 mb-4">{t('reg.requirements')}</h3>
                  <ul className="space-y-3">
                    {requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-neutral-700">
                        <Check className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deadline */}
                <div className="bg-neutral-100 rounded-md p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">{t('reg.deadline')}</span>
                </div>
              </div>
              <div className="lg:col-span-2">
                {success ? (
                  <div className="bg-secondary-50 border border-secondary-200 rounded-md p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-secondary-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">{t('form.success')}</h2>
                    <p className="text-neutral-700">
                      {language === 'ru'
                        ? 'Мы отправим вам подтверждение на email. Вход в личный кабинет доступен по вашему email и паролю.'
                        : language === 'uz'
                        ? 'Tasdiqlash xati emailingizga yuboriladi. Shaxsiy kabinetga email va parol orqali kirasiz.'
                        : 'We will send you a confirmation email. You can log in using your email and password.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-md p-6 lg:p-8 space-y-8">
                    {error && (
                      <div className="p-4 bg-error/10 border border-error/30 rounded-md flex items-center gap-3 text-error">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                      </div>
                    )}


                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{personalTitle}</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.name')} *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.birthdate')}</label>
                          <input
                            type="date"
                            value={formData.birthdate}
                            onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                          {validationErrors.birthdate && (
                            <p className="mt-1 text-xs text-error">{validationErrors.birthdate}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.email')} *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            {language === 'ru' ? 'Пароль' : language === 'uz' ? 'Parol' : 'Password'} *
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                          {validationErrors.password && (
                            <p className="mt-1 text-xs text-error">{validationErrors.password}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            {language === 'ru' ? 'Повтор пароля' : language === 'uz' ? 'Parolni tasdiqlash' : 'Confirm password'} *
                          </label>
                          <input
                            type="password"
                            required
                            value={formData.passwordConfirm}
                            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                          {validationErrors.passwordConfirm && (
                            <p className="mt-1 text-xs text-error">{validationErrors.passwordConfirm}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.phone')}</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.telegram')}</label>
                          <input
                            type="text"
                            value={formData.telegram}
                            onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                            placeholder="@username"
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                          {validationErrors.telegram && (
                            <p className="mt-1 text-xs text-error">{validationErrors.telegram}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.city')}</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.country')}</label>
                          <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{professionalTitle}</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.organization')}</label>
                          <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.position')}</label>
                          <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.specialty')}</label>
                          <select
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value as SpecialtyType })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          >
                            <option value="">{language === 'ru' ? 'Выберите специальность' : language === 'uz' ? 'Ixtisoslikni tanlang' : 'Select specialty'}</option>
                            <option value="psychiatrist">{t('form.specialty.psychiatrist')}</option>
                            <option value="psychotherapist">{t('form.specialty.psychotherapist')}</option>
                            <option value="narcologist">{t('form.specialty.narcologist')}</option>
                            <option value="other">{t('form.specialty.other')}</option>
                          </select>
                        </div>
                        {formData.specialty === 'other' && (
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.specialty.other')}</label>
                            <input
                              type="text"
                              value={formData.specialtyOther}
                              onChange={(e) => setFormData({ ...formData, specialtyOther: e.target.value })}
                              placeholder={t('form.specialty.other.placeholder')}
                              className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              disabled={isClosed}
                            />
                            {validationErrors.specialtyOther && (
                              <p className="mt-1 text-xs text-error">{validationErrors.specialtyOther}</p>
                            )}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.experience')}</label>
                          <input
                            type="number"
                            min="0"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                            className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isClosed}
                          />
                          {validationErrors.experience && (
                            <p className="mt-1 text-xs text-error">{validationErrors.experience}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{participationTitle}</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-3">{t('form.participation.type')}</label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 cursor-pointer">
                              <input
                                type="radio"
                                name="participationType"
                                value="in-person"
                                checked={formData.participationType === 'in-person'}
                                onChange={(e) => setFormData({ ...formData, participationType: e.target.value as ParticipationType })}
                                disabled={isClosed}
                              />
                              <span className="text-sm text-neutral-700">{t('form.participation.inperson')}</span>
                            </label>
                            <label className="flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 cursor-pointer">
                              <input
                                type="radio"
                                name="participationType"
                                value="online"
                                checked={formData.participationType === 'online'}
                                onChange={(e) => setFormData({ ...formData, participationType: e.target.value as ParticipationType })}
                                disabled={isClosed}
                              />
                              <span className="text-sm text-neutral-700">{t('form.participation.online')}</span>
                            </label>
                          </div>
                          {validationErrors.participationType && (
                            <p className="mt-1 text-xs text-error">{validationErrors.participationType}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-3">{packageData.title}</label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <label className={`flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 ${formData.participationType !== 'in-person' ? 'opacity-50' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="participationPackage"
                                value="basic"
                                checked={formData.participationPackage === 'basic'}
                                onChange={(e) => setFormData({ ...formData, participationPackage: e.target.value as ParticipationPackage })}
                                disabled={isClosed || formData.participationType !== 'in-person'}
                              />
                              <span className="text-sm text-neutral-700">{packageData.basic}</span>
                            </label>
                            <label className={`flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 ${formData.participationType !== 'in-person' ? 'opacity-50' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="participationPackage"
                                value="premium"
                                checked={formData.participationPackage === 'premium'}
                                onChange={(e) => setFormData({ ...formData, participationPackage: e.target.value as ParticipationPackage })}
                                disabled={isClosed || formData.participationType !== 'in-person'}
                              />
                              <span className="text-sm text-neutral-700">{packageData.premium}</span>
                            </label>
                            <label className={`flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 ${formData.participationType !== 'online' ? 'opacity-50' : 'cursor-pointer'}`}>
                              <input
                                type="radio"
                                name="participationPackage"
                                value="starter"
                                checked={formData.participationPackage === 'starter'}
                                onChange={(e) => setFormData({ ...formData, participationPackage: e.target.value as ParticipationPackage })}
                                disabled={isClosed || formData.participationType !== 'online'}
                              />
                              <span className="text-sm text-neutral-700">{packageData.starter}</span>
                            </label>
                          </div>
                          {validationErrors.participationPackage && (
                            <p className="mt-1 text-xs text-error">{validationErrors.participationPackage}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-3">{t('form.participant.category')}</label>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <label className="flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 cursor-pointer">
                              <input
                                type="radio"
                                name="participantCategory"
                                value="standard"
                                checked={formData.participantCategory === 'standard'}
                                onChange={(e) => setFormData({ ...formData, participantCategory: e.target.value as ParticipantCategory })}
                                disabled={isClosed}
                              />
                              <span className="text-sm text-neutral-700">{t('form.category.standard')}</span>
                            </label>
                            <label className="flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 cursor-pointer">
                              <input
                                type="radio"
                                name="participantCategory"
                                value="apu-member"
                                checked={formData.participantCategory === 'apu-member'}
                                onChange={(e) => setFormData({ ...formData, participantCategory: e.target.value as ParticipantCategory })}
                                disabled={isClosed}
                              />
                              <span className="text-sm text-neutral-700">{t('form.category.apu')}</span>
                            </label>
                            <label className="flex items-center gap-3 border border-neutral-200 rounded-sm px-4 py-3 cursor-pointer">
                              <input
                                type="radio"
                                name="participantCategory"
                                value="international"
                                checked={formData.participantCategory === 'international'}
                                onChange={(e) => setFormData({ ...formData, participantCategory: e.target.value as ParticipantCategory })}
                                disabled={isClosed}
                              />
                              <span className="text-sm text-neutral-700">{t('form.category.international')}</span>
                            </label>
                          </div>
                          {validationErrors.participantCategory && (
                            <p className="mt-1 text-xs text-error">{validationErrors.participantCategory}</p>
                          )}
                        </div>

                        {formData.participantCategory === 'apu-member' && (
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">{t('form.membership.proof')}</label>
                            <div className="border border-dashed border-neutral-300 rounded-sm p-4">
                              {formData.membershipProof ? (
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-neutral-700 break-all">{formData.membershipProof.name}</div>
                                  <button
                                    type="button"
                                    onClick={handleFileRemove}
                                    className="p-1 text-neutral-500 hover:text-neutral-700"
                                    disabled={isClosed}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className={`flex items-center gap-2 text-sm text-neutral-600 ${isClosed ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                  <Upload className="w-4 h-4" />
                                  {t('form.membership.upload')}
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    disabled={isClosed}
                                  />
                                </label>
                              )}
                            </div>
                            {validationErrors.membershipProof && (
                              <p className="mt-1 text-xs text-error">{validationErrors.membershipProof}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">{consentsTitle}</h3>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3 text-sm text-neutral-700">
                          <input
                            type="checkbox"
                            checked={formData.consentData}
                            onChange={(e) => setFormData({ ...formData, consentData: e.target.checked })}
                            disabled={isClosed}
                          />
                          {t('form.consent.data')}
                        </label>
                        <label className="flex items-start gap-3 text-sm text-neutral-700">
                          <input
                            type="checkbox"
                            checked={formData.consentRules}
                            onChange={(e) => setFormData({ ...formData, consentRules: e.target.checked })}
                            disabled={isClosed}
                          />
                          {t('form.consent.rules')}
                        </label>
                        <label className="flex items-start gap-3 text-sm text-neutral-700">
                          <input
                            type="checkbox"
                            checked={formData.consentMedia}
                            onChange={(e) => setFormData({ ...formData, consentMedia: e.target.checked })}
                            disabled={isClosed}
                          />
                          {t('form.consent.media')}
                        </label>
                        {validationErrors.consent && (
                          <p className="text-xs text-error">{validationErrors.consent}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || isClosed}
                      className="w-full h-14 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white font-semibold rounded-sm transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? '...' : t('form.submit')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
