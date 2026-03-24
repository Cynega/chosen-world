import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const titleRef = useRef(null);
  const { t } = useLanguage();

  const stats    = t('hero.stats');
  const navLinks = t('hero.navLinks');

  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      setTimeout(() => {
        el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    }
  }, []);

  return (
    <section
      id="hero"
      className="film-grain relative min-h-screen flex flex-col justify-center items-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, #1a2240 0%, #141B2D 40%, #0D1117 100%)',
      }}
    >
      {/* Decorative light rays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 200deg at 65% 30%, transparent 0deg, rgba(212,160,23,0.04) 15deg, transparent 30deg, transparent 180deg, rgba(212,160,23,0.03) 200deg, transparent 220deg)',
        }}
      />

      {/* Top ornamental bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, #C77B3A, #D4A017, transparent)' }} />

      <div ref={titleRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pt-24">

        {/* Main title */}
        <h1
          className="font-serif text-5xl sm:text-6xl md:text-8xl font-black leading-none tracking-tight mb-3"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#D4A017',
            textShadow: '0 0 80px rgba(212, 160, 23, 0.25)',
            letterSpacing: '0.05em',
          }}
        >
          THE CHOSEN
        </h1>

        {/* Subtitle */}
        <h2
          className="font-serif text-xl sm:text-2xl md:text-3xl font-normal italic mb-2"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            color: '#F5EDD6',
            opacity: 0.9,
          }}
        >
          {t('hero.subtitle')}
        </h2>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, transparent, #C77B3A)' }} />
          <div className="w-2 h-2 rotate-45" style={{ background: '#D4A017' }} />
          <div className="h-px flex-1 max-w-24" style={{ background: 'linear-gradient(90deg, #C77B3A, transparent)' }} />
        </div>

        {/* Description */}
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed mb-10"
          style={{ color: '#8B9BB4', fontFamily: 'Inter, sans-serif' }}
        >
          {t('hero.description')}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 w-full max-w-2xl">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-lg border"
              style={{
                background: 'rgba(20, 27, 45, 0.7)',
                borderColor: 'rgba(212, 160, 23, 0.25)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="stat-glow text-2xl sm:text-3xl font-bold mb-1"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: '#D4A017',
                }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-center leading-tight" style={{ color: '#8B9BB4' }}>
                {stat.label}
              </span>
              {stat.note && (
                <span className="text-xs text-center leading-tight mt-1" style={{ color: '#4A5A6E', fontSize: '0.6rem' }}>
                  {stat.note}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Navigation anchors */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-xs font-medium tracking-wider uppercase rounded border transition-all duration-200"
              style={{
                borderColor: 'rgba(212, 160, 23, 0.4)',
                color: '#D4A017',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.12em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212, 160, 23, 0.12)';
                e.currentTarget.style.borderColor = '#D4A017';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.4)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Disclaimer badge */}
        <div
          className="flex items-start gap-3 p-4 rounded-lg border max-w-2xl text-left mb-16"
          style={{
            background: 'rgba(199, 123, 58, 0.08)',
            borderColor: 'rgba(199, 123, 58, 0.3)',
          }}
        >
          <span className="text-lg flex-shrink-0 mt-0.5">ℹ️</span>
          <p className="text-xs leading-relaxed" style={{ color: '#8B9BB4' }}>
            <span className="font-semibold" style={{ color: '#C77B3A' }}>{t('hero.disclaimerLabel')} </span>
            {t('hero.disclaimerText')}
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0D1117)' }}
      />
    </section>
  );
}
