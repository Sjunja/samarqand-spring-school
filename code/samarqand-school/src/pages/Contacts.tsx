import { useI18n } from '../lib/i18n';
import { Mail, Send, User, Phone, MapPin } from 'lucide-react';

export default function Contacts() {
  const { language, t } = useI18n();

  const committee = [
    { name: 'Усербаева Роза Куралбаевна', nameEn: 'Rose Userbayeva', telegram: '@RoseUserbayeva' },
    { name: 'Хайрединова Инара Ильгизовна', nameEn: 'Inara Khayredinova', telegram: '@inarakhayredinova' },
    { name: 'Восиков Ботирбек Абдулазиз угли', nameEn: 'Botirbek Vosikov', telegram: '@vosikov' },
  ];

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">{t('contacts.title')}</h1>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-white border border-neutral-200 rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-primary-500" />
                  <h2 className="text-xl font-semibold text-neutral-900">{t('contacts.email')}</h2>
                </div>
                <a href="mailto:uzpa.org@gmail.com" className="text-xl text-primary-500 hover:underline">
                  uzpa.org@gmail.com
                </a>
              </div>

              {/* Location */}
              <div className="bg-white border border-neutral-200 rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-primary-500" />
                  <h2 className="text-xl font-semibold text-neutral-900">{t('venue.title')}</h2>
                </div>
                <p className="text-neutral-700">{t('venue.university')}</p>
                <p className="text-neutral-600">Samarkand, Uzbekistan</p>
              </div>

              {/* Organizing Committee */}
              <div className="bg-white border border-neutral-200 rounded-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-primary-500" />
                  <h2 className="text-xl font-semibold text-neutral-900">{t('contacts.committee')}</h2>
                </div>
                <div className="space-y-4">
                  {committee.map((person, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-md">
                      <Send className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-900">
                          {language === 'en' ? person.nameEn : person.name}
                        </div>
                        <a 
                          href={`https://t.me/${person.telegram.slice(1)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-500 hover:underline"
                        >
                          {person.telegram}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-neutral-200 rounded-md p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                {language === 'ru' ? 'Написать нам' : language === 'uz' ? 'Bizga yozing' : 'Send us a message'}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {language === 'ru' ? 'Тема' : language === 'uz' ? 'Mavzu' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    {language === 'ru' ? 'Сообщение' : language === 'uz' ? 'Xabar' : 'Message'}
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>
                <a
                  href="mailto:uzpa.org@gmail.com?subject=Вопрос о Самаркандской школе 2026"
                  className="block w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-sm transition-colors flex items-center justify-center"
                >
                  {language === 'ru' ? 'Написать на почту' : language === 'uz' ? 'Pochta orqali yozish' : 'Write by email'}
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
