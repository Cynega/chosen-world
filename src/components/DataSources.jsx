import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SOURCE_META = [
  { icon: '📈', badge: 'Google Trends',        badgeColor: '#4285F4', url: 'https://trends.google.com' },
  { icon: '🔬', badge: 'Pew Research Center',  badgeColor: '#1A6496', url: 'https://www.pewresearch.org/religion/2015/04/02/religious-projection-table/' },
  { icon: '📺', badge: 'JustWatch API',         badgeColor: '#FF9800', url: 'https://www.justwatch.com/ar/pelicula/the-chosen' },
  { icon: '🎬', badge: 'Angel Studios',         badgeColor: '#D4A017', url: 'https://thechosen.tv' },
];

function SourceCard({ meta, card }) {
  return (
    <div
      className="rounded-xl border p-6 transition-all duration-200 group"
      style={{
        background: 'rgba(20, 27, 45, 0.5)',
        borderColor: 'rgba(212, 160, 23, 0.12)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.3)';
        e.currentTarget.style.background = 'rgba(25, 35, 55, 0.7)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.12)';
        e.currentTarget.style.background = 'rgba(20, 27, 45, 0.5)';
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: `${meta.badgeColor}22`,
                color: meta.badgeColor,
                border: `1px solid ${meta.badgeColor}44`,
              }}
            >
              {meta.badge}
            </span>
          </div>

          <h3
            className="text-base font-semibold mb-2"
            style={{ color: '#F5EDD6', fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {card.title}
          </h3>

          <p className="text-sm leading-relaxed mb-3" style={{ color: '#6B7A8E' }}>
            {card.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
              style={{ color: '#D4A017' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F5EDD6'}
              onMouseLeave={e => e.currentTarget.style.color = '#D4A017'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {card.urlLabel}
            </a>

            <span className="text-xs" style={{ color: '#4A5A6E' }}>
              ⚠️ {card.note}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataSources() {
  const { t } = useLanguage();
  const cards = t('sources.cards');

  return (
    <section
      id="sources"
      className="py-20 px-4 border-t"
      style={{
        background: '#0A0F1A',
        borderColor: 'rgba(212, 160, 23, 0.15)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4A017' }}>
              {t('sources.eyebrow')}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5EDD6' }}
          >
            {t('sources.title')}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8B9BB4' }}>
            {t('sources.description')}
          </p>
        </div>

        {/* Source cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SOURCE_META.map((meta, i) => (
            <SourceCard key={i} meta={meta} card={cards[i]} />
          ))}
        </div>

        {/* General disclaimer */}
        <div
          className="rounded-xl p-6 border text-center"
          style={{
            background: 'rgba(199, 123, 58, 0.06)',
            borderColor: 'rgba(199, 123, 58, 0.2)',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#8B9BB4' }}>
            <span className="font-semibold" style={{ color: '#C77B3A' }}>{t('sources.disclaimerLabel')} </span>
            {t('sources.disclaimer')}
          </p>
        </div>

        {/* Official disclaimer */}
        <div
          className="mt-8 p-5 rounded-lg border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#6B7A8D' }}>
            <span className="font-semibold" style={{ color: '#8B9BB4' }}>{t('sources.officialNoteLabel')} </span>
            {t('sources.officialNote')}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(212, 160, 23, 0.15)', border: '1px solid rgba(212, 160, 23, 0.3)' }}>
              <span style={{ color: '#D4A017', fontSize: '0.85rem' }}>✦</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#F5EDD6', fontFamily: "'Playfair Display', serif" }}>
                The Chosen: Audiencia Global
              </p>
              <p className="text-xs" style={{ color: '#4A5A6E' }}>
                {t('sources.referenceData')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: '#4A5A6E' }}>
              {t('sources.builtBy')}{' '}
              <a
                href="https://emilianoarnaez.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#8B9BB4' }}
                className="hover:opacity-80 transition-opacity"
              >
                @Cynega
              </a>
              {' '}{t('sources.builtWith')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
