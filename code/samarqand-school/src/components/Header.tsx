import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useI18n, getLogoPath, Language } from '../lib/i18n';
import { getCurrentUser, type AuthUser } from '../lib/backend';

const navItems = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.program', path: '/program' },
  { key: 'nav.registration', path: '/registration' },
  { key: 'nav.cabinet', path: '/login' },
  { key: 'nav.abstracts', path: '/abstracts' },
  { key: 'nav.venue', path: '/venue' },
  { key: 'nav.news', path: '/news' },
  { key: 'nav.contacts', path: '/contacts' },
];

export default function Header() {
  const { language, setLanguage, t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const location = useLocation();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uz', name: 'O\'zbek' },
  ];

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={getLogoPath(language)}
              alt="Samarqand School"
              className="h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary-500'
                    : 'text-neutral-700 hover:text-primary-500'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === '/admin'
                    ? 'text-primary-500'
                    : 'text-neutral-700 hover:text-primary-500'
                }`}
              >
                {language === 'ru' ? 'Админ-панель' : language === 'uz' ? 'Admin panel' : 'Admin Panel'}
              </Link>
            )}
          </nav>

          {/* Right side: Language + CTA */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-neutral-700 hover:text-primary-500 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-card border border-neutral-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 transition-colors ${
                        language === lang.code ? 'text-primary-500 font-medium' : 'text-neutral-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              to="/registration"
              className="hidden sm:inline-flex items-center justify-center h-10 px-5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-sm transition-colors duration-200"
            >
              {t('hero.register')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-500'
                    : 'text-neutral-700'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  location.pathname === '/admin'
                    ? 'text-primary-500'
                    : 'text-neutral-700'
                }`}
              >
                {language === 'ru' ? 'Админ-панель' : language === 'uz' ? 'Admin panel' : 'Admin Panel'}
              </Link>
            )}
            <Link
              to="/registration"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4 py-3 bg-primary-500 text-white text-center font-semibold rounded-sm"
            >
              {t('hero.register')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
