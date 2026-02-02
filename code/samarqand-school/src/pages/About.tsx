import { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { Building2, Users, Target, Award, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function About() {
  const { language, t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const photos2022 = [
    '/images/2022/photo_2026-01-25_02-55-37.jpg',
    '/images/2022/photo_2026-01-25_02-55-46.jpg',
    '/images/2022/photo_2026-01-25_02-55-51.jpg',
    '/images/2022/photo_2026-01-25_02-56-02.jpg',
  ];

  const photos2024 = [
    '/images/2024/photo_2026-01-25_02-56-38.jpg',
  ];

  const openModal = (imageSrc: string, index: number) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const currentPhotos = selectedImage?.includes('2022') ? photos2022 : photos2024;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentPhotos.length);
    setSelectedImage(currentPhotos[(currentImageIndex + 1) % currentPhotos.length]);
  };

  const prevImage = () => {
    const currentPhotos = selectedImage?.includes('2022') ? photos2022 : photos2024;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + currentPhotos.length) % currentPhotos.length);
    setSelectedImage(currentPhotos[(currentImageIndex - 1 + currentPhotos.length) % currentPhotos.length]);
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const organizers = [
    { name: t('org.0'), icon: Building2 },
    { name: t('org.1'), icon: Building2 },
    { name: t('org.2'), icon: Building2 },
    { name: t('org.3'), icon: Building2 },
    { name: t('org.4'), icon: Building2 },
    { name: t('org.5'), icon: Building2 },
  ];

  const benefits = language === 'ru' 
    ? ['Лекции ведущих экспертов', 'Интерактивные семинары', 'Публикация в "Междисциплинарном журнале психиатрии и аддиктологии"', 'Нетворкинг', 'Конкурс научных работ']
    : language === 'uz'
    ? ['Yetakchi ekspertlar maʼruzalari', 'Interaktiv seminarlar', '"Psixiatriya va addiktologiya boʻyicha fanlararo jurnal"da nashr', 'Networking', 'Ilmiy ishlar tanlovi']
    : ['Lectures by leading experts', 'Interactive seminars', 'Publication in "Interdisciplinary Journal of Psychiatry and Addictology"', 'Networking', 'Research competition'];

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">{t('about.title')}</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-body-lg text-neutral-700 leading-relaxed">{t('about.description')}</p>
          </div>

          {/* History */}
          <div className="bg-primary-50 border border-primary-200 rounded-md p-6 lg:p-8 mb-12">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              {language === 'ru' ? 'История проекта' : language === 'uz' ? 'Loyiha tarixi' : 'Project History'}
            </h2>
            <div className="space-y-4">
              <p className="text-neutral-700">
                {language === 'ru' 
                  ? 'Проект "Самаркандская весенняя школа" был запущен в 2022 году как научно-образовательная инициатива Ассоциации психиатров Узбекистана. Проект стал ежегодным мероприятием, объединяющим молодых специалистов из стран Центральной Азии. В 2025 году школа не проводилась.'
                  : language === 'uz'
                  ? '"Samarqand bahoriy maktabi" loyihasi 2022 yilda Oʻzbekiston Psixiatrlar Assotsiatsiyasining ilmiy-taʼlimiy tashabbusi sifatida ishga tushirildi. Loyiha Markaziy Osiyo mamlakatlaridan kelgan yosh mutaxassislarni birlashtiruvchi yillik tadbirga aylandi. 2025 yilda maktab oʻtkazilmadi.'
                  : 'The "Samarqand Spring School" project was launched in 2022 as a scientific and educational initiative of the Psychiatric Association of Uzbekistan. The project has become an annual event uniting young professionals from Central Asian countries. The school was not held in 2025.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-md border border-neutral-200">
                  <div className="text-2xl font-bold text-primary-500 mb-1">2022</div>
                  <div className="text-sm text-neutral-700">
                    {language === 'ru' 
                      ? 'Первая школа: 45 участников, 10 спикеров'
                      : language === 'uz'
                      ? 'Birinchi maktab: 45 ishtirokchi, 10 maʼruzachi'
                      : 'First school: 45 participants, 10 speakers'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md border border-neutral-200">
                  <div className="text-2xl font-bold text-primary-500 mb-1">2024</div>
                  <div className="text-sm text-neutral-700">
                    {language === 'ru' 
                      ? 'Вторая школа: 60 участников, 12 спикеров'
                      : language === 'uz'
                      ? 'Ikkinchi maktab: 60 ishtirokchi, 12 maʼruzachi'
                      : 'Second school: 60 participants, 12 speakers'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md border border-neutral-200">
                  <div className="text-2xl font-bold text-primary-500 mb-1">2026</div>
                  <div className="text-sm text-neutral-700">
                    {language === 'ru' 
                      ? 'Третья школа: планируется 100+ участников, 15+ спикеров'
                      : language === 'uz'
                      ? 'Uchinchi maktab: rejalashtirilgan 100+ ishtirokchi, 15+ maʼruzachi'
                      : 'Third school: planned 100+ participants, 15+ speakers'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div className="bg-secondary-50 border border-secondary-200 rounded-md p-6 lg:p-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-secondary-600" />
              <h2 className="text-xl font-semibold text-neutral-900">{t('about.audience')}</h2>
            </div>
            <p className="text-neutral-700">{t('about.audience.desc')}</p>
          </div>

          {/* Photo Reports */}
          <div className="mb-16">
            <h2 className="text-subtitle font-bold text-neutral-900 text-center mb-8">
              {language === 'ru' ? 'Фотоотчеты прошлых лет' : language === 'uz' ? 'Oʻtgan yillarning fotohisobotlari' : 'Photo Reports from Previous Years'}
            </h2>
            
            {/* 2022 Gallery - Первая школа */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">2022 - {language === 'ru' ? 'Первая школа' : language === 'uz' ? 'Birinchi maktab' : 'First school'}</h3>
              <p className="text-neutral-700 mb-4">
                {language === 'ru' 
                  ? '45 участников, 10 спикеров, 5 дней обучения. Первая Самаркандская весенняя школа положила начало традиции ежегодных встреч молодых специалистов.'
                  : language === 'uz'
                  ? '45 ishtirokchi, 10 maʼruzachi, 5 kunlik taʼlim. Birinchi Samarqand bahoriy maktabi yosh mutaxassislarning yillik uchrashuvlari anʼanasini boshlab berdi.'
                  : '45 participants, 10 speakers, 5 days of training. The first Samarqand Spring School started the tradition of annual meetings for young professionals.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos2022.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => openModal(photo, index)}
                    className="relative overflow-hidden rounded-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <img 
                      src={photo}
                      alt={language === 'ru' ? `Самаркандская школа 2022 - фото ${index + 1}` : language === 'uz' ? `Samarqand maktabi 2022 - foto ${index + 1}` : `Samarqand School 2022 - photo ${index + 1}`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-black/50 px-3 py-1 rounded-md text-sm">
                        {language === 'ru' ? 'Нажмите для увеличения' : language === 'uz' ? 'Kattalashtirish uchun bosing' : 'Click to enlarge'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2024 Gallery - Вторая школа */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">2024 - {language === 'ru' ? 'Вторая школа' : language === 'uz' ? 'Ikkinchi maktab' : 'Second school'}</h3>
              <p className="text-neutral-700 mb-4">
                {language === 'ru' 
                  ? '60 участников, 12 спикеров, международные гости. Вторая школа расширила географию участников и привлекла экспертов из соседних стран.'
                  : language === 'uz'
                  ? '60 ishtirokchi, 12 maʼruzachi, xalqaro mehmonlar. Ikkinchi maktab ishtirokchilar geografiyasini kengaytirdi va qoʻshni mamlakatlardan ekspertlarni jalb qildi.'
                  : '60 participants, 12 speakers, international guests. The second school expanded the geography of participants and attracted experts from neighboring countries.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => openModal(photos2024[0], 0)}
                  className="relative overflow-hidden rounded-md group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <img 
                    src={photos2024[0]}
                    alt={language === 'ru' ? 'Самаркандская школа 2024' : language === 'uz' ? 'Samarqand maktabi 2024' : 'Samarqand School 2024'}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white bg-black/50 px-3 py-1 rounded-md text-sm">
                      {language === 'ru' ? 'Нажмите для увеличения' : language === 'uz' ? 'Kattalashtirish uchun bosing' : 'Click to enlarge'}
                    </div>
                  </div>
                </button>
                <div className="bg-secondary-50 border border-secondary-200 rounded-md p-6">
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    {language === 'ru' ? 'Достижения 2024 года' : language === 'uz' ? '2024 yil yutuqlari' : '2024 Achievements'}
                  </h4>
                  <ul className="space-y-2 text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-500">•</span>
                      {language === 'ru' 
                        ? '60 участников из стран Центральной Азии'
                        : language === 'uz'
                        ? 'Markaziy Osiyo mamlakatlaridan 60 ishtirokchi'
                        : '60 participants from Central Asian countries'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-500">•</span>
                      {language === 'ru' 
                        ? '12 спикеров - ведущих экспертов в области психиатрии'
                        : language === 'uz'
                        ? '12 maʼruzachi - psixiatriya sohasidagi yetakchi ekspertlar'
                        : '12 speakers - leading experts in psychiatry'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary-500">•</span>
                      {language === 'ru' 
                        ? 'Международные гости из соседних стран'
                        : language === 'uz'
                        ? 'Qoʻshni mamlakatlardan xalqaro mehmonlar'
                        : 'International guests from neighboring countries'}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-center text-neutral-600 mt-8">
              {language === 'ru' 
                ? 'Нажмите на фотографии для увеличения. Полные фотоотчеты доступны по запросу у организаторов.'
                : language === 'uz'
                ? 'Fotosuratlarni kattalashtirish uchun bosing. Toʻliq fotohisobotlar tashkilotchilardan soʻrash orqali mavjud.'
                : 'Click on photos to enlarge. Full photo reports available upon request from organizers.'}
            </p>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-subtitle font-bold text-neutral-900 text-center mb-8">
              {language === 'ru' ? 'Преимущества участия' : language === 'uz' ? 'Ishtirok etish afzalliklari' : 'Benefits of Participation'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-md">
                  <Award className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-neutral-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Organizers */}
          <div>
            <h2 className="text-subtitle font-bold text-neutral-900 text-center mb-8">{t('organizers.title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizers.map((org, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-md">
                  <org.icon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 text-sm">{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Image View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label={language === 'ru' ? 'Закрыть' : language === 'uz' ? 'Yopish' : 'Close'}
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label={language === 'ru' ? 'Предыдущее фото' : language === 'uz' ? 'Oldingi foto' : 'Previous photo'}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            aria-label={language === 'ru' ? 'Следующее фото' : language === 'uz' ? 'Keyingi foto' : 'Next photo'}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt={language === 'ru' ? 'Увеличенное фото' : language === 'uz' ? 'Kattalashtirilgan foto' : 'Enlarged photo'}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-md text-sm">
              {language === 'ru' 
                ? `Фото ${currentImageIndex + 1} из ${selectedImage.includes('2022') ? photos2022.length : photos2024.length}`
                : language === 'uz'
                ? `Foto ${currentImageIndex + 1} / ${selectedImage.includes('2022') ? photos2022.length : photos2024.length}`
                : `Photo ${currentImageIndex + 1} of ${selectedImage.includes('2022') ? photos2022.length : photos2024.length}`}
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {language === 'ru' 
              ? 'Нажмите ESC или кликните вне фото для закрытия'
              : language === 'uz'
              ? 'Yopish uchun ESC tugmasini bosing yoki fotodan tashqariga bosing'
              : 'Press ESC or click outside to close'}
          </div>
        </div>
      )}
    </main>
  );
}
