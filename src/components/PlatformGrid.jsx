import React, { useState } from 'react';
import { platformsData, regionGroups, lastUpdated } from '../data/platforms';
import { trendsData } from '../data/trends';
import { useLanguage } from '../contexts/LanguageContext';

const PLATFORM_STYLE = {
  'Netflix':             { bg: 'rgba(229,9,20,0.15)',    color: '#FF4444', border: 'rgba(229,9,20,0.4)' },
  'Amazon Prime Video':  { bg: 'rgba(0,168,224,0.15)',   color: '#00A8E0', border: 'rgba(0,168,224,0.4)' },
  'The Chosen App':      { bg: 'rgba(124,58,237,0.15)',  color: '#A78BFA', border: 'rgba(124,58,237,0.4)' },
  'Peacock':             { bg: 'rgba(0,200,83,0.15)',    color: '#4ADE80', border: 'rgba(0,200,83,0.4)' },
  'BYUtv':               { bg: 'rgba(234,88,12,0.15)',   color: '#FB923C', border: 'rgba(234,88,12,0.4)' },
  'ViX+':                { bg: 'rgba(219,39,119,0.15)',  color: '#F472B6', border: 'rgba(219,39,119,0.4)' },
};

// Build lookup from iso → full platform object
const platformLookup = {};
platformsData.forEach(p => { platformLookup[p.iso] = p; });

function PlatformBadge({ name }) {
  const style = PLATFORM_STYLE[name] || { bg: 'rgba(255,255,255,0.08)', color: '#F5EDD6', border: 'rgba(255,255,255,0.2)' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {name}
    </span>
  );
}

function CountryCard({ iso }) {
  const { t, countryName } = useLanguage();
  const platform = platformLookup[iso];
  const trend = trendsData[iso];
  if (!platform) return null;

  return (
    <div
      className="rounded-xl p-4 border transition-all duration-200 group"
      style={{
        background: 'rgba(20, 27, 45, 0.6)',
        borderColor: 'rgba(212, 160, 23, 0.12)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.35)';
        e.currentTarget.style.background = 'rgba(30, 42, 58, 0.8)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(212, 160, 23, 0.12)';
        e.currentTarget.style.background = 'rgba(20, 27, 45, 0.6)';
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{platform.flag}</span>
          <div>
            <p className="text-sm font-semibold leading-tight" style={{ color: '#F5EDD6' }}>
              {countryName(iso)}
            </p>
            {trend && (
              <p className="text-xs mt-0.5" style={{ color: '#8B9BB4' }}>
                {t('platforms.interest')} <span style={{ color: '#D4A017' }}>{trend.score}</span>/100
              </p>
            )}
          </div>
        </div>
        {trend && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: `conic-gradient(#D4A017 ${trend.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#141B2D', fontSize: '0.6rem', color: '#D4A017' }}
            >
              {trend.score}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {platform.platforms.map(p => (
          <PlatformBadge key={p} name={p} />
        ))}
      </div>
    </div>
  );
}

export default function PlatformGrid() {
  const [activeRegion, setActiveRegion] = useState(null);
  const { t } = useLanguage();

  const allPlatforms = Object.keys(PLATFORM_STYLE);

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString('es-AR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <section
      id="platforms"
      className="py-20 px-4"
      style={{ background: '#0D1117' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4A017' }}>
              {t('platforms.eyebrow')}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5EDD6' }}
          >
            {t('platforms.title')}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8B9BB4' }}>
            {t('platforms.description')}
          </p>
          <div className="flex flex-col items-center gap-2 mt-4">
            {lastUpdated ? (
              <span className="text-xs" style={{ color: '#8B9BB4' }}>
                {t('platforms.updatedOn')}{' '}{formattedDate}
              </span>
            ) : (
              <span className="text-xs" style={{ color: '#C77B3A' }}>
                {t('platforms.noData')}
              </span>
            )}
            <a
              href="https://www.justwatch.com/ar/pelicula/the-chosen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-80"
              style={{ background: 'rgba(212,160,23,0.12)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.35)' }}
            >
              {t('platforms.watchOnJustWatch')}
            </a>
          </div>
        </div>

        {/* Platform legend */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {allPlatforms.map(name => (
            <PlatformBadge key={name} name={name} />
          ))}
        </div>

        {/* Region tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setActiveRegion(null)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={
              activeRegion === null
                ? { background: 'rgba(212, 160, 23, 0.2)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.5)' }
                : { background: 'transparent', color: '#8B9BB4', border: '1px solid rgba(255,255,255,0.1)' }
            }
          >
            {t('platforms.allRegions')}
          </button>
          {regionGroups.map(rg => (
            <button
              key={rg.region}
              onClick={() => setActiveRegion(rg.region === activeRegion ? null : rg.region)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeRegion === rg.region
                  ? { background: 'rgba(212, 160, 23, 0.2)', color: '#D4A017', border: '1px solid rgba(212,160,23,0.5)' }
                  : { background: 'transparent', color: '#8B9BB4', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {rg.icon} {t(`platforms.regionNames.${rg.region}`) || rg.region}
            </button>
          ))}
        </div>

        {/* Regions */}
        <div className="space-y-12">
          {regionGroups
            .filter(rg => activeRegion === null || rg.region === activeRegion)
            .map(rg => (
              <div key={rg.region}>
                {/* Region header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rg.icon}</span>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5EDD6' }}
                    >
                      {t(`platforms.regionNames.${rg.region}`) || rg.region}
                    </h3>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'rgba(212, 160, 23, 0.15)' }} />
                  <span className="text-xs" style={{ color: '#4A5A6E' }}>
                    {rg.countries.length} {t('platforms.countries')}
                  </span>
                </div>

                {/* Country cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rg.countries.map(iso => (
                    <CountryCard key={iso} iso={iso} />
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Total count */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: '#4A5A6E' }}>
            {platformsData.length} {t('platforms.totalCount')}{' '}
            {lastUpdated ? new Date(lastUpdated).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
      </div>
    </section>
  );
}
