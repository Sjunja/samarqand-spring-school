import { Link } from 'react-router-dom';
import { useI18n, getLogoPath } from '../lib/i18n';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { language, t } = useI18n();

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <img
              src={getLogoPath(language)}
              alt="Samarqand School"
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-neutral-400 text-sm leading-relaxed">
              III Samarqand Spring School for Young Psychiatrists and Narcologists
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-neutral-400 hover:text-white text-sm transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/program" className="text-neutral-400 hover:text-white text-sm transition-colors">{t('nav.program')}</Link></li>
              <li><Link to="/registration" className="text-neutral-400 hover:text-white text-sm transition-colors">{t('nav.registration')}</Link></li>
              <li><Link to="/abstracts" className="text-neutral-400 hover:text-white text-sm transition-colors">{t('nav.abstracts')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('contacts.title')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-neutral-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:uzpa.org@gmail.com" className="hover:text-white transition-colors">uzpa.org@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 text-neutral-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{t('venue.university')}, Samarkand</span>
              </li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.organizers')}</h4>
            <ul className="space-y-2 text-neutral-400 text-sm">
              <li>{t('org.0')}</li>
              <li>{t('org.1')}</li>
              <li>{t('org.2')}</li>
              <li>{t('org.3')}</li>
              <li>{t('org.4')}</li>
              <li>{t('org.5')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>2026 III Samarqand Spring School. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
}
