#!/usr/bin/env node
/**
 * scripts/fetch-trends.mjs
 *
 * Obtiene el índice de interés relativo de "The Chosen" por país
 * desde Google Trends, usando el título localizado correcto para cada idioma.
 *
 * Estrategia:
 *   1. Query global con "The Chosen" (inglés) → cubre todos los países
 *   2. Queries adicionales con títulos localizados por grupo de idioma
 *   3. Para cada país, toma el score más alto entre todas las queries
 *   4. Normaliza el resultado final a escala 0–100
 *
 * Uso: node scripts/fetch-trends.mjs
 */

import googleTrends from 'google-trends-api';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, '../src/data/trends.js');

// ─── Mapeo de países ──────────────────────────────────────────────────────────
// Títulos localizados según investigación:
// - Inglés:             The Chosen
// - Español:            Los elegidos
// - Portugués (BR):     Os Escolhidos
// - Coreano:            더 초즌
// - Japonés:            選ばれし者
// - Chino simpl.:       天选之子
// - Chino trad. (TW):   天選之子
// - Ruso:               Избранные
// - Árabe:              المختار
// - Turco:              Seçilmişler

const COUNTRIES = [
  // Inglés
  { iso: 'US', label: 'Estados Unidos',   flag: '🇺🇸', term: 'The Chosen', lang: 'en-US' },
  { iso: 'PH', label: 'Filipinas',         flag: '🇵🇭', term: 'The Chosen', lang: 'en-PH' },
  { iso: 'AU', label: 'Australia',         flag: '🇦🇺', term: 'The Chosen', lang: 'en-AU' },
  { iso: 'CA', label: 'Canadá',            flag: '🇨🇦', term: 'The Chosen', lang: 'en-CA' },
  { iso: 'GB', label: 'Reino Unido',       flag: '🇬🇧', term: 'The Chosen', lang: 'en-GB' },
  { iso: 'NZ', label: 'Nueva Zelanda',     flag: '🇳🇿', term: 'The Chosen', lang: 'en-NZ' },
  { iso: 'IN', label: 'India',             flag: '🇮🇳', term: 'The Chosen', lang: 'en-IN' },
  { iso: 'SG', label: 'Singapur',          flag: '🇸🇬', term: 'The Chosen', lang: 'en-SG' },
  { iso: 'MY', label: 'Malasia',           flag: '🇲🇾', term: 'The Chosen', lang: 'en-MY' },
  { iso: 'ID', label: 'Indonesia',         flag: '🇮🇩', term: 'The Chosen', lang: 'id-ID' },
  { iso: 'ZA', label: 'Sudáfrica',         flag: '🇿🇦', term: 'The Chosen', lang: 'en-ZA' },
  { iso: 'NG', label: 'Nigeria',           flag: '🇳🇬', term: 'The Chosen', lang: 'en-NG' },
  { iso: 'KE', label: 'Kenia',             flag: '🇰🇪', term: 'The Chosen', lang: 'en-KE' },
  { iso: 'ET', label: 'Etiopía',           flag: '🇪🇹', term: 'The Chosen', lang: 'en-ET' },
  { iso: 'GH', label: 'Ghana',             flag: '🇬🇭', term: 'The Chosen', lang: 'en-GH' },
  { iso: 'UG', label: 'Uganda',            flag: '🇺🇬', term: 'The Chosen', lang: 'en-UG' },
  { iso: 'IL', label: 'Israel',            flag: '🇮🇱', term: 'The Chosen', lang: 'en-IL' },
  { iso: 'DE', label: 'Alemania',          flag: '🇩🇪', term: 'The Chosen', lang: 'de-DE' },
  { iso: 'FR', label: 'Francia',           flag: '🇫🇷', term: 'The Chosen', lang: 'fr-FR' },
  { iso: 'IT', label: 'Italia',            flag: '🇮🇹', term: 'The Chosen', lang: 'it-IT' },
  { iso: 'PL', label: 'Polonia',           flag: '🇵🇱', term: 'The Chosen', lang: 'pl-PL' },
  { iso: 'PT', label: 'Portugal',          flag: '🇵🇹', term: 'The Chosen', lang: 'pt-PT' },
  // Español (título localizado: "Los elegidos")
  { iso: 'AR', label: 'Argentina',         flag: '🇦🇷', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-419' },
  { iso: 'MX', label: 'México',            flag: '🇲🇽', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-419' },
  { iso: 'CO', label: 'Colombia',          flag: '🇨🇴', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-419' },
  { iso: 'PE', label: 'Perú',              flag: '🇵🇪', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-419' },
  { iso: 'CL', label: 'Chile',             flag: '🇨🇱', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-419' },
  { iso: 'ES', label: 'España',            flag: '🇪🇸', term: 'Los elegidos',  altTerm: 'The Chosen', lang: 'es-ES' },
  // Portugués Brasil
  { iso: 'BR', label: 'Brasil',            flag: '🇧🇷', term: 'Os Escolhidos', altTerm: 'The Chosen', lang: 'pt-BR' },
  // Coreano
  { iso: 'KR', label: 'Corea del Sur',     flag: '🇰🇷', term: '더 초즌',        altTerm: 'The Chosen', lang: 'ko-KR' },
  // Japonés
  { iso: 'JP', label: 'Japón',             flag: '🇯🇵', term: '選ばれし者',     altTerm: 'The Chosen', lang: 'ja-JP' },
  // Chino simplificado (mainland — puede devolver 0 por bloqueo de Google)
  { iso: 'CN', label: 'China',             flag: '🇨🇳', term: '天选之子',       altTerm: 'The Chosen', lang: 'zh-CN' },
  // Chino tradicional (Taiwán)
  { iso: 'TW', label: 'Taiwán',            flag: '🇹🇼', term: '天選之子',       altTerm: 'The Chosen', lang: 'zh-TW' },
  // Ruso
  { iso: 'RU', label: 'Rusia',             flag: '🇷🇺', term: 'Избранные',     altTerm: 'The Chosen', lang: 'ru-RU' },
  { iso: 'UA', label: 'Ucrania',           flag: '🇺🇦', term: 'Избранные',     altTerm: 'The Chosen', lang: 'uk-UA' },
  { iso: 'RO', label: 'Rumania',           flag: '🇷🇴', term: 'The Chosen',    lang: 'ro-RO' },
  { iso: 'HU', label: 'Hungría',           flag: '🇭🇺', term: 'The Chosen',    lang: 'hu-HU' },
  { iso: 'CZ', label: 'Rep. Checa',        flag: '🇨🇿', term: 'The Chosen',    lang: 'cs-CZ' },
  { iso: 'RS', label: 'Serbia',            flag: '🇷🇸', term: 'The Chosen',    lang: 'sr-RS' },
  // Turco
  { iso: 'TR', label: 'Turquía',           flag: '🇹🇷', term: 'Seçilmişler',   altTerm: 'The Chosen', lang: 'tr-TR' },
  // Árabe
  { iso: 'EG', label: 'Egipto',            flag: '🇪🇬', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-EG' },
  { iso: 'SA', label: 'Arabia Saudita',    flag: '🇸🇦', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-SA' },
  { iso: 'AE', label: 'Emiratos Árabes',   flag: '🇦🇪', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-AE' },
  { iso: 'JO', label: 'Jordania',          flag: '🇯🇴', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-JO' },
  { iso: 'MA', label: 'Marruecos',         flag: '🇲🇦', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-MA' },
  { iso: 'LB', label: 'Líbano',            flag: '🇱🇧', term: 'المختار',       altTerm: 'The Chosen', lang: 'ar-LB' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Consulta Google Trends para un keyword en un país específico
// Devuelve el valor promedio de interés en los últimos 12 meses (0–100)
async function getTrendScore(keyword, geo) {
  try {
    const result = await googleTrends.interestOverTime({
      keyword,
      geo,
      startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // último año
      granularTimeResolution: false,
    });

    const parsed = JSON.parse(result);
    const timeline = parsed?.default?.timelineData ?? [];
    if (!timeline.length) return 0;

    // Promedio de los valores del último año
    const values = timeline.map(t => t.value?.[0] ?? 0).filter(v => v > 0);
    if (!values.length) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  } catch {
    return 0;
  }
}

function normalize(scores) {
  const max = Math.max(...Object.values(scores), 1);
  const result = {};
  for (const [iso, score] of Object.entries(scores)) {
    result[iso] = Math.round((score / max) * 100);
  }
  return result;
}

// ─── Cargar datos existentes desde trends.js ─────────────────────────────────
// Extrae rawScores y usedTerms del archivo generado previamente,
// para preservar datos buenos cuando Google Trends bloquea temporalmente.

function loadExistingData() {
  const existing = { rawScores: {}, usedTerms: {} };
  if (!existsSync(OUT_PATH)) return existing;
  try {
    const content = readFileSync(OUT_PATH, 'utf-8');
    const match = content.match(/export const trendsData = (\{[\s\S]*?\});/);
    if (!match) return existing;
    const parsed = JSON.parse(match[1]);
    for (const [iso, data] of Object.entries(parsed)) {
      // Revertimos la normalización: guardamos el score ya normalizado como raw
      // (es una aproximación válida para merge — lo que importa es que no sea 0)
      existing.rawScores[iso] = data.score ?? 0;
      existing.usedTerms[iso] = data.searchTerm ?? 'The Chosen';
    }
  } catch { /* si falla, ignoramos y arrancamos de cero */ }
  return existing;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' fetch-trends.mjs — Google Trends → trends.js   ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Cargar datos previos como base
  const { rawScores, usedTerms } = loadExistingData();
  const preserved = Object.keys(rawScores).filter(k => rawScores[k] > 0).length;
  if (preserved > 0) {
    console.log(`📂 Datos previos cargados: ${preserved} países con score > 0 (se preservan si Google bloquea)\n`);
  }

  console.log('Consultando Google Trends por país (puede tardar ~5 min)...\n');

  let updated = 0;
  let blocked = 0;

  for (const country of COUNTRIES) {
    await sleep(2500); // más tiempo entre requests para reducir rate limiting

    // Score con el término principal (localizado)
    const primaryScore = await getTrendScore(country.term, country.iso);

    // Si tiene título alternativo, también lo consultamos
    let altScore = 0;
    if (country.altTerm) {
      await sleep(2500);
      altScore = await getTrendScore(country.altTerm, country.iso);
    }

    const freshScore = Math.max(primaryScore, altScore);
    const freshTerm = freshScore === altScore && altScore > primaryScore
      ? country.altTerm
      : country.term;

    if (freshScore > 0) {
      // Tenemos dato fresco — lo usamos
      rawScores[country.iso] = freshScore;
      usedTerms[country.iso] = freshTerm;
      updated++;
      const bar = '█'.repeat(Math.round(freshScore / 10));
      const termNote = freshTerm !== 'The Chosen' ? ` (vía "${freshTerm}")` : '';
      console.log(`  ${country.flag}  ${country.label.padEnd(22)} ${String(freshScore).padStart(3)}  ${bar}${termNote}`);
    } else if (rawScores[country.iso] > 0) {
      // Google bloqueó esta consulta pero tenemos dato previo — lo preservamos
      blocked++;
      const bar = '█'.repeat(Math.round(rawScores[country.iso] / 10));
      console.log(`  ${country.flag}  ${country.label.padEnd(22)} ${String(rawScores[country.iso]).padStart(3)}  ${bar}  (preservado)`);
    } else {
      // Sin dato nuevo ni previo
      rawScores[country.iso] = 0;
      usedTerms[country.iso] = country.term;
      console.log(`  ⚠️  ${country.flag}  ${country.label.padEnd(22)} sin datos`);
    }
  }

  // Normalizar a 0–100 relativo al máximo global
  const normalized = normalize(rawScores);

  // Construir el objeto final con metadata
  const trendsData = {};
  for (const country of COUNTRIES) {
    trendsData[country.iso] = {
      score: normalized[country.iso] ?? 0,
      label: country.label,
      flag: country.flag,
      searchTerm: usedTerms[country.iso] ?? country.term,
    };
  }

  const timestamp = new Date().toISOString();
  const output = `// AUTO-GENERADO por scripts/fetch-trends.mjs
// Última actualización: ${timestamp}
// Fuente: Google Trends (API no oficial)
// Metodología: índice de interés relativo (0–100) promedio del último año.
//   Títulos localizados: "Los elegidos" (ES/LATAM), "Os Escolhidos" (BR),
//   "더 초즌" (KR), "選ばれし者" (JP), "天選之子" (TW), "天选之子" (CN),
//   "Избранные" (RU/UA), "المختار" (árabe), "Seçilmişler" (TR).
//   Score 100 = país con mayor interés relativo en el período consultado.
// Para actualizar: node scripts/fetch-trends.mjs

export const lastUpdated = '${timestamp}';

export const trendsData = ${JSON.stringify(trendsData, null, 2)};
`;

  writeFileSync(OUT_PATH, output, 'utf-8');

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✅ Actualizados: ${updated} | 📂 Preservados: ${blocked} | ⚠️  Sin datos: ${COUNTRIES.length - updated - blocked}`);
  if (COUNTRIES.length - updated - blocked > 0) {
    console.log(`   Los países sin datos quedan en 0 en el mapa.`);
  }
  console.log(`📄 Guardado en: src/data/trends.js`);
  console.log(`🕐 Timestamp:  ${timestamp}`);
  console.log(`\n   Reiniciá el servidor Vite para ver los cambios.`);
  console.log(`${'─'.repeat(50)}\n`);
}

main().catch(err => {
  console.error('\nError fatal:', err.message);
  process.exit(1);
});
