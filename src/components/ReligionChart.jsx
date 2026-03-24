import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { trendsData } from '../data/trends';
import { religionData } from '../data/religions';
import { platformsData } from '../data/platforms';
import { useLanguage } from '../contexts/LanguageContext';

const RELIGION_KEYS = [
  { key: 'christian',    color: '#3B82F6' },
  { key: 'muslim',       color: '#22C55E' },
  { key: 'hindu',        color: '#F97316' },
  { key: 'buddhist',     color: '#EAB308' },
  { key: 'jewish',       color: '#A855F7' },
  { key: 'unaffiliated', color: '#6B7280' },
  { key: 'other',        color: '#475569' },
];

// Flag lookup
const flagLookup = {};
platformsData.forEach(p => { flagLookup[p.iso] = p.flag; });

// Top 15 ISOs sorted by score (computed once)
const TOP_ISOS = Object.entries(trendsData)
  .filter(([iso]) => religionData[iso])
  .sort((a, b) => b[1].score - a[1].score)
  .slice(0, 15)
  .map(([iso]) => iso);

function CustomTooltip({ active, payload, label, religionLabels, trendsLabel }) {
  if (!active || !payload || !payload.length) return null;

  // Extract ISO from label (format: "flag name")
  // We find it from TOP_ISOS by matching the rendered label
  const entry = payload[0]?.payload;
  const score = entry?.score;

  return (
    <div
      className="rounded-xl border p-4 shadow-2xl"
      style={{
        background: 'rgba(14, 18, 28, 0.97)',
        borderColor: 'rgba(212, 160, 23, 0.35)',
        backdropFilter: 'blur(12px)',
        minWidth: 200,
      }}
    >
      <div className="mb-3 pb-2 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
        <p className="font-semibold text-sm" style={{ color: '#F5EDD6', fontFamily: "'Playfair Display', serif" }}>
          {label}
        </p>
        {score != null && (
          <p className="text-xs mt-0.5" style={{ color: '#D4A017' }}>
            {trendsLabel} {score}/100
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        {payload
          .filter(p => p.value > 0)
          .sort((a, b) => b.value - a.value)
          .map(p => (
            <div key={p.dataKey} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.fill }} />
                <span className="text-xs" style={{ color: '#8B9BB4' }}>
                  {religionLabels[p.dataKey] || p.dataKey}
                </span>
              </div>
              <span className="text-xs font-semibold" style={{ color: '#F5EDD6' }}>
                {p.value}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

function CustomLegend({ religionLabels }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mb-4">
      {RELIGION_KEYS.map(r => (
        <div key={r.key} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: r.color }} />
          <span className="text-xs" style={{ color: '#8B9BB4' }}>{religionLabels[r.key]}</span>
        </div>
      ))}
    </div>
  );
}

function CustomYAxisTick({ x, y, payload, maxLen = 18 }) {
  const text = payload.value.length > maxLen
    ? payload.value.slice(0, maxLen) + '…'
    : payload.value;
  return (
    <text
      x={x - 6}
      y={y}
      textAnchor="end"
      dominantBaseline="central"
      fill="#8B9BB4"
      fontSize={11}
      fontFamily="Inter, sans-serif"
    >
      {text}
    </text>
  );
}

export default function ReligionChart() {
  const [hoveredBar, setHoveredBar] = useState(null);
  const { t, countryName } = useLanguage();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const religionLabels = t('religion.labels');

  // Build chart data with language-aware country names
  const chartData = TOP_ISOS.map((iso) => {
    const trend = trendsData[iso];
    const rel = religionData[iso];
    const flag = flagLookup[iso] || '';
    return {
      iso,
      country: `${flag} ${countryName(iso)}`,
      score: trend.score,
      ...rel,
    };
  });

  return (
    <section
      id="religion"
      className="py-20 px-0 sm:px-4"
      style={{ background: 'linear-gradient(180deg, #0D1117 0%, #141B2D 60%, #0D1117 100%)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #D4A017)' }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#D4A017' }}>
              {t('religion.eyebrow')}
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, #D4A017, transparent)' }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5EDD6' }}
          >
            {t('religion.title')}
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: '#8B9BB4' }}>
            {t('religion.description')}
          </p>
        </div>

        {/* Legend */}
        <CustomLegend religionLabels={religionLabels} />

        {/* Chart */}
        <div
          className="rounded-none sm:rounded-2xl border-y sm:border p-2 sm:p-8"
          style={{
            background: 'rgba(14, 21, 35, 0.8)',
            borderColor: 'rgba(212, 160, 23, 0.12)',
            boxShadow: '0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          <ResponsiveContainer width="100%" height={580}>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 0, right: 8, left: isMobile ? 0 : 160, bottom: 0 }}
              barSize={18}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
                tick={{ fill: '#4A5A6E', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="country"
                width={isMobile ? 85 : 155}
                tick={<CustomYAxisTick maxLen={isMobile ? 12 : 18} />}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    religionLabels={religionLabels}
                    trendsLabel={t('religion.trendsInterest')}
                  />
                }
                cursor={{ fill: 'rgba(212, 160, 23, 0.04)' }}
              />
              {RELIGION_KEYS.map(r => (
                <Bar
                  key={r.key}
                  dataKey={r.key}
                  stackId="religion"
                  fill={r.color}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationBegin={100}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notes */}
        <div className="mt-6 space-y-3">
          <div
            className="flex items-start gap-3 p-4 rounded-lg border"
            style={{
              background: 'rgba(20, 27, 45, 0.5)',
              borderColor: 'rgba(139, 155, 180, 0.15)',
            }}
          >
            <span className="text-lg flex-shrink-0">📊</span>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7A8E' }}>
              {t('religion.note1')}
            </p>
          </div>
          <div
            className="flex items-start gap-3 p-4 rounded-lg border"
            style={{
              background: 'rgba(20, 27, 45, 0.5)',
              borderColor: 'rgba(139, 155, 180, 0.15)',
            }}
          >
            <span className="text-lg flex-shrink-0">🤝</span>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7A8E' }}>
              {t('religion.note2')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
