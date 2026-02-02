import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'uz';

interface TranslationStrings {
  [key: string]: string;
}

const translations: Record<Language, TranslationStrings> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.program': 'Program',
    'nav.speakers': 'Speakers',
    'nav.registration': 'Registration',
    'nav.cabinet': 'Account',
    'nav.abstracts': 'Publications',
    'nav.journal': 'Journal',
    'nav.venue': 'Venue',
    'nav.accommodation': 'Accommodation',
    'nav.news': 'News',
    'nav.contacts': 'Contacts',
    
    // Hero
    'hero.title': 'III Samarqand Spring School',
    'hero.subtitle': 'for Young Psychiatrists and Narcologists',
    'hero.dates': 'April 8-12, 2026',
    'hero.location': 'Samarkand, Uzbekistan',
    'hero.register': 'Register Now',
    'hero.submit': 'Submit Publication',
    
    // Key Numbers
    'stats.participants': 'Participants',
    'stats.days': 'Days',
    'stats.speakers': 'Speakers',
    'stats.languages': 'Languages',
    
    // Dates
    'dates.title': 'Important Dates',
    'dates.abstract': 'Publication Submission Deadline',
    'dates.registration': 'Registration Deadline',
    'dates.event': 'Event Dates',
    
    // About
    'about.title': 'About the School',
    'about.description': 'The third Samarqand Spring School for young psychiatrists and narcologists is organized as part of the scientific and educational project of the Psychiatric Association of Uzbekistan.',
    'about.audience': 'Target Audience',
    'about.audience.desc': 'Young specialists under 40 years old—psychiatrists, narcologists, psychotherapists, medical psychologists, neurologists, and doctors of related specialties—as well as master\'s residents and clinical residents in psychiatry, narcology, and medical psychology are invited to the in-person format. Specialists of the same fields without age restrictions are invited to the online format. Knowledge of English is welcome.',
    
    // Organizers
    'organizers.title': 'Organizers',
    'org.0': 'Ministry of Health of the Republic of Uzbekistan',
    'org.1': 'Republican Specialized Scientific-Practical Medical Center for Mental Health',
    'org.2': 'Samarkand State Medical University',
    'org.3': 'Tashkent State Medical University',
    'org.4': 'World Psychiatric Association',
    'org.5': 'Psychiatric Association of Uzbekistan',
    
    // Registration
    'reg.title': 'Participant Registration',
    'reg.notice': 'Limited to 50 in-person and 50 online participants.',
    'reg.deadline': 'Registration Deadline: March 1, 2026',
    'reg.free': 'Participation is paid according to the approved price list. 10% discount for participants who have paid membership fees for 2026.',
    'reg.requirements': 'Eligibility',
    'reg.req.1': 'In-person format: young specialists under 40—psychiatrists, narcologists, psychotherapists, medical psychologists, neurologists, and doctors of related specialties—as well as master\'s residents and clinical residents in psychiatry, narcology, and medical psychology.',
    'reg.req.2': 'Online format: specialists of the same fields without age restrictions, as well as master\'s residents and clinical residents in psychiatry, narcology, and medical psychology.',
    'reg.req.3': 'For members of the Psychiatric Association of Uzbekistan who have paid the 2026 membership fee: 10% discount upon presenting the receipt.',
    'reg.req.4': 'Knowledge of English is welcome',
    'reg.slots': 'Available Slots',
    'reg.closed': 'Registration is closed',
    'reg.receipts': 'Send payment confirmation to: uzpa.org@gmail.com',
    'reg.journal': 'Materials will be published in the "Interdisciplinary Journal of Psychiatry and Addictology"',
    
    // Form
    'form.name': 'Full Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.birthdate': 'Date of Birth',
    'form.city': 'City',
    'form.country': 'Country',
    'form.position': 'Position/Title',
    'form.organization': 'Organization',
    'form.specialty': 'Specialty',
    'form.specialty.psychiatrist': 'Psychiatrist',
    'form.specialty.psychotherapist': 'Psychotherapist',
    'form.specialty.narcologist': 'Narcologist',
    'form.specialty.other': 'Other',
    'form.specialty.other.placeholder': 'Please specify',
    'form.experience': 'Years of Experience',
    'form.telegram': 'Telegram Username',
    'form.membership': 'Membership Years (2020-2026)',
    'form.participation.type': 'Type of Participation',
    'form.participation.inperson': 'In-person',
    'form.participation.online': 'Online',
    'form.participant.category': 'Participant Category',
    'form.category.standard': 'Standard',
    'form.category.apu': 'APU Member (2026 membership paid)',
    'form.category.international': 'International Participant',
    'form.membership.proof': 'APU Membership Proof (2026)',
    'form.membership.upload': 'Upload proof of payment',
    'form.consent.data': 'I agree to the processing of personal data',
    'form.consent.rules': 'I agree to the terms and conditions',
    'form.consent.media': 'I agree to photo/video recording and publication',
    'form.submit': 'Submit Registration',
    'form.success': 'Registration submitted successfully!',
    'form.error': 'Error submitting registration',
    'form.validation.age': 'Participants must be under 40 years old',
    'form.validation.experience': 'Minimum 1 year of experience required',
    'form.validation.telegram': 'Telegram username should start with @',
    
    // Abstract
    'abstract.title': 'Publication Submission',
    'abstract.deadline': 'Deadline: March 1, 2026',
    'abstract.format': 'Formatting Requirements',
    'abstract.structure': 'Publication Structure',
    'abstract.email': 'Submit to: uzpa.org@gmail.com',
    'abstract.subject': 'Subject: "Author Name - Samarqand School - 2026"',
    
    // Venue
    'venue.title': 'Venue',
    'venue.university': 'Samarkand State Medical University',
    'venue.opening': 'Opening Ceremony: Grand Hall, Ankabay St. 6',
    'venue.sessions': 'Sessions: Amir Temur St. 18',
    'venue.about': 'About Samarkand',
    'venue.about.desc': 'Samarkand is one of the oldest cities in Central Asia, a UNESCO World Heritage site famous for the Registan Square and its rich Islamic architecture.',
    
    // News
    'news.title': 'News & Announcements',
    'news.empty': 'No news yet. Check back soon!',
    
    // Contacts
    'contacts.title': 'Contact Us',
    'contacts.email': 'Email',
    'contacts.telegram': 'Telegram',
    'contacts.committee': 'Organizing Committee',
    'contacts.telegram.rosa': '@RoseUserbayeva',
    'contacts.telegram.inara': '@inarakhayredinova',
    'contacts.telegram.botir': '@vosikov',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.ministry': 'Ministry of Health of the Republic of Uzbekistan',
    'footer.organizers': 'Organizers',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.about': 'О школе',
    'nav.program': 'Программа',
    'nav.speakers': 'Спикеры',
    'nav.registration': 'Регистрация',
    'nav.cabinet': 'Личный кабинет',
    'nav.abstracts': 'Публикации',
    'nav.journal': 'Журнал',
    'nav.venue': 'Место',
    'nav.accommodation': 'Проживание',
    'nav.news': 'Новости',
    'nav.contacts': 'Контакты',
    
    // Hero
    'hero.title': 'III Самаркандская весенняя школа',
    'hero.subtitle': 'молодых психиатров и наркологов',
    'hero.dates': '8-12 апреля 2026',
    'hero.location': 'Самарканд, Узбекистан',
    'hero.register': 'Регистрация',
    'hero.submit': 'Подать публикацию',
    
    // Key Numbers
    'stats.participants': 'Участников',
    'stats.days': 'Дней',
    'stats.speakers': 'Спикеров',
    'stats.languages': 'Языка',
    
    // Dates
    'dates.title': 'Важные даты',
    'dates.abstract': 'Дедлайн подачи публикации',
    'dates.registration': 'Дедлайн регистрации',
    'dates.event': 'Даты мероприятия',
    
    // About
    'about.title': 'О школе',
    'about.description': 'Третья Самаркандская весенняя школа молодых психиатров и наркологов проводится в рамках научно-образовательного проекта Ассоциации психиатров Узбекистана.',
    'about.audience': 'Целевая аудитория',
    'about.audience.desc': 'Для участия в офлайн формате приглашаются молодые специалисты — психиатры, наркологи, психотерапевты, медицинские психологи, неврологи и врачи других смежных специальностей — до 40 лет, а также резиденты магистратуры и клинические ординаторы по психиатрии, наркологии, медицинской психологии. Для онлайн формата приглашаются специалисты тех же направлений без возрастных ограничений. Знание английского языка приветствуется.',
    
    // Organizers
    'organizers.title': 'Организаторы',
    'org.0': 'Министерство здравоохранения Республики Узбекистан',
    'org.1': 'Республиканский специализированный научно-практический медицинский центр психического здоровья',
    'org.2': 'Самаркандский государственный медицинский университет',
    'org.3': 'Ташкентский государственный медицинский университет',
    'org.4': 'Всемирная психиатрическая ассоциация',
    'org.5': 'Ассоциация психиатров Узбекистана',
    
    // Registration
    'reg.title': 'Регистрация участников',
    'reg.notice': 'Количество мест ограничено - 50 очно и 50 онлайн участников.',
    'reg.deadline': 'Дедлайн регистрации: 1 марта 2026',
    'reg.free': 'Участие платное согласно утвержденному прайсу. Скидка 10% для участников, оплативших членские взносы за 2026 год.',
    'reg.requirements': 'Условия участия',
    'reg.req.1': 'Офлайн формат: молодые специалисты — психиатры, наркологи, психотерапевты, медицинские психологи, неврологи и врачи других смежных специальностей — до 40 лет, а также резиденты магистратуры и клинические ординаторы по психиатрии, наркологии, медицинской психологии.',
    'reg.req.2': 'Онлайн формат: специалисты тех же направлений без возрастных ограничений, а также резиденты магистратуры и клинические ординаторы по психиатрии, наркологии, медицинской психологии.',
    'reg.req.3': 'Для членов Ассоциации психиатров Узбекистана, оплативших членский взнос за 2026 год: скидка 10% при предоставлении чека.',
    'reg.req.4': 'Знание английского приветствуется',
    'reg.slots': 'Свободных мест',
    'reg.closed': 'Регистрация закрыта',
    'reg.receipts': 'Отправить подтверждение оплаты на: uzpa.org@gmail.com',
    'reg.journal': 'Материалы будут опубликованы в "Междисциплинарном журнале психиатрии и аддиктологии"',
    
    // Form
    'form.name': 'ФИО',
    'form.email': 'Email',
    'form.phone': 'Телефон',
    'form.birthdate': 'Дата рождения',
    'form.city': 'Город',
    'form.country': 'Страна',
    'form.position': 'Должность',
    'form.organization': 'Организация',
    'form.specialty': 'Специальность',
    'form.specialty.psychiatrist': 'Психиатр',
    'form.specialty.psychotherapist': 'Психотерапевт',
    'form.specialty.narcologist': 'Нарколог',
    'form.specialty.other': 'Другое',
    'form.specialty.other.placeholder': 'Укажите специальность',
    'form.experience': 'Стаж работы (лет)',
    'form.telegram': 'Telegram',
    'form.membership': 'Годы членства (2020-2026)',
    'form.participation.type': 'Тип участия',
    'form.participation.inperson': 'Очное',
    'form.participation.online': 'Онлайн',
    'form.participant.category': 'Категория участника',
    'form.category.standard': 'Стандартная',
    'form.category.apu': 'Член АПУ (членский взнос за 2026 оплачен)',
    'form.category.international': 'Иностранный участник',
    'form.membership.proof': 'Подтверждение членства АПУ за 2026',
    'form.membership.upload': 'Загрузить подтверждение оплаты',
    'form.consent.data': 'Согласен на обработку персональных данных',
    'form.consent.rules': 'Согласен с правилами участия',
    'form.consent.media': 'Согласен на фото/видеосъемку и публикацию',
    'form.submit': 'Отправить заявку',
    'form.success': 'Заявка успешно отправлена!',
    'form.error': 'Ошибка при отправке заявки',
    'form.validation.age': 'Участникам должно быть до 40 лет',
    'form.validation.experience': 'Требуется минимум 1 год опыта работы',
    'form.validation.telegram': 'Telegram username должен начинаться с @',
    
    // Abstract
    'abstract.title': 'Подача публикаций',
    'abstract.deadline': 'Дедлайн: 1 марта 2026',
    'abstract.format': 'Требования к оформлению',
    'abstract.structure': 'Структура публикации',
    'abstract.email': 'Отправить на: uzpa.org@gmail.com',
    'abstract.subject': 'Тема письма: "ФИО автора - Самаркандская школа - 2026"',
    
    // Venue
    'venue.title': 'Место проведения',
    'venue.university': 'Самаркандский государственный медицинский университет',
    'venue.opening': 'Торжественное открытие: Большой зал, ул. Анкабай, 6',
    'venue.sessions': 'Секционные заседания: ул. Амира Темура, 18',
    'venue.about': 'О Самарканде',
    'venue.about.desc': 'Самарканд - один из древнейших городов Центральной Азии, объект Всемирного наследия ЮНЕСКО, известный площадью Регистан и богатой исламской архитектурой.',
    
    // News
    'news.title': 'Новости и объявления',
    'news.empty': 'Новостей пока нет. Следите за обновлениями!',
    
    // Contacts
    'contacts.title': 'Контакты',
    'contacts.email': 'Email',
    'contacts.telegram': 'Telegram',
    'contacts.committee': 'Организационный комитет',
    'contacts.telegram.rosa': '@RoseUserbayeva (Усербаева Роза Куралбаевна)',
    'contacts.telegram.inara': '@inarakhayredinova (Хайрединова Инара Ильгизовна)',
    'contacts.telegram.botir': '@vosikov (Восиков Ботирбек Абдулазиз угли)',
    
    // Footer
    'footer.rights': 'Все права защищены',
    'footer.ministry': 'Министерство здравоохранения Республики Узбекистан',
    'footer.organizers': 'Организаторы',
  },
  uz: {
    // Navigatsiya
    'nav.home': 'Bosh sahifa',
    'nav.about': 'Maktab haqida',
    'nav.program': 'Dastur',
    'nav.speakers': 'Maʼruzachilar',
    'nav.registration': 'Roʻyxatdan oʻtish',
    'nav.cabinet': 'Kabinet',
    'nav.abstracts': 'Nashrlar',
    'nav.journal': 'Jurnal',
    'nav.venue': 'Joy',
    'nav.accommodation': 'Turar joy',
    'nav.news': 'Yangiliklar',
    'nav.contacts': 'Aloqalar',
    
    // Qahramon
    'hero.title': 'III Yosh psixiatr va narkologlar bahorgi Samarqand maktabi',
    'hero.subtitle': '',
    'hero.dates': '2026 yil 8-12 aprel',
    'hero.location': 'Samarqand, Oʻzbekiston',
    'hero.register': 'Roʻyxatdan oʻtish',
    'hero.submit': 'Nashr topshirish',
    
    // Asosiy raqamlar
    'stats.participants': 'Ishtirokchilar',
    'stats.days': 'Kunlar',
    'stats.speakers': 'Maʼruzachilar',
    'stats.languages': 'Tillar',
    
    // Sana
    'dates.title': 'Muhim sanalar',
    'dates.abstract': 'Nashr topshirish muddati',
    'dates.registration': 'Roʻyxatdan oʻtish muddati',
    'dates.event': 'Tadbir sanalari',
    
    // Haqida
    'about.title': 'Maktab haqida',
    'about.description': 'III Yosh psixiatr va narkologlar bahorgi Samarqand maktabi Oʻzbekiston psixiatrlari assotsiatsiyasining ilmiy va taʼlimiy loyihasi doirasida oʻtkaziladi.',
    'about.audience': 'Maqsadli auditoriya',
    'about.audience.desc': 'Oflayn formatda ishtirok etish uchun 40 yoshgacha boʻlgan yosh mutaxassislar — psixiatrlar, narkologlar, psixoterapevtlar, tibbiy psixologlar, nevrologlar va boshqa turdosh ixtisosliklar shifokorlari, shuningdek psixiatriya, narkologiya, tibbiy psixologiya boʻyicha magistratura rezidentlari va klinik ordinatorlar taklif etiladi. Onlayn formatda shu yoʻnalishdagi mutaxassislar yosh chegarasisiz taklif etiladi. Ingliz tilini bilish afzallik hisoblanadi.',
    
    // Tashkilotchilar
    'organizers.title': 'Tashkilotchilar',
    'org.0': 'Oʻzbekiston Respublikasi Sogʻliqni Saqlash Vazirligi',
    'org.1': 'Ruhiy salomatlik boʻyicha Respublika ixtisoslashgan ilmiy-amaliy tibbiyot markazi',
    'org.2': 'Samarqand davlat tibbiyot universiteti',
    'org.3': 'Toshkent davlat tibbiyot universiteti',
    'org.4': 'Jahon psixiatriya assotsiatsiyasi',
    'org.5': 'Oʻzbekiston psixiatrlari assotsiatsiyasi',
    
    // Roʻyxatdan oʻtish
    'reg.title': 'Ishtirokchilarni roʻyxatdan oʻtkazish',
    'reg.notice': 'Joylar soni 50 nafar bevosita va 50 nafar onlayn ishtirokchi bilan cheklangan.',
    'reg.deadline': 'Roʻyxatdan oʻtish muddati: 2026 yil 1 mart',
    'reg.free': 'Ishtirok etish tasdiqlangan narxlar roʻyxatiga muvofiq toʻlovni oʻz ichiga oladi. 2026 yil uchun aʼzolik badallarini toʻlagan ishtirokchilarga 10% chegirma taqdim etiladi.',
    'reg.requirements': 'Ishtirok shartlari',
    'reg.req.1': 'Oflayn format: 40 yoshgacha boʻlgan yosh mutaxassislar — psixiatrlar, narkologlar, psixoterapevtlar, tibbiy psixologlar, nevrologlar va boshqa turdosh ixtisosliklar shifokorlari, shuningdek psixiatriya, narkologiya, tibbiy psixologiya boʻyicha magistratura rezidentlari va klinik ordinatorlar.',
    'reg.req.2': 'Onlayn format: shu yoʻnalishdagi mutaxassislar yosh chegarasisiz, shuningdek psixiatriya, narkologiya, tibbiy psixologiya boʻyicha magistratura rezidentlari va klinik ordinatorlar.',
    'reg.req.3': 'Oʻzbekiston Psixiatrlari Assotsiatsiyasi aʼzolari uchun (2026 yil aʼzolik badali toʻlangan): chek taqdim etilganda 10% chegirma.',
    'reg.req.4': 'Ingliz tilini bilish afzallik hisoblanadi',
    'reg.slots': 'Boʻsh joylar',
    'reg.closed': 'Roʻyxatdan oʻtish yopildi',
    'reg.receipts': 'Toʻlov dalilini quyidagi manzilga yuboring: uzpa.org@gmail.com',
    'reg.journal': 'Materiallar Interdisciplinary Journal of Psychiatry and Addiction jurnalida chop etiladi',
    
    // Forma
    'form.name': 'Toʻliq ism',
    'form.email': 'Email',
    'form.phone': 'Telefon',
    'form.birthdate': 'Tugʻilgan sana',
    'form.city': 'Shahar',
    'form.country': 'Mamlakat',
    'form.position': 'Lavozim',
    'form.organization': 'Tashkilot',
    'form.specialty': 'Ixtisoslik',
    'form.specialty.psychiatrist': 'Psixiatr',
    'form.specialty.psychotherapist': 'Psixoterapevt',
    'form.specialty.narcologist': 'Narkolog',
    'form.specialty.other': 'Boshqa',
    'form.specialty.other.placeholder': 'Ixtisoslikni kiriting',
    'form.experience': 'Ish tajribasi (yillar)',
    'form.telegram': 'Telegram',
    'form.membership': 'Aʼzolik yillari (2020-2026)',
    'form.participation.type': 'Ishtirok turi',
    'form.participation.inperson': 'Shaxsan',
    'form.participation.online': 'Onlayn',
    'form.participant.category': 'Ishtirokchi toifasi',
    'form.category.standard': 'Standart',
    'form.category.apu': 'APU aʼzosi (2026 yil uchun aʼzolik badali toʻlangan)',
    'form.category.international': 'Xorijiy ishtirokchi',
    'form.membership.proof': '2026 yil uchun APU aʼzoligini tasdiqlash',
    'form.membership.upload': 'Toʻlov tasdiqini yuklash',
    'form.consent.data': 'Shaxsiy maʼlumotlarni qayta ishlashga roziman',
    'form.consent.rules': 'Ishtirok qoidalariga roziman',
    'form.consent.media': 'Foto/video suratga olish va nashr etishga roziman',
    'form.submit': 'Arizani topshirish',
    'form.success': 'Ariza muvaffaqiyatli topshirildi!',
    'form.error': 'Arizani yuborishda xato',
    'form.validation.age': 'Ishtirokchilar 40 yoshgacha boʻlishi kerak',
    'form.validation.experience': 'Minimal 1 yillik tajriba talab qilinadi',
    'form.validation.telegram': 'Telegram foydalanuvchi nomi @ bilan boshlanishi kerak',
    
    // Abstrakt
    'abstract.title': 'Nashrlarni topshirish',
    'abstract.deadline': 'Muddat: 2026-yil 1-mart',
    'abstract.format': 'Formatlash talablari',
    'abstract.structure': 'Nashr tuzilmasi',
    'abstract.email': 'Yuborish manzili: uzpa.org@gmail.com',
    'abstract.subject': 'Email mavzusi: "Muallifning toʻliq ismi - Samarqand maktabi - 2026"',
    
    // Joy
    'venue.title': 'Joy',
    'venue.university': 'Samarkand Davlat Tibbiyot Universiteti',
    'venue.opening': 'Katta ochilish: Katta zal, 6 Ankaba koʻchasi',
    'venue.sessions': 'Boʻlim yigʻilishlari: 18 Amir Temur koʻchasi',
    'venue.about': 'Samarkand haqida',
    'venue.about.desc': 'Samarkand Markaziy Osiyodagi eng qadimgi shaharlaridan biri, UNESCO Jahon madaniy merosi roʻyxatiga kiritilgan, Registon maydoni va boy islomiy meʼmorchiligi bilan mashhur.',
    
    // Yangiliklar
    'news.title': 'Yangiliklar va eʼlonlar',
    'news.empty': 'Hali yangiliklar yoʻq. Yangilanishlar uchun kuzatib boring!',
    
    // Aloqa maʼlumotlari
    'contacts.title': 'Aloqa maʼlumotlari',
    'contacts.email': 'Email',
    'contacts.telegram': 'Telegram',
    'contacts.committee': 'Tashkiliy qoʻmita',
    'contacts.telegram.rosa': '@RoseUserbayeva (Userbayeva Roza Kuralbaevna)',
    'contacts.telegram.inara': '@inarakhayredinova (Khayredinova Inara Ilgizovna)',
    'contacts.telegram.botir': '@vosikov (Vosikov Botirbek Abdulaziz ugli)',
    
    // Pastki qism
    'footer.rights': 'Barcha huquqlar himoyalangan',
    'footer.ministry': 'Oʻzbekiston Respublikasi Sogʻliqni Saqlash Vazirligi',
    'footer.organizers': 'Tashkilotchilar',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export function getLogoPath(language: Language): string {
  const logos: Record<Language, string> = {
    en: '/images/Лого анг.png',
    ru: '/images/Лого рус.png',
    uz: '/images/Лого узб.png',
  };
  return logos[language];
}
