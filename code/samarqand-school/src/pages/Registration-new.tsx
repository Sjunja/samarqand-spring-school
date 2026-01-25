import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../lib/i18n';
import { submitRegistration, getRegistrationCount, isBackendConfigured } from '../lib/backend';
import { AlertCircle, CheckCircle, Users, Clock, Check, ExternalLink, Upload, X } from 'lucide-react';

const MAX_PARTICIPANTS = 100;
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfxA3CvmD9LRW1xp6axVM-q7vCMnTDEWOFLyuJVbJbmbGrieA/viewform?usp=sf_link';
const REGISTRATION_DEADLINE = '2026-03-01';

type ParticipationType = 'in-person' | 'online';
type ParticipantCategory = 'standard' | 'apu-member' | 'international';
type SpecialtyType = 'psychiatrist' | 'psychotherapist' | 'narcologist' | 'other';

interface RegistrationFormData {
  // Personal
  name: string;
  birthdate: string;
  email: string;
  phone: string;
  telegram: string;
  city: string;
  country: string;

  // Professional
  organization: string;
  position: string;
  specialty: SpecialtyType;
  specialtyOther: string;
  experience: string;

  // Participation
  participationType: ParticipationType | '';
  participantCategory: ParticipantCategory | '';
  membershipProof: File | null;

  // Consents
  consentData: boolean;
  consentRules: boolean;
  consentMedia: boolean;
}

// Pricing constants
const PRICING = {
  'in-person': { standard: 500000, apu: 450000, international: 150 },
  'online': { standard: 300000, apu: 270000, international: 150 }
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
    phone: '',
    telegram: '',
    city: '',
    country: 'Узбекистан',
    organization: '',
    position: '',
    specialty: '' as SpecialtyType,
    specialtyOther: '',
    experience: '',
    participationType: '',
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
    if (!formData.participationType || !formData.participantCategory) {
      return null;
    }

    const participationType = formData.participationType as ParticipationType;
    const category = formData.participantCategory as ParticipantCategory;

    if (category === 'international') {
      return {
        amount: PRICING[participationType].international,
        currency: 'USD',
        discount: 0,
        originalAmount: PRICING[participationType].international,
      };
    }

    const baseAmount = PRICING[participationType].standard;
    const finalAmount = category === 'apu-member'
      ? PRICING[participationType].apu
      : baseAmount;

    const discount = baseAmount - finalAmount;

    return {
      amount: finalAmount,
      currency: 'UZS',
      discount,
      originalAmount: baseAmount,
    };
  }, [formData.participationType, formData.participantCategory]);

  useEffect(() => {
    if (isDeadlinePassed) {
      setSlots(0);
      return;
    }

    setDbAvailable(false);
    setSlots(MAX_PARTICIPANTS);
  }, [isDeadlinePassed]);

  // Validate age (must be under 40)
  const validateAge = (birthdate: string): boolean => {
    if (!birthdate) return true;

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
          membershipProof: language === 'ru' ? 'Файл слишком большой (макс 5MB)' : 'File too large (max 5MB)'
        }));
        return;
      }

      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setValidationErrors(prev => ({
          ...prev,
          membershipProof: language === 'ru' ? 'Разрешены только PDF, JPG, PNG' : 'Only PDF, JPG, PNG allowed'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const errors: Record<string, string> = {};

    if (!validateAge(formData.birthdate)) {
      errors.birthdate = t('form.validation.age');
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
        : 'APU membership proof required';
    }

    if (!formData.consentData || !formData.consentRules) {
      errors.consent = language === 'ru'
        ? 'Необходимо согласие на обработку данных и правила участия'
        : 'Data processing and rules consent required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError(language === 'ru' ? 'Проверьте правильность заполнения формы' : 'Please check the form');
      return;
    }

    if (!isBackendConfigured || !dbAvailable) {
      window.open(GOOGLE_FORM_URL, '_blank');
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
        phone: '',
        telegram: '',
        city: '',
        country: 'Узбекистан',
        organization: '',
        position: '',
        specialty: '' as SpecialtyType,
        specialtyOther: '',
        experience: '',
        participationType: '',
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
        window.open(GOOGLE_FORM_URL, '_blank');
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

  const isClosed = (slots !== null && slots <= 0) || isDeadlinePassed;

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
              {/* Sidebar will be added in next part */}
              {/* Form will be added in next part */}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
