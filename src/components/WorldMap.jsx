import React, { useState, useCallback, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { scaleSequential } from 'd3-scale';
import { interpolateYlOrBr } from 'd3-scale-chromatic';
import { trendsData } from '../data/trends';
import { platformsData } from '../data/platforms';
import { useLanguage } from '../contexts/LanguageContext';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO alpha-2 → ISO numeric (as strings, matching topojson geo.id)
const ISO_ALPHA2_TO_NUMERIC = {
  US: "840", PH: "608", BR: "076", MX: "484", AR: "032",
  CO: "170", PE: "604", NG: "566", KE: "404", ZA: "710",
  AU: "036", CA: "124", GB: "826", CL: "152", NZ: "554",
  PL: "616", ID: "360", IT: "380", ES: "724", IN: "356",
  KR: "410", DE: "276", FR: "250", IL: "376", PT: "620",
  ET: "231", GH: "288", UG: "800", MY: "458", SG: "702",
  JP: "392", CN: "156", TW: "158",
  RU: "643", UA: "804", RO: "642", HU: "348", CZ: "203", RS: "688",
  TR: "792",
  EG: "818", SA: "682", AE: "784", JO: "400", MA: "504", LB: "422",
};

// Build reverse map: numeric → alpha2
const numericToAlpha2 = {};
Object.entries(ISO_ALPHA2_TO_NUMERIC).forEach(([alpha2, num]) => {
  numericToAlpha2[num] = alpha2;
});

// Build platforms lookup: iso → list of platforms
const platformsByIso = {};
platformsData.forEach(p => {
  platformsByIso[p.iso] = p.platforms;
});

// Color scale
const colorScale = scaleSequential(interpolateYlOrBr).domain([0, 100]);

function getScoreEmoji(score) {
  if (score >= 80) return '🔥🔥🔥';
  if (score >= 60) return '🔥🔥';
  if (score >= 40) return '🔥';
  if (score >= 20) return '📈';
  return '📊';
}

const PLATFORM_COLORS = {
  'Netflix': '#E50914',
  'Amazon Prime Video': '#00A8E0',
  'The Chosen App': '#7C3AED',
  'Peacock': '#00C853',
  'BYUtv': '#EA580C',
  'ViX+': '#DB2777',
};

export default function WorldMap() {
  const [tooltip, setTooltip] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const { t, countryName } = useLanguage();

  const handleMouseMove = useCallback((e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, []);

  const handleMouseEnter = useCallback((geo) => {
    const numericId = String(geo.id);
    const alpha2 = numericToAlpha2[numericId];
    if (alpha2 && trendsData[alpha2]) {
      const data = trendsData[alpha2];
      const platforms = platformsByIso[alpha2] || [];
      setTooltip({ score: data.score, platforms, alpha2, searchTerm: data.searchTerm });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const legendStops = [0, 20, 40, 60, 80, 100];

  return (
    <section
      ref={sectionRef}
      id="worldmap"
      className="py-20 px-4 relative"
      style={{ background: 'linear-gradient(180deg, #0D1117 0%, #141B2D 50%, #0D1117 100%)' }}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4A017' }}>
              {t('worldmap.eyebrow')}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5EDD6' }}
          >
            {t('worldmap.title')}
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8B9BB4' }}>
            {t('worldmap.description')}
          </p>
        </div>

        {/* Map container */}
        <div
          className="rounded-2xl overflow-hidden border relative"
          style={{
            background: '#0D1825',
            borderColor: 'rgba(212, 160, 23, 0.15)',
            boxShadow: '0 0 60px rgba(0,0,0,0.6)',
          }}
        >
          <ComposableMap
            projectionConfig={{ scale: 147, center: [10, 10] }}
            style={{ width: '100%', height: 'auto' }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const numericId = String(geo.id);
                  const alpha2 = numericToAlpha2[numericId];
                  const data = alpha2 ? trendsData[alpha2] : null;
                  const fillColor = data ? colorScale(data.score) : '#1E2A3A';

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#0D1117"
                      strokeWidth={0.4}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.15s ease' },
                        hover: {
                          fill: data ? '#fff9e6' : '#2A3A4E',
                          outline: 'none',
                          cursor: data ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded" style={{ background: '#1E2A3A', border: '1px solid #2A3A4E' }} />
              <span className="text-xs" style={{ color: '#8B9BB4' }}>{t('worldmap.noData')}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-4 rounded-full w-64"
              style={{ background: 'linear-gradient(90deg, #f7fcf5, #addd8e, #f7a43c, #cc4c02)' }}
            />
            <div className="flex justify-between w-64">
              {legendStops.map(v => (
                <span key={v} className="text-xs" style={{ color: '#8B9BB4' }}>{v}</span>
              ))}
            </div>
            <span className="text-xs text-center" style={{ color: '#8B9BB4' }}>
              {t('worldmap.interestIndex')}
            </span>
          </div>
        </div>

        {/* Methodology note */}
        <p className="text-center text-xs mt-6" style={{ color: '#4A5A6E' }}>
          {t('worldmap.methodology')}
        </p>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="tooltip-enter absolute z-50 pointer-events-none rounded-xl border shadow-2xl p-4 min-w-56 max-w-72"
          style={{
            left: mousePos.x + 16,
            top: mousePos.y + 16,
            background: 'rgba(14, 18, 28, 0.97)',
            borderColor: 'rgba(212, 160, 23, 0.4)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,160,23,0.1)',
          }}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
            <span className="font-semibold text-sm" style={{ color: '#F5EDD6', fontFamily: "'Playfair Display', serif" }}>
              {countryName(tooltip.alpha2)}
            </span>
            <span className="text-xs" style={{ color: '#8B9BB4' }}>{tooltip.alpha2}</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{getScoreEmoji(tooltip.score)}</span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold" style={{ color: '#D4A017' }}>{tooltip.score}</span>
                <span className="text-xs" style={{ color: '#8B9BB4' }}>/100</span>
              </div>
              <div
                className="h-1.5 rounded-full mt-1"
                style={{ background: 'rgba(255,255,255,0.1)', width: 80 }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${tooltip.score}%`, background: colorScale(tooltip.score) }}
                />
              </div>
            </div>
          </div>

          {tooltip.searchTerm && tooltip.searchTerm !== 'The Chosen' && (
            <div className="mb-2 text-xs" style={{ color: '#8B9BB4' }}>
              {t('worldmap.searchedAs')} <span style={{ color: '#F5EDD6', fontStyle: 'italic' }}>"{tooltip.searchTerm}"</span>
            </div>
          )}

          {tooltip.platforms.length > 0 && (
            <div>
              <p className="text-xs mb-2" style={{ color: '#8B9BB4' }}>{t('worldmap.availableOn')}</p>
              <div className="flex flex-wrap gap-1">
                {tooltip.platforms.map(p => (
                  <span
                    key={p}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: PLATFORM_COLORS[p] ? `${PLATFORM_COLORS[p]}22` : 'rgba(255,255,255,0.08)',
                      color: PLATFORM_COLORS[p] || '#F5EDD6',
                      border: `1px solid ${PLATFORM_COLORS[p] ? `${PLATFORM_COLORS[p]}55` : 'rgba(255,255,255,0.15)'}`,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
