import React, { useEffect, useRef } from 'react';
import Hero from './components/Hero';
import WorldMap from './components/WorldMap';
import PlatformGrid from './components/PlatformGrid';
import ReligionChart from './components/ReligionChart';
import DataSources from './components/DataSources';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Intersection Observer for fade-in sections
function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

// Sticky navigation bar
function NavBar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('hero');
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = ['hero', 'worldmap', 'platforms', 'religion', 'sources'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero',      label: t('nav.inicio'),      id: 'hero' },
    { href: '#worldmap',  label: t('nav.mapa'),         id: 'worldmap' },
    { href: '#platforms', label: t('nav.plataformas'),  id: 'platforms' },
    { href: '#religion',  label: t('nav.demografia'),   id: 'religion' },
    { href: '#sources',   label: t('nav.fuentes'),      id: 'sources' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13, 17, 23, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212, 160, 23, 0.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'rgba(212, 160, 23, 0.15)', border: '1px solid rgba(212,160,23,0.3)' }}
          >
            <span style={{ color: '#D4A017', fontSize: '0.7rem' }}>✦</span>
          </div>
          <span
            className="text-sm font-semibold hidden sm:block"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: '#D4A017',
              letterSpacing: '0.05em',
            }}
          >
            THE CHOSEN
          </span>
        </a>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all duration-150"
              style={{
                color: activeSection === link.id ? '#D4A017' : '#8B9BB4',
                background: activeSection === link.id ? 'rgba(212, 160, 23, 0.08)' : 'transparent',
                letterSpacing: '0.04em',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: language toggle + CTA */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div
            className="flex items-center rounded border overflow-hidden"
            style={{ borderColor: 'rgba(139,155,180,0.25)' }}
          >
            {['en', 'es'].map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="text-xs font-semibold px-2.5 py-1 transition-all duration-150"
                style={{
                  background: lang === l ? 'rgba(212,160,23,0.15)' : 'transparent',
                  color: lang === l ? '#D4A017' : '#4A5A6E',
                  borderRight: i === 0 ? '1px solid rgba(139,155,180,0.25)' : 'none',
                  letterSpacing: '0.05em',
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://thechosen.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 rounded border transition-all duration-150"
            style={{
              color: '#D4A017',
              borderColor: 'rgba(212, 160, 23, 0.35)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(212,160,23,0.1)';
              e.currentTarget.style.borderColor = '#D4A017';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(212,160,23,0.35)';
            }}
          >
            {t('nav.verSerie')}
          </a>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  useFadeIn();

  return (
    <div style={{ background: '#0D1117', minHeight: '100vh' }}>
      <NavBar />
      <Hero />

      <div className="fade-in-section">
        <WorldMap />
      </div>

      <div className="section-divider" />

      <div className="fade-in-section">
        <PlatformGrid />
      </div>

      <div className="section-divider" />

      <div className="fade-in-section">
        <ReligionChart />
      </div>

      <div className="section-divider" />

      <DataSources />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
