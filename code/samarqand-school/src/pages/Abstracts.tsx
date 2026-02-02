import { useI18n } from '../lib/i18n';
import { AlertCircle, FileText, Mail, List, Clock } from 'lucide-react';

export default function Abstracts() {
  const { language, t } = useI18n();

  const formatting = language === 'ru'
    ? ['Формат файла: DOC/DOCX', 'Объём: до 500 слов', 'Шрифт: Times New Roman, 12 pt', 'Интервал: 1,5', 'Поля: 2 см', 'Абзацный отступ: 1,25 см']
    : language === 'uz'
    ? ['Fayl formati: DOC/DOCX', 'Hajmi: 500 soʻzgacha', 'Shrift: Times New Roman, 12 pt', 'Interval: 1,5', 'Maydonlar: 2 sm', 'Xat boshi: 1,25 sm']
    : ['File format: DOC/DOCX', 'Volume: up to 500 words', 'Font: Times New Roman, 12 pt', 'Line spacing: 1.5', 'Margins: 2 cm', 'Paragraph indent: 1.25 cm'];

  const structure = language === 'ru'
    ? ['Введение - краткое обоснование темы, актуальность', 'Цели и задачи / гипотезы', 'Методы - методы сбора и анализа данных', 'Результаты - основные данные, статистика', 'Обсуждение - интерпретация результатов', 'Заключение - выводы, научная значимость']
    : language === 'uz'
    ? ['Kirish - mavzuning qisqacha asoslanishi, dolzarbligi', 'Maqsad va vazifalar / gipotezalar', 'Metodlar - maʼlumotlarni yigʻish va tahlil qilish usullari', 'Natijalar - asosiy maʼlumotlar, statistika', 'Muhokama - natijalarni talqin qilish', 'Xulosa - xulosalar, ilmiy ahamiyat']
    : ['Introduction - brief justification, relevance', 'Goals and objectives / hypotheses', 'Methods - data collection and analysis methods', 'Results - main data, statistics', 'Discussion - interpretation of results', 'Conclusion - findings, scientific significance'];

  const articleRequirements = language === 'ru'
    ? {
        title: 'Требования для статей',
        note: 'При несоблюдении требований статьи возвращаются авторам без рассмотрения.',
        sections: [
          {
            title: 'Ключевые условия',
            items: [
              'Языки: узбекский, русский или английский.',
              'Укажите автора для переписки с редакцией (email и телефон).',
              'Редколлегия рецензирует материалы и может запросить дополнительные данные.',
              'К статье прилагаются: официальное направление/письмо, отчет антиплагиат (уникальность не менее 86%), две рецензии.',
              'Обязателен ORCID для каждого автора; подтвердите, что работа не публиковалась ранее.',
              'Раскройте конфликты интересов и роль спонсоров; статья подписана всеми авторами или одним с пометкой согласия.',
            ],
          },
          {
            title: 'Научные требования',
            items: [
              'Четко обозначьте актуальность, научную значимость, результаты и выводы.',
              'Соблюдайте научный стиль, точность и логичность изложения.',
              'Введение — актуальность и цель; основная часть — материалы/методы и результаты; заключение — выводы и перспективы.',
              'Заимствования оформляйте ссылками, источники указывайте в списке литературы.',
            ],
          },
          {
            title: 'Технические требования',
            items: [
              'Формат: Microsoft Word, поля 2 см, Times New Roman 12, интервал 1,5, выравнивание по ширине, абзац 1 см.',
              'Объем (без аннотации, иллюстраций и списка литературы): исследование — до 40 000 знаков, обзор — до 60 000, клинические случаи — до 20 000, краткие сообщения — до 10 000.',
              'Структура: Аннотация (3 языка, 150-250 слов), Ключевые слова (5-10), Введение, Материалы и методы, Результаты, Обсуждение, Заключение, Благодарности, Список литературы.',
              'Рисунки и таблицы нумеруются, размещаются в тексте, подписи приводятся, пригодны для ч/б.',
              'Список литературы — по NLM, DOI при наличии; не менее 20 источников за последние 3 года, иностранных — не менее 15; обзорные статьи — до 100 источников.',
            ],
          },
        ],
      }
    : language === 'uz'
    ? {
        title: 'Maqolalar uchun talablar',
        note: 'Talablarga rioya qilinmasa, maqolalar koʼrib chiqilmasdan qaytariladi.',
        sections: [
          {
            title: 'Asosiy shartlar',
            items: [
              'Tillar: oʻzbek, rus yoki ingliz.',
              'Tahririyat bilan yozishmalar uchun masʼul muallifni koʼrsating (email va telefon).',
              'Tahrir hayʼati materiallarni taqriz qiladi va qoʼshimcha maʼlumot soʼrashi mumkin.',
              'Ilovalar: rasmiy yoʼllanma/xat, antiplagiat hisoboti (noyoblik kamida 86%), ikki taqriz.',
              'Har bir muallif uchun ORCID majburiy; ish avval chop etilmaganini tasdiqlang.',
              'Manfaatlar toʼqnashuvi va homiylar rolini ochib bering; maqola barcha mualliflar yoki biri tomonidan “hamma mualliflar bilan kelishilgan” qaydi bilan imzolanadi.',
            ],
          },
          {
            title: 'Ilmiy talablar',
            items: [
              'Dolzarblik, ilmiy ahamiyat, natijalar va xulosalar aniq koʼrsatilishi.',
              'Ilmiy uslub, aniqlik va mantiqiy bayon.',
              'Kirish — dolzarblik va maqsad; asosiy qism — materiallar/usullar va natijalar; xulosa — yakun va istiqbollar.',
              'Olingan materiallar havolalar bilan rasmiylashtiriladi, manbalar adabiyotlar roʼyxatida beriladi.',
            ],
          },
          {
            title: 'Texnik talablar',
            items: [
              'Format: Microsoft Word, maydonlar 2 sm, Times New Roman 12, interval 1,5, eni boʼyicha tekislash, abzats 1 sm.',
              'Hajm (annotatsiya, rasm va adabiyotdan tashqari): tadqiqot — 40 000 belgigacha, sharh — 60 000, klinik holatlar — 20 000, qisqa xabarlar — 10 000.',
              'Tuzilishi: Annotatsiya (3 tilda, 150-250 soʼz), Kalit soʼzlar (5-10), Kirish, Materiallar va usullar, Natijalar, Muhokama, Xulosa, Minnatdorchilik, Adabiyotlar roʼyxati.',
              'Rasmlar va jadvallar raqamlanadi, matn ichida joylashtiriladi, sarlavhalar beriladi, oq-qora koʼrinishda ham mos boʼlishi kerak.',
              'Adabiyotlar roʼyxati NLM boʼyicha; DOI boʼlsa koʼrsatiladi; soʼnggi 3 yildan kamida 20 manba, xorijiy — kamida 15; sharh maqola uchun 100 tagacha manba.',
            ],
          },
        ],
      }
    : {
        title: 'Requirements for Articles',
        note: 'Non-compliance with the requirements results in the manuscript being returned without review.',
        sections: [
          {
            title: 'Key conditions',
            items: [
              'Languages: Uzbek, Russian, or English.',
              'Indicate the corresponding author (email and phone).',
              'The editorial board reviews submissions and may request additional data.',
              'Attach: official referral/cover letter, anti-plagiarism report (uniqueness at least 86%), two reviews.',
              'ORCID is required for each author; confirm the work has not been published previously.',
              'Disclose conflicts of interest and sponsor roles; the manuscript is signed by all authors or one with an approval note.',
            ],
          },
          {
            title: 'Scientific requirements',
            items: [
              'Clearly state relevance, scientific significance, results, and conclusions.',
              'Use a scientific style with precision and logical flow.',
              'Introduction — relevance and purpose; main part — materials/methods and results; conclusion — findings and prospects.',
              'Citations must be properly referenced and included in the references list.',
            ],
          },
          {
            title: 'Technical requirements',
            items: [
              'Format: Microsoft Word, margins 2 cm, Times New Roman 12, line spacing 1.5, justified, paragraph indent 1 cm.',
              'Length (excluding abstract, figures, references): research up to 40,000 characters, review up to 60,000, clinical cases up to 20,000, brief reports up to 10,000.',
              'Structure: Abstract (3 languages, 150-250 words), Keywords (5-10), Introduction, Materials and methods, Results, Discussion, Conclusion, Acknowledgements, References.',
              'Figures and tables are numbered, placed in the text, captions provided, suitable for color and B/W.',
              'References follow NLM; include DOI if available; at least 20 sources from the last 3 years, at least 15 foreign; review articles up to 100 sources.',
            ],
          },
        ],
      };

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">
            {language === 'ru' ? 'Публикации' : language === 'uz' ? 'Nashrlar' : 'Publications'}
          </h1>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Deadline Alert */}
          <div className="mb-8 p-6 bg-error/10 border border-error/30 rounded-md flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-error flex-shrink-0" />
            <div>
              <h2 className="font-bold text-neutral-900 text-lg mb-1">{t('abstract.deadline')}</h2>
              <p className="text-neutral-700">
                {language === 'ru' 
                  ? 'Принимаются тезисы и статьи. Требования к статьям приведены в правилах журнала ниже.'
                  : language === 'uz'
                  ? 'Tezislar va maqolalar qabul qilinadi. Maqolalar uchun talablar quyida jurnal qoidalarida keltirilgan.'
                  : 'Abstracts and articles are accepted. Article requirements are listed in the journal guidelines below.'}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Requirements for Abstracts */}
            <div className="bg-white border border-neutral-200 rounded-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  {language === 'ru' ? 'Требования для тезисов' : language === 'uz' ? 'Tezislar uchun talablar' : 'Requirements for Abstracts'}
                </h2>
              </div>
              <ul className="space-y-3">
                {formatting.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements for Articles */}
            <div className="bg-white border border-neutral-200 rounded-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <List className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  {articleRequirements.title}
                </h2>
              </div>
              <div className="space-y-4">
                {articleRequirements.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx}>
                    <h3 className="font-medium text-neutral-900 mb-2">{section.title}</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-xs text-neutral-600">{articleRequirements.note}</p>
              </div>
            </div>
          </div>

          {/* Submission Info */}
          <div className="mt-8">
            <div className="p-6 bg-neutral-100 border border-neutral-200 rounded-md">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-neutral-600" />
                <span className="font-semibold text-neutral-900">{t('abstract.subject')}</span>
              </div>
              <p className="text-neutral-700">
                {language === 'ru' ? 'Пример: "Иванов И.И. - Самаркандская школа - 2026"' : language === 'uz' ? 'Misol: "Ivanov I.I. - Samarqand maktabi - 2026"' : 'Example: "Smith J. - Samarqand School - 2026"'}
              </p>
            </div>
          </div>

          {/* Competition */}
          <div className="mt-8 p-6 bg-primary-50 border border-primary-200 rounded-md">
            <h3 className="font-semibold text-neutral-900 mb-2">
              {language === 'ru' ? 'Конкурс научных работ' : language === 'uz' ? 'Ilmiy ishlar tanlovi' : 'Research Competition'}
            </h3>
            <p className="text-neutral-700 mb-3">
              {language === 'ru' 
                ? 'Авторам лучших 10 работ, отобранных жюри на предварительном этапе, будет предоставлена возможность выступить с 5-минутным докладом перед участниками Школы.'
                : language === 'uz'
                ? 'Hakamlar hay\'ati tomonidan dastlabki bosqichda tanlangan eng yaxshi 10 ishning mualliflariga Maktab ishtirokchilari oldida 5 daqiqalik maʼruza qilish imkoniyati beriladi.'
                : 'Authors of the top 10 papers selected by the jury at the preliminary stage will be given the opportunity to present a 5-minute report to the School participants.'}
            </p>
            <p className="text-sm text-neutral-600">
              {language === 'ru' 
                ? 'Лучшие работы будут опубликованы в "Междисциплинарном журнале психиатрии и аддиктологии"'
                : language === 'uz'
                ? 'Eng yaxshi ishlar "Psixiatriya va addiktologiya boʻyicha fanlararo jurnal"da nashr etiladi'
                : 'Best papers will be published in the "Interdisciplinary Journal of Psychiatry and Addictology"'}
            </p>
          </div>

          {/* References */}
          <div className="mt-8 p-6 bg-white border border-neutral-200 rounded-md">
            <h3 className="font-semibold text-neutral-900 mb-3">
              {language === 'ru' ? 'Ссылки и литература' : language === 'uz' ? 'Havolalar va adabiyot' : 'References'}
            </h3>
            <ul className="space-y-2 text-neutral-700">
              <li>{language === 'ru' ? 'Стиль ссылок: Vancouver (в круглых скобках)' : language === 'uz' ? 'Havola uslubi: Vancouver (qavs ichida)' : 'Citation style: Vancouver (in parentheses)'}</li>
              <li>{language === 'ru' ? 'Список литературы - в конце документа' : language === 'uz' ? 'Adabiyotlar roʻyxati - hujjat oxirida' : 'References list - at the end of the document'}</li>
              <li>{language === 'ru' ? 'Литература преимущественно за последние 10 лет' : language === 'uz' ? 'Asosan soʻnggi 10 yil ichidagi adabiyotlar' : 'Literature preferably from the last 10 years'}</li>
            </ul>
          </div>

          {/* Journal Requirements */}
          <div className="mt-8 p-6 bg-secondary-50 border border-secondary-200 rounded-md">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {language === 'ru' ? 'Требования для публикации в журнале' : language === 'uz' ? 'Jurnalda nashr etish uchun talablar' : 'Requirements for Journal Publication'}
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  {language === 'ru' ? 'Основные требования:' : language === 'uz' ? 'Asosiy talablar:' : 'Main requirements:'}
                </h4>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500">•</span>
                    {language === 'ru' 
                      ? 'Языки: узбекский, русский или английский'
                      : language === 'uz'
                      ? 'Tillar: oʻzbekcha, ruscha yoki inglizcha'
                      : 'Languages: Uzbek, Russian or English'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500">•</span>
                    {language === 'ru' 
                      ? 'Объём: исследование - до 40 000 знаков, обзор - до 60 000'
                      : language === 'uz'
                      ? 'Hajmi: tadqiqot - 40 000 belgigacha, sharh - 60 000gacha'
                      : 'Volume: research - up to 40,000 characters, review - up to 60,000'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500">•</span>
                    {language === 'ru' 
                      ? 'Уникальность текста: ≥ 86%'
                      : language === 'uz'
                      ? 'Matnning noyobligi: ≥ 86%'
                      : 'Text uniqueness: ≥ 86%'}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary-500">•</span>
                    {language === 'ru' 
                      ? 'Две рецензии от специалистов'
                      : language === 'uz'
                      ? 'Mutaxassislardan ikkita sharh'
                      : 'Two reviews from specialists'}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">
                  {language === 'ru' ? 'Структура статьи:' : language === 'uz' ? 'Maqola tuzilishi:' : 'Article structure:'}
                </h4>
                <p className="text-sm text-neutral-700">
                  {language === 'ru' 
                    ? 'Аннотация (на 3 языках), Ключевые слова, Введение, Материалы и методы, Результаты, Обсуждение, Заключение, Благодарности, Список литературы'
                    : language === 'uz'
                    ? 'Annotatsiya (3 tilda), Kalit soʻzlar, Kirish, Materiallar va usullar, Natijalar, Muhokama, Xulosa, Minnatdorchilik, Adabiyotlar roʻyxati'
                    : 'Abstract (in 3 languages), Keywords, Introduction, Materials and methods, Results, Discussion, Conclusion, Acknowledgements, References'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
