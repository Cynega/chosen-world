#!/usr/bin/env node
/**
 * scripts/fetch-platforms.mjs
 *
 * Obtiene disponibilidad real de "The Chosen" en plataformas de streaming
 * consultando la API GraphQL no oficial de JustWatch.
 *
 * Uso:
 *   node scripts/fetch-platforms.mjs
 *
 * Advertencia: JustWatch no tiene API pública oficial. Esta API es interna
 * y puede cambiar sin aviso. Si el script falla, los datos existentes se conservan.
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GRAPHQL_URL = 'https://apis.justwatch.com/graphql';
const OUT_PATH = join(__dirname, '../src/data/platforms.js');

// ─── Países a consultar ──────────────────────────────────────────────────────

const COUNTRIES = [
  { iso: 'US', label: 'Estados Unidos',   flag: '🇺🇸', lang: 'en' },
  { iso: 'AR', label: 'Argentina',         flag: '🇦🇷', lang: 'es' },
  { iso: 'BR', label: 'Brasil',            flag: '🇧🇷', lang: 'pt' },
  { iso: 'MX', label: 'México',            flag: '🇲🇽', lang: 'es' },
  { iso: 'CO', label: 'Colombia',          flag: '🇨🇴', lang: 'es' },
  { iso: 'PE', label: 'Perú',              flag: '🇵🇪', lang: 'es' },
  { iso: 'CL', label: 'Chile',             flag: '🇨🇱', lang: 'es' },
  { iso: 'GB', label: 'Reino Unido',       flag: '🇬🇧', lang: 'en' },
  { iso: 'AU', label: 'Australia',         flag: '🇦🇺', lang: 'en' },
  { iso: 'CA', label: 'Canadá',            flag: '🇨🇦', lang: 'en' },
  { iso: 'DE', label: 'Alemania',          flag: '🇩🇪', lang: 'de' },
  { iso: 'FR', label: 'Francia',           flag: '🇫🇷', lang: 'fr' },
  { iso: 'ES', label: 'España',            flag: '🇪🇸', lang: 'es' },
  { iso: 'IT', label: 'Italia',            flag: '🇮🇹', lang: 'it' },
  { iso: 'PL', label: 'Polonia',           flag: '🇵🇱', lang: 'pl' },
  { iso: 'PT', label: 'Portugal',          flag: '🇵🇹', lang: 'pt' },
  { iso: 'PH', label: 'Filipinas',         flag: '🇵🇭', lang: 'en' },
  { iso: 'KR', label: 'Corea del Sur',     flag: '🇰🇷', lang: 'ko' },
  { iso: 'IN', label: 'India',             flag: '🇮🇳', lang: 'en' },
  { iso: 'ID', label: 'Indonesia',         flag: '🇮🇩', lang: 'id' },
  { iso: 'MY', label: 'Malasia',           flag: '🇲🇾', lang: 'en' },
  { iso: 'SG', label: 'Singapur',          flag: '🇸🇬', lang: 'en' },
  { iso: 'NZ', label: 'Nueva Zelanda',     flag: '🇳🇿', lang: 'en' },
  { iso: 'ZA', label: 'Sudáfrica',         flag: '🇿🇦', lang: 'en' },
  { iso: 'NG', label: 'Nigeria',           flag: '🇳🇬', lang: 'en' },
  { iso: 'KE', label: 'Kenia',             flag: '🇰🇪', lang: 'en' },
  { iso: 'ET', label: 'Etiopía',           flag: '🇪🇹', lang: 'en' },
  { iso: 'GH', label: 'Ghana',             flag: '🇬🇭', lang: 'en' },
  { iso: 'UG', label: 'Uganda',            flag: '🇺🇬', lang: 'en' },
  { iso: 'IL', label: 'Israel',            flag: '🇮🇱', lang: 'he' },
  // Asia Oriental
  { iso: 'JP', label: 'Japón',             flag: '🇯🇵', lang: 'ja' },
  { iso: 'CN', label: 'China',             flag: '🇨🇳', lang: 'zh' },
  { iso: 'TW', label: 'Taiwán',            flag: '🇹🇼', lang: 'zh' },
  // Europa del Este y Rusia
  { iso: 'RU', label: 'Rusia',             flag: '🇷🇺', lang: 'ru' },
  { iso: 'UA', label: 'Ucrania',           flag: '🇺🇦', lang: 'uk' },
  { iso: 'RO', label: 'Rumania',           flag: '🇷🇴', lang: 'ro' },
  { iso: 'HU', label: 'Hungría',           flag: '🇭🇺', lang: 'hu' },
  { iso: 'CZ', label: 'Rep. Checa',        flag: '🇨🇿', lang: 'cs' },
  { iso: 'RS', label: 'Serbia',            flag: '🇷🇸', lang: 'sr' },
  // Turquía
  { iso: 'TR', label: 'Turquía',           flag: '🇹🇷', lang: 'tr' },
  // Árabe
  { iso: 'EG', label: 'Egipto',            flag: '🇪🇬', lang: 'ar' },
  { iso: 'SA', label: 'Arabia Saudita',    flag: '🇸🇦', lang: 'ar' },
  { iso: 'AE', label: 'Emiratos Árabes',   flag: '🇦🇪', lang: 'ar' },
  { iso: 'JO', label: 'Jordania',          flag: '🇯🇴', lang: 'ar' },
  { iso: 'MA', label: 'Marruecos',         flag: '🇲🇦', lang: 'ar' },
  { iso: 'LB', label: 'Líbano',            flag: '🇱🇧', lang: 'ar' },
];

// Estructura de regiones (se preserva en el archivo generado)
const REGION_GROUPS = [
  { region: 'Américas',               icon: '🌎', countries: ['US','CA','MX','BR','AR','CO','PE','CL'] },
  { region: 'Europa Occidental',      icon: '🌍', countries: ['GB','DE','FR','ES','IT','PL','PT'] },
  { region: 'Europa del Este',        icon: '🌍', countries: ['RU','UA','RO','HU','CZ','RS'] },
  { region: 'Asia-Pacífico',          icon: '🌏', countries: ['AU','NZ','PH','IN','ID','KR','MY','SG','JP','CN','TW'] },
  { region: 'Oriente Medio',          icon: '🕌', countries: ['IL','EG','SA','AE','JO','MA','LB','TR'] },
  { region: 'África',                 icon: '🌍', countries: ['NG','KE','ZA','ET','GH','UG'] },
];

// ─── Mapeo de nombres técnicos de JustWatch → nombres de display ─────────────
// Fuente: https://apis.justwatch.com/content/providers/locale/en_US
const PACKAGE_MAP = {
  nfx:  'Netflix',
  prv:  'Amazon Prime Video',
  atp:  'Amazon Prime Video',
  amp:  'Amazon Prime Video',
  pck:  'Peacock',
  byu:  'BYUtv',
  vix:  'ViX+',
  vxp:  'ViX+',
  hbo:  'Max',
  hbm:  'Max',
  dnp:  'Disney+',
  apl:  'Apple TV+',
  mbi:  'Mubi',
  par:  'Paramount+',
  sky:  'Sky',
  now:  'NOW',
  hot:  'HOT',
  aha:  'Aha',
  sho:  'Showtime',
  fue:  'Fubo TV',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function gql(query, variables) {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; chosen-world-fetch/1.0)',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${await res.text().catch(() => '')}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join('; '));
  }
  return json.data;
}

// ─── Paso 1: encontrar el node ID de "The Chosen" ────────────────────────────

async function findNodeId() {
  const data = await gql(`
    query SearchForChosen(
      $country: Country!
      $language: Language!
      $first: Int!
      $filter: TitleFilter!
    ) {
      popularTitles(
        country: $country
        first: $first
        filter: $filter
      ) {
        edges {
          node {
            id
            objectType
            objectId
            ... on Show {
              content(country: $country, language: $language) {
                title
                originalReleaseYear
              }
            }
          }
        }
      }
    }
  `, {
    country: 'US',
    language: 'en',
    first: 15,
    filter: { searchQuery: 'The Chosen' },
  });

  const edges = data?.popularTitles?.edges ?? [];

  // Buscamos un Show con "chosen" en el título lanzado en 2017+
  const match = edges.find(e => {
    const n = e.node;
    if (n.objectType !== 'SHOW') return false;
    const title = n.content?.title?.toLowerCase() ?? '';
    const year  = n.content?.originalReleaseYear ?? 0;
    return title.includes('chosen') && year >= 2017;
  });

  if (!match) {
    // Mostrar lo que encontramos para ayudar a debuggear
    console.error('\n  Resultados recibidos de JustWatch:');
    edges.slice(0, 5).forEach(e => {
      const c = e.node?.content;
      console.error(`    • [${e.node.objectType}] ${c?.title} (${c?.originalReleaseYear}) — id: ${e.node.id}`);
    });
    throw new Error('No se encontró "The Chosen" en los resultados de búsqueda.');
  }

  return match.node.id;
}

// ─── Paso 2: obtener ofertas por país ─────────────────────────────────────────

async function getOffers(nodeId, countryIso, lang) {
  const data = await gql(`
    query GetChosenOffers(
      $nodeId: ID!
      $country: Country!
      $platform: Platform!
    ) {
      node(id: $nodeId) {
        ... on Show {
          offerCount(country: $country, platform: $platform)
          offers(country: $country, platform: $platform) {
            monetizationType
            package {
              packageId
              clearName
              shortName
              technicalName
            }
          }
        }
      }
    }
  `, {
    nodeId,
    country: countryIso,
    platform: 'WEB',
  });

  return data?.node?.offers ?? [];
}

function normalizePlatformName(pkg) {
  // packageId es numérico en la API de JustWatch — solo usamos technicalName como clave
  const key = pkg.technicalName?.toLowerCase();
  const name = PACKAGE_MAP[key] || pkg.clearName || pkg.shortName || pkg.technicalName || null;
  if (!name) return null;
  // Colapsar tiers con publicidad al nombre base (ej: "Netflix Standard with Ads" → "Netflix")
  return name
    .replace(/\s+Standard with Ads$/i, '')
    .replace(/\s+with Ads$/i, '')
    .replace(/\s+Basic$/i, '')
    .trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' fetch-platforms.mjs — JustWatch → platforms.js  ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 1. Encontrar node ID
  let nodeId;
  console.log('🔍 Buscando "The Chosen" en JustWatch...');
  try {
    nodeId = await findNodeId();
    console.log(`✅ Node ID: ${nodeId}\n`);
  } catch (err) {
    console.error(`\n❌ Error buscando el show: ${err.message}`);
    console.error('   Los datos existentes no fueron modificados.\n');
    process.exit(1);
  }

  // 2. Consultar disponibilidad por país
  console.log('📡 Consultando disponibilidad por país...\n');
  const results = [];
  let errors = 0;
  let firstCountry = true;

  for (const country of COUNTRIES) {
    try {
      await sleep(350); // rate limiting educado
      const offers = await getOffers(nodeId, country.iso, country.lang);

      // Log de diagnóstico en el primer país para ver qué devuelve la API
      if (firstCountry && offers.length > 0) {
        firstCountry = false;
        console.log('  📦 Paquetes recibidos (muestra del primer país):');
        offers.slice(0, 5).forEach(o => {
          const p = o.package;
          console.log(`     technicalName="${p.technicalName}" clearName="${p.clearName}" packageId=${p.packageId} type=${o.monetizationType}`);
        });
        console.log('');
      } else {
        firstCountry = false;
      }

      // Solo incluir servicios de suscripción plana (excluir alquiler/compra)
      const FLATRATE_TYPES = new Set(['FLATRATE', 'FREE', 'ADS', 'FLATRATE_AND_BUY']);
      const platformNames = [
        ...new Set(
          offers
            .filter(o => FLATRATE_TYPES.has(o.monetizationType))
            .map(o => normalizePlatformName(o.package))
            .filter(Boolean)
        ),
      ];

      // The Chosen App siempre disponible globalmente (no aparece en JustWatch)
      if (!platformNames.includes('The Chosen App')) {
        platformNames.push('The Chosen App');
      }

      results.push({ iso: country.iso, country: country.label, flag: country.flag, platforms: platformNames });

      const streaming = platformNames.filter(p => p !== 'The Chosen App');
      const tag = streaming.length ? streaming.join(', ') : 'solo app propia';
      console.log(`  ${country.flag}  ${country.label.padEnd(22)} ${tag}`);

    } catch (err) {
      errors++;
      console.warn(`  ⚠️  ${country.flag}  ${country.label.padEnd(22)} Error: ${err.message}`);
      results.push({ iso: country.iso, country: country.label, flag: country.flag, platforms: ['The Chosen App'] });
    }
  }

  // 3. Escribir archivo
  const timestamp = new Date().toISOString();

  const output = `// AUTO-GENERADO por scripts/fetch-platforms.mjs
// Última actualización: ${timestamp}
// Fuente: API GraphQL de JustWatch (no oficial) + The Chosen App (siempre disponible globalmente)
// Solo incluye servicios de suscripción (FLATRATE). Alquiler y compra excluidos.
// Para actualizar: node scripts/fetch-platforms.mjs

export const lastUpdated = '${timestamp}';

export const platformsData = ${JSON.stringify(results, null, 2)};

export const regionGroups = ${JSON.stringify(REGION_GROUPS, null, 2)};
`;

  writeFileSync(OUT_PATH, output, 'utf-8');

  console.log(`\n${'─'.repeat(50)}`);
  if (errors > 0) {
    console.log(`⚠️  Completado con ${errors} error(es). Esos países usan fallback (solo app propia).`);
  } else {
    console.log(`✅ Todo OK — sin errores.`);
  }
  console.log(`📄 Guardado en: src/data/platforms.js`);
  console.log(`🕐 Timestamp:  ${timestamp}`);
  console.log(`\n   Reiniciá el servidor Vite para ver los cambios.`);
  console.log(`${'─'.repeat(50)}\n`);
}

main().catch(err => {
  console.error('\nError fatal:', err.message);
  process.exit(1);
});
