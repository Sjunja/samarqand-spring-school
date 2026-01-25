import { Link } from 'react-router-dom';
import { useI18n, getLogoPath } from '../lib/i18n';
import { Users, Calendar, Mic2, Globe, CalendarDays, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const { language, t } = useI18n();

  const stats = [
    { icon: Users, value: '50+50', label: t('stats.participants') },
    { icon: Calendar, value: '5', label: t('stats.days') },
    { icon: Mic2, value: '15+', label: t('stats.speakers') },
    { icon: Globe, value: '3', label: t('stats.languages') },
  ];

  const dates = [
    { date: language === 'ru' ? '1 марта 2026' : language === 'uz' ? '1 mart 2026' : 'March 1, 2026', label: t('dates.abstract') },
    { date: language === 'ru' ? '1 марта 2026' : language === 'uz' ? '1 mart 2026' : 'March 1, 2026', label: t('dates.registration') },
    { date: language === 'ru' ? '8-12 апреля 2026' : language === 'uz' ? '8-12 aprel 2026' : 'April 8-12, 2026', label: t('dates.event') },
  ];

  const organizers = [
    t('org.0'),
    t('org.1'),
    t('org.2'),
    t('org.3'),
    t('org.4'),
    t('org.5'),
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[550px] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-600 to-primary-500 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <img
            src={getLogoPath(language)}
            alt="Samarqand School"
            className="h-20 lg:h-28 w-auto mx-auto mb-8 brightness-0 invert"
          />
          <h1 className="text-3xl sm:text-4xl lg:text-hero font-bold text-white mb-4 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-2">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 text-lg mb-8">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              {t('hero.dates')}
            </span>
            <span className="hidden sm:inline">|</span>
            <span>{t('hero.location')}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/registration"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 bg-white text-primary-500 text-lg font-semibold rounded-sm hover:bg-neutral-100 transition-colors duration-200"
            >
              {t('hero.register')}
            </Link>
            <Link
              to="/abstracts"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-sm hover:bg-white/10 transition-colors duration-200"
            >
              {t('hero.submit')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-neutral-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-md p-6 text-center shadow-card">
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                <div className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-1">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-subtitle lg:text-title font-bold text-neutral-900 mb-6">
                {t('about.title')}
              </h2>
              <p className="text-body-lg text-neutral-700 mb-6 leading-relaxed">
                {t('about.description')}
              </p>
              <div className="bg-secondary-50 border-l-4 border-secondary-500 p-4 rounded-r-md">
                <h3 className="font-semibold text-neutral-900 mb-2">{t('about.audience')}</h3>
                <p className="text-neutral-700">{t('about.audience.desc')}</p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                {language === 'ru' ? 'Подробнее' : language === 'uz' ? 'Batafsil' : 'Learn more'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">{t('organizers.title')}</h3>
              <ul className="space-y-3">
                {organizers.map((org, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-700">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    {org}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates Timeline */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-subtitle lg:text-title font-bold text-neutral-900 text-center mb-12">
            {t('dates.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {dates.map((item, idx) => (
              <div key={idx} className="relative bg-white rounded-md p-6 shadow-card border-t-4 border-primary-500">
                <div className="text-sm font-medium text-primary-500 mb-2">
                  {idx === 0 && <FileText className="w-5 h-5 inline mr-2" />}
                  {idx === 1 && <Users className="w-5 h-5 inline mr-2" />}
                  {idx === 2 && <CalendarDays className="w-5 h-5 inline mr-2" />}
                  {item.label}
                </div>
                <div className="text-2xl font-bold text-neutral-900">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-subtitle font-bold text-neutral-900 mb-6">
            {language === 'ru' ? 'Языки мероприятия' : language === 'uz' ? 'Tadbir tillari' : 'Event Languages'}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-primary-50 rounded-md">
              <div className="text-2xl font-bold text-primary-500 mb-2">Русский</div>
              <p className="text-neutral-700">
                {language === 'ru' 
                  ? 'Основной язык для лекций и общения'
                  : language === 'uz'
                  ? 'Maʼruzalar va muloqot uchun asosiy til'
                  : 'Main language for lectures and communication'}
              </p>
            </div>
            <div className="p-6 bg-primary-50 rounded-md">
              <div className="text-2xl font-bold text-primary-500 mb-2">Узбекский</div>
              <p className="text-neutral-700">
                {language === 'ru' 
                  ? 'Для местных участников и презентаций'
                  : language === 'uz'
                  ? 'Mahalliy ishtirokchilar va taqdimotlar uchun'
                  : 'For local participants and presentations'}
              </p>
            </div>
            <div className="p-6 bg-primary-50 rounded-md">
              <div className="text-2xl font-bold text-primary-500 mb-2">Английский</div>
              <p className="text-neutral-700">
                {language === 'ru' 
                  ? 'Для международных спикеров и публикаций'
                  : language === 'uz'
                  ? 'Xalqaro maʼruzachilar va nashrlar uchun'
                  : 'For international speakers and publications'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary-500">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-subtitle lg:text-title font-bold text-white mb-6">
            {language === 'ru' ? 'Присоединяйтесь к нам в Самарканде!' : language === 'uz' ? 'Samarqandda bizga qoʻshiling!' : 'Join us in Samarkand!'}
          </h2>
          <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            {language === 'ru' 
              ? 'Участие платное согласно утвержденному прайсу. Скидка 10% для участников, оплативших членские взносы за 2026 год.'
              : language === 'uz'
              ? 'Ishtirok etish tasdiqlangan narxlar boʻyicha pullik. 2026 yil uchun aʼzolik badallarini toʻlagan ishtirokchilar uchun 10% chegirma.'
              : 'Participation is paid according to the approved price list. 10% discount for participants who have paid membership fees for 2026.'}
          </p>
          <p className="text-lg text-white/80 mb-4 max-w-2xl mx-auto">
            {language === 'ru' 
              ? 'Для получения скидки предоставьте подтверждение оплаты членского взноса за 2026 год.'
              : language === 'uz'
              ? 'Chegirma olish uchun 2026 yil uchun aʼzolik badali toʻlovini tasdiqlovchi hujjatni taqdim eting.'
              : 'To receive a discount, provide proof of payment of membership fee for 2026.'}
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {language === 'ru' 
              ? 'Оргкомитет не участвует в организации размещения. Рекомендуемые отели будут указаны на сайте.'
              : language === 'uz'
              ? 'Tashkiliy qoʻmita turar joy tashkil etishda ishtirok etmaydi. Tavsiya etilgan mehmonxonalar saytda koʻrsatiladi.'
              : 'Organizing committee does not participate in accommodation arrangements. Recommended hotels will be listed on the website.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/registration"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 bg-white text-primary-500 text-lg font-semibold rounded-sm hover:bg-neutral-100 transition-colors duration-200"
            >
              {t('hero.register')}
            </Link>
            <Link
              to="/abstracts"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-sm hover:bg-white/10 transition-colors duration-200"
            >
              {t('hero.submit')}
            </Link>
          </div>
        </div>
      </section>

      {/* Venue Preview */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="/images/samarkand.jpg"
                alt="Samarkand"
                className="w-full h-64 lg:h-80 object-cover rounded-md shadow-card"
              />
            </div>
            <div>
              <h2 className="text-subtitle lg:text-title font-bold text-neutral-900 mb-4">
                {t('venue.about')}
              </h2>
              <p className="text-body-lg text-neutral-700 mb-6 leading-relaxed">
                {t('venue.about.desc')}
              </p>
              <Link
                to="/venue"
                className="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                {language === 'ru' ? 'Подробнее о месте проведения' : language === 'uz' ? 'Joy haqida batafsil' : 'Learn more about the venue'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
