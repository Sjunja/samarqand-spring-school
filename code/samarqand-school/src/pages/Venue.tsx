import { useI18n } from '../lib/i18n';
import { MapPin, Building2, Calendar, Plane } from 'lucide-react';

export default function Venue() {
  const { language, t } = useI18n();

  const locations = [
    {
      title: language === 'ru' ? 'Торжественное открытие' : language === 'uz' ? 'Tantanali ochilish' : 'Opening Ceremony',
      address: language === 'ru' ? 'Большой зал СамГМУ, ул. Анкабай, 6' : language === 'uz' ? 'SamDTU Katta zali, Ankabay koʻchasi, 6' : 'Grand Hall SamSMU, Ankabay St. 6',
    },
    {
      title: language === 'ru' ? 'Секционные заседания' : language === 'uz' ? 'Seksiya yigʻilishlari' : 'Breakout Sessions',
      address: language === 'ru' ? 'ул. Амира Темура, 18' : language === 'uz' ? 'Amir Temur koʻchasi, 18' : 'Amir Temur St. 18',
    },
  ];

  const aboutCity = language === 'ru'
    ? 'Самарканд - один из древнейших городов мира, жемчужина Центральной Азии. Объект Всемирного наследия ЮНЕСКО, знаменитый площадью Регистан, мавзолеем Гур-Эмир и мечетью Биби-Ханым. Город с более чем 2700-летней историей, где переплетаются культуры Востока и Запада.'
    : language === 'uz'
    ? 'Samarqand - dunyodagi eng qadimiy shaharlardan biri, Markaziy Osiyoning durdonasi. YUNESKO Jahon merosi obyekti, Registon maydoni, Goʻri Amir maqbarasi va Bibi Xonim masjidi bilan mashhur. 2700 yildan ortiq tarixga ega, Sharq va Gʻarb madaniyatlari qoʻshilgan shahar.'
    : 'Samarkand is one of the oldest cities in the world, a pearl of Central Asia. A UNESCO World Heritage Site, famous for Registan Square, Gur-e-Amir mausoleum, and Bibi-Khanym Mosque. A city with over 2,700 years of history where Eastern and Western cultures intertwine.';

  const transport = language === 'ru'
    ? ['Международный аэропорт Самарканд (SKD)', 'Скоростной поезд Afrosiyob из Ташкента (2 часа)', 'Автобусное сообщение из всех городов Узбекистана']
    : language === 'uz'
    ? ['Samarqand xalqaro aeroporti (SKD)', 'Toshkentdan Afrosiyob tezkor poyezdi (2 soat)', 'Oʻzbekistonning barcha shaharlaridan avtobus aloqasi']
    : ['Samarkand International Airport (SKD)', 'High-speed Afrosiyob train from Tashkent (2 hours)', 'Bus connections from all cities of Uzbekistan'];

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">{t('venue.title')}</h1>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* University */}
          <div className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="/images/venue.jpg"
                  alt="Samarkand State Medical University"
                  className="w-full h-64 lg:h-80 object-cover rounded-md shadow-card"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-primary-500" />
                  <h2 className="text-2xl font-bold text-neutral-900">{t('venue.university')}</h2>
                </div>
                <p className="text-neutral-700 mb-4">
                  {language === 'ru' 
                    ? 'Самаркандский государственный медицинский университет - один из ведущих медицинских вузов Узбекистана, основанный в 1930 году.'
                    : language === 'uz'
                    ? 'Samarqand davlat tibbiyot universiteti - 1930 yilda tashkil etilgan Oʻzbekistonning yetakchi tibbiyot oliy oʻquv yurtlaridan biri.'
                    : 'Samarkand State Medical University is one of the leading medical universities in Uzbekistan, founded in 1930.'}
                </p>
                <div className="space-y-3">
                  {locations.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-md">
                      <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-neutral-900">{loc.title}</div>
                        <div className="text-sm text-neutral-600">{loc.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About Samarkand */}
          <div className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">{t('venue.about')}</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">{aboutCity}</p>
                <div className="flex items-center gap-3 p-3 bg-secondary-50 rounded-md">
                  <Calendar className="w-5 h-5 text-secondary-600" />
                  <span className="text-neutral-700">
                    {language === 'ru' 
                      ? 'Апрель - идеальное время для посещения: комфортная температура 18-25°C'
                      : language === 'uz'
                      ? 'Aprel - tashrif buyurish uchun ideal vaqt: qulay harorat 18-25°C'
                      : 'April is the ideal time to visit: comfortable temperature 18-25°C'}
                  </span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src="/images/samarkand.jpg"
                  alt="Registan Square Samarkand"
                  className="w-full h-64 lg:h-80 object-cover rounded-md shadow-card"
                />
              </div>
            </div>
          </div>

          {/* Recommended Hotels */}
          <div className="mb-12 p-6 bg-white border border-neutral-200 rounded-md">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-neutral-900">
                {language === 'ru' ? 'Рекомендованные отели' : language === 'uz' ? 'Tavsiya etilgan mehmonxonalar' : 'Recommended Hotels'}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-md">
                <h3 className="font-medium text-neutral-900 mb-1">
                  {language === 'ru' ? 'Отель "Регистан Плаза"' : language === 'uz' ? '"Registon Plaza" mehmonxonasi' : '"Registan Plaza" Hotel'}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {language === 'ru' 
                    ? 'Расстояние до университета: 1,5 км. Цена: от $80 за ночь.'
                    : language === 'uz'
                    ? 'Universitetgacha masofa: 1,5 km. Narxi: kechasiga $80 dan.'
                    : 'Distance to university: 1.5 km. Price: from $80 per night.'}
                </p>
                <p className="text-xs text-neutral-500">
                  {language === 'ru' 
                    ? 'Ул. Регистан, 15. Тел: +998 66 233-45-67'
                    : language === 'uz'
                    ? 'Registon koʻchasi, 15. Tel: +998 66 233-45-67'
                    : 'Registan St., 15. Tel: +998 66 233-45-67'}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-md">
                <h3 className="font-medium text-neutral-900 mb-1">
                  {language === 'ru' ? 'Гостиница "Самарканд"' : language === 'uz' ? '"Samarqand" mehmonxonasi' : '"Samarkand" Hotel'}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {language === 'ru' 
                    ? 'Расстояние до университета: 2 км. Цена: от $60 за ночь.'
                    : language === 'uz'
                    ? 'Universitetgacha masofa: 2 km. Narxi: kechasiga $60 dan.'
                    : 'Distance to university: 2 km. Price: from $60 per night.'}
                </p>
                <p className="text-xs text-neutral-500">
                  {language === 'ru' 
                    ? 'Ул. Амира Темура, 25. Тел: +998 66 234-56-78'
                    : language === 'uz'
                    ? 'Amir Temur koʻchasi, 25. Tel: +998 66 234-56-78'
                    : 'Amir Temur St., 25. Tel: +998 66 234-56-78'}
                </p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-md">
                <h3 className="font-medium text-neutral-900 mb-1">
                  {language === 'ru' ? 'Бутик-отель "Сиаб"' : language === 'uz' ? '"Siyob" butik-mehmonxonasi' : '"Siab" Boutique Hotel'}
                </h3>
                <p className="text-sm text-neutral-600 mb-2">
                  {language === 'ru' 
                    ? 'Расстояние до университета: 1 км. Цена: от $100 за ночь.'
                    : language === 'uz'
                    ? 'Universitetgacha masofa: 1 km. Narxi: kechasiga $100 dan.'
                    : 'Distance to university: 1 km. Price: from $100 per night.'}
                </p>
                <p className="text-xs text-neutral-500">
                  {language === 'ru' 
                    ? 'Ул. Сиабская, 8. Тел: +998 66 235-67-89'
                    : language === 'uz'
                    ? 'Siyob koʻchasi, 8. Tel: +998 66 235-67-89'
                    : 'Siab St., 8. Tel: +998 66 235-67-89'}
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-4">
              {language === 'ru' 
                ? '* Оргкомитет не участвует в организации размещения. Рекомендуем забронировать проживание заранее.'
                : language === 'uz'
                ? '* Tashkiliy qoʻmita turar joy tashkil etishda ishtirok etmaydi. Turar joyni oldindan bron qilishni tavsiya etamiz.'
                : '* Organizing committee does not participate in accommodation arrangements. We recommend booking accommodation in advance.'}
            </p>
          </div>

          {/* Transport */}
          <div className="p-6 bg-white border border-neutral-200 rounded-md">
            <div className="flex items-center gap-3 mb-4">
              <Plane className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-neutral-900">
                {language === 'ru' ? 'Как добраться' : language === 'uz' ? 'Qanday yetib borish mumkin' : 'How to Get There'}
              </h2>
            </div>
            <ul className="space-y-3">
              {transport.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-neutral-700">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
