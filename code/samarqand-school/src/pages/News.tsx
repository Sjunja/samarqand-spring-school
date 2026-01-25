import { useState, useEffect } from 'react';
import { useI18n, Language } from '../lib/i18n';
import { getPublishedNews, News as NewsType } from '../lib/backend';
import { Calendar, Newspaper } from 'lucide-react';

export default function News() {
  const { language, t } = useI18n();
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedNews().then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  const getTitle = (item: NewsType, lang: Language) => {
    return lang === 'ru' ? item.title_ru : lang === 'uz' ? item.title_uz : item.title_en;
  };

  const getContent = (item: NewsType, lang: Language) => {
    return lang === 'ru' ? item.content_ru : lang === 'uz' ? item.content_uz : item.content_en;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'uz' ? 'uz-UZ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-600 py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-title font-bold text-white">{t('news.title')}</h1>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl text-neutral-500">{t('news.empty')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {news.map((item) => (
                <article key={item.id} className="bg-white border border-neutral-200 rounded-md p-6 lg:p-8">
                  <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.published_at)}
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 mb-4">
                    {getTitle(item, language)}
                  </h2>
                  <p className="text-neutral-700 leading-relaxed">
                    {getContent(item, language)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
