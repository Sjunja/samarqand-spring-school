import { useI18n } from '../lib/i18n';
import { Calendar, MapPin, Clock, Users, Mic2, MessageSquare } from 'lucide-react';

export default function Program() {
  const { language, t } = useI18n();

  const sessionFormats = language === 'ru'
    ? [
        { icon: Mic2, title: 'Пленарные лекции', desc: 'Лекции ведущих экспертов' },
        { icon: Users, title: 'Тематические симпозиумы', desc: 'Специализированные секции' },
        { icon: MessageSquare, title: 'Интерактивные семинары', desc: 'Практические занятия' },
      ]
    : language === 'uz'
    ? [
        { icon: Mic2, title: 'Plenar maʼruzalar', desc: 'Yetakchi ekspertlar maʼruzalari' },
        { icon: Users, title: 'Mavzuli simpoziumlar', desc: 'Ixtisoslashgan seksiyalar' },
        { icon: MessageSquare, title: 'Interaktiv seminarlar', desc: 'Amaliy mashgʻulotlar' },
      ]
    : [
        { icon: Mic2, title: 'Plenary Lectures', desc: 'Lectures by leading experts' },
        { icon: Users, title: 'Thematic Symposia', desc: 'Specialized sessions' },
        { icon: MessageSquare, title: 'Interactive Seminars', desc: 'Hands-on workshops' },
      ];

  const schedule = [
    { day: language === 'ru' ? '8 апреля' : language === 'uz' ? '8 aprel' : 'April 8', title: language === 'ru' ? 'Торжественное открытие' : language === 'uz' ? 'Tantanali ochilish' : 'Opening Ceremony', desc: language === 'ru' ? 'Регистрация, церемония открытия, пленарная лекция' : language === 'uz' ? 'Roʻyxatdan oʻtish, ochilish marosimi, plenar maʼruza' : 'Registration, opening ceremony, plenary lecture' },
    { day: language === 'ru' ? '9-11 апреля' : language === 'uz' ? '9-11 aprel' : 'April 9-11', title: language === 'ru' ? 'Научная программа' : language === 'uz' ? 'Ilmiy dastur' : 'Scientific Program', desc: language === 'ru' ? 'Лекции, семинары, секционные заседания' : language === 'uz' ? 'Maʼruzalar, seminarlar, seksiya yigʻilishlari' : 'Lectures, seminars, breakout sessions' },
    { day: language === 'ru' ? '12 апреля' : language === 'uz' ? '12 aprel' : 'April 12', title: language === 'ru' ? 'Закрытие' : language === 'uz' ? 'Yopilish' : 'Closing', desc: language === 'ru' ? 'Заключительные лекции, церемония закрытия' : language === 'uz' ? 'Yakuniy maʼruzalar, yopilish marosimi' : 'Final lectures, closing ceremony' },
  ];

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">
            {language === 'ru' ? 'Программа школы' : language === 'uz' ? 'Maktab dasturi' : 'School Program'}
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-md">
              <Calendar className="w-8 h-8 text-primary-500" />
              <div>
                <div className="text-sm text-neutral-500">{t('dates.event')}</div>
                <div className="font-semibold text-neutral-900">{t('hero.dates')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-md">
              <MapPin className="w-8 h-8 text-primary-500" />
              <div>
                <div className="text-sm text-neutral-500">{t('venue.title')}</div>
                <div className="font-semibold text-neutral-900">Samarkand, Uzbekistan</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-md">
              <Clock className="w-8 h-8 text-primary-500" />
              <div>
                <div className="text-sm text-neutral-500">{language === 'ru' ? 'Продолжительность' : language === 'uz' ? 'Davomiyligi' : 'Duration'}</div>
                <div className="font-semibold text-neutral-900">{language === 'ru' ? '5 дней' : language === 'uz' ? '5 kun' : '5 days'}</div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="mb-16">
            <h2 className="text-subtitle font-bold text-neutral-900 mb-8">
              {language === 'ru' ? 'Расписание' : language === 'uz' ? 'Jadval' : 'Schedule Overview'}
            </h2>
            <div className="space-y-4">
              {schedule.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 bg-white border border-neutral-200 rounded-md">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-lg font-bold text-primary-500">{item.day}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                    <p className="text-neutral-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-md">
              <p className="text-sm text-primary-700">
                {language === 'ru' 
                  ? 'Детальное расписание будет опубликовано ближе к дате мероприятия.' 
                  : language === 'uz' 
                  ? 'Batafsil jadval tadbirga yaqinroq eʼlon qilinadi.'
                  : 'Detailed schedule will be published closer to the event date.'}
              </p>
            </div>
          </div>

          {/* Session Formats */}
          <div>
            <h2 className="text-subtitle font-bold text-neutral-900 mb-8">
              {language === 'ru' ? 'Форматы сессий' : language === 'uz' ? 'Seksiya formatlari' : 'Session Formats'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {sessionFormats.map((format, idx) => (
                <div key={idx} className="p-6 bg-neutral-50 border border-neutral-200 rounded-md text-center">
                  <format.icon className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-neutral-900 mb-2">{format.title}</h3>
                  <p className="text-sm text-neutral-600">{format.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Info */}
          <div className="mt-12 p-6 bg-white border border-neutral-200 rounded-md">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {language === 'ru' ? 'Место проведения сессий' : language === 'uz' ? 'Seksiyalar oʻtkazish joyi' : 'Session Venues'}
            </h3>
            <div className="space-y-2 text-neutral-700">
              <p><strong>{language === 'ru' ? 'Открытие:' : language === 'uz' ? 'Ochilish:' : 'Opening:'}</strong> {t('venue.opening')}</p>
              <p><strong>{language === 'ru' ? 'Секции:' : language === 'uz' ? 'Seksiyalar:' : 'Sessions:'}</strong> {t('venue.sessions')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
