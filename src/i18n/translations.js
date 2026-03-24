export const translations = {
  en: {
    nav: {
      inicio: 'Home',
      mapa: 'Map',
      plataformas: 'Platforms',
      demografia: 'Demographics',
      fuentes: 'Sources',
      verSerie: 'Watch series →',
    },
    hero: {
      subtitle: 'Who watches a series about Jesus — and from which faith tradition?',
      description:
        'According to Angel Studios, The Chosen has reached more than 175 countries with a story many may not have expected to follow. Let\'s explore two questions: Where is it watched? And in those places, what religious tradition predominates?',
      stats: [
        { value: '200M+', label: 'Global views' },
        { value: '175+', label: 'Countries reached', note: 'Official Angel Studios figure' },
        { value: '5',    label: 'Seasons',           note: 'S6 (final) coming soon' },
        { value: '125',  label: 'Languages',         note: '🏆 Guinness Record · Feb. 2026' },
      ],
      navLinks: [
        { href: '#worldmap',  label: 'Global Map' },
        { href: '#platforms', label: 'Platforms' },
        { href: '#religion',  label: 'Religious Profile' },
        { href: '#sources',   label: 'Sources' },
      ],
      disclaimerLabel: 'Sources:',
      disclaimerText:
        'Interest by country via Google Trends (relative index, not certified audience) · Platforms via JustWatch API (real-time) · Religious demographics via Pew Research Center (2020)',
    },
    worldmap: {
      eyebrow: 'Search Analysis',
      title: 'Relative interest by country',
      description: 'Global distribution of interest in The Chosen based on Google search volume.',
      noData: 'No data',
      interestIndex: 'Interest index (0–100)',
      methodology:
        'Index based on Google Trends. 100 = maximum relative interest in the analyzed period. Does not reflect absolute audience but relative search popularity.',
      searchedAs: 'searched as',
      availableOn: 'Available on:',
    },
    platforms: {
      eyebrow: 'Platform Distribution',
      title: 'Where to watch The Chosen?',
      description: 'Reference availability by region. Streaming contracts change frequently.',
      updatedOn: 'JustWatch data — updated on',
      noData: '⚠️ Reference data — run node scripts/fetch-platforms.mjs to update from JustWatch',
      watchOnJustWatch: 'Watch on JustWatch →',
      allRegions: 'All regions',
      countries: 'countries',
      interest: 'Interest:',
      totalCount: 'countries analyzed on this page · JustWatch data updated on',
      regionNames: {
        'Américas':          'Americas',
        'Europa Occidental': 'Western Europe',
        'Europa del Este':   'Eastern Europe',
        'Asia-Pacífico':     'Asia-Pacific',
        'Oriente Medio':     'Middle East',
        'África':            'Africa',
      },
    },
    religion: {
      eyebrow: 'Demographic Profile',
      title: 'Religious profile in countries where it streams',
      description:
        'Religious composition of the 15 countries with the highest interest index in The Chosen, sorted by Google Trends score.',
      labels: {
        christian:    'Christian',
        muslim:       'Muslim',
        hindu:        'Hindu',
        buddhist:     'Buddhist',
        jewish:       'Jewish',
        unaffiliated: 'Unaffiliated',
        other:        'Other',
      },
      trendsInterest: 'Google Trends interest:',
      note1:
        'Source: Pew Research Center, Global Religious Futures Project (2020). Demographic projection data. Percentages may not add up exactly to 100% due to rounding.',
      note2:
        'Colors do not represent value judgments — only standard demographic categories used in international sociological research.',
    },
    sources: {
      eyebrow: 'Data Transparency',
      title: 'Data sources',
      description:
        'This analysis was built on verifiable public sources. Below we detail the methodology, limitations, and origin of each dataset used.',
      disclaimer:
        'This project is a journalistic analysis of public data for informational and educational purposes. It is not affiliated with or sponsored by Angel Studios, The Chosen, Netflix, Amazon, or any of the platforms mentioned. Google Trends data represents relative search interest, not certified audience.',
      disclaimerLabel: 'Disclaimer:',
      officialNoteLabel: 'Note on official figures:',
      officialNote:
        'The creators of The Chosen claim the series has been watched in more than 175 countries, though they did not publish a complete official list of those countries. They also reported that the series was recognized by Guinness World Records for its language reach, with one season available in 125 languages as of February 20, 2026. Therefore, the geographic cross-references and estimates on this page rely on external sources and do not represent an official breakdown from the series.',
      referenceData: 'Reference data — verify sources for updated info',
      builtBy: 'Built by',
      builtWith: 'with React + Vite + Tailwind CSS, through Claude Code',
      cards: [
        {
          title: 'Google Trends — Relative Interest Index',
          description:
            'Country interest data is obtained from Google Trends for the term "The Chosen" (TV series). The index ranges from 0 to 100, where 100 represents maximum relative interest in the analyzed period and geography. This index does not reflect absolute audience volume but relative search popularity.',
          note: 'Data is not absolute and does not represent real audience.',
          urlLabel: 'trends.google.com',
        },
        {
          title: 'Pew Research Center — Global Religious Futures (2020)',
          description:
            'Religious composition statistics by country come from the "Global Religious Futures" project of the Pew Research Center. The data are demographic projections based on censuses and representative surveys. Reference year: 2020. Percentages have been rounded to the nearest integer.',
          note: 'Demographic projections — not audience surveys.',
          urlLabel: 'pewresearch.org',
        },
        {
          title: 'JustWatch — Streaming Platforms',
          description:
            'Availability obtained in real time from the JustWatch API, the most comprehensive streaming aggregator in the world. Only subscription services are shown (rental and purchase are excluded).',
          note: 'Source: JustWatch API — automatically updated.',
          urlLabel: 'Watch on JustWatch →',
        },
        {
          title: 'Angel Studios / The Chosen — Official Audience Figure',
          description:
            'The "200 million global views" figure is an official statement from Angel Studios and The Chosen production team. This metric includes views through the official The Chosen app, associated streaming platforms, and theatrical screenings. The exact counting methodology has not been independently audited.',
          note: 'Official production figure, not independently audited.',
          urlLabel: 'thechosen.tv',
        },
      ],
    },
  },

  es: {
    nav: {
      inicio: 'Inicio',
      mapa: 'Mapa',
      plataformas: 'Plataformas',
      demografia: 'Demografía',
      fuentes: 'Fuentes',
      verSerie: 'Ver serie →',
    },
    hero: {
      subtitle: '¿Quién mira una serie sobre Jesús... y desde qué fe?',
      description:
        'Según Angel Studios, The Chosen llegó a más de 175 países con una historia que muchos tal vez no esperaban seguir. Exploremos dos preguntas: ¿Dónde se mira? Y en esos lugares, ¿qué tradición religiosa predomina?',
      stats: [
        { value: '200M+', label: 'Vistas globales' },
        { value: '175+', label: 'Países alcanzados', note: 'Cifra oficial Angel Studios' },
        { value: '5',    label: 'Temporadas',        note: 'T6 (final) próximamente' },
        { value: '125',  label: 'Idiomas',           note: '🏆 Récord Guinness · feb. 2026' },
      ],
      navLinks: [
        { href: '#worldmap',  label: 'Mapa Global' },
        { href: '#platforms', label: 'Plataformas' },
        { href: '#religion',  label: 'Perfil Religioso' },
        { href: '#sources',   label: 'Fuentes' },
      ],
      disclaimerLabel: 'Fuentes:',
      disclaimerText:
        'Interés por país vía Google Trends (índice relativo, no audiencia certificada) · Plataformas vía JustWatch API (tiempo real) · Demografía religiosa vía Pew Research Center (2020)',
    },
    worldmap: {
      eyebrow: 'Análisis de Búsquedas',
      title: 'Interés relativo por país',
      description: 'Distribución global del interés en The Chosen según volumen de búsquedas en Google.',
      noData: 'Sin datos',
      interestIndex: 'Índice de interés (0–100)',
      methodology:
        'Índice basado en Google Trends. 100 = máximo interés relativo en el período analizado. No refleja audiencia absoluta sino popularidad relativa de búsquedas.',
      searchedAs: 'buscado como',
      availableOn: 'Disponible en:',
    },
    platforms: {
      eyebrow: 'Distribución de Plataformas',
      title: '¿Dónde ver The Chosen?',
      description: 'Disponibilidad referencial por región. Los contratos de streaming cambian frecuentemente.',
      updatedOn: 'Datos de JustWatch — actualizado el',
      noData: '⚠️ Datos referenciales — ejecutá node scripts/fetch-platforms.mjs para actualizar desde JustWatch',
      watchOnJustWatch: 'Ver en JustWatch →',
      allRegions: 'Todas las regiones',
      countries: 'países',
      interest: 'Interés:',
      totalCount: 'países analizados en esta landing · Datos de JustWatch actualizados el',
      regionNames: {
        'Américas':          'Américas',
        'Europa Occidental': 'Europa Occidental',
        'Europa del Este':   'Europa del Este',
        'Asia-Pacífico':     'Asia-Pacífico',
        'Oriente Medio':     'Oriente Medio',
        'África':            'África',
      },
    },
    religion: {
      eyebrow: 'Perfil Demográfico',
      title: 'Perfil religioso en países donde se transmite',
      description:
        'Composición religiosa de los 15 países con mayor índice de interés en The Chosen, ordenados por puntuación de Google Trends.',
      labels: {
        christian:    'Cristiano',
        muslim:       'Musulmán',
        hindu:        'Hindú',
        buddhist:     'Budista',
        jewish:       'Judío',
        unaffiliated: 'Sin afiliación',
        other:        'Otro',
      },
      trendsInterest: 'Interés Google Trends:',
      note1:
        'Fuente: Pew Research Center, Global Religious Futures Project (2020). Datos de proyección demográfica. Los porcentajes pueden no sumar exactamente 100% por redondeo.',
      note2:
        'Los colores no representan juicios de valor — solo categorías demográficas estándar utilizadas en investigación sociológica internacional.',
    },
    sources: {
      eyebrow: 'Transparencia de Datos',
      title: 'Fuentes de datos',
      description:
        'Este análisis se construyó sobre fuentes públicas verificables. A continuación detallamos metodología, limitaciones y origen de cada conjunto de datos utilizado.',
      disclaimer:
        'Este proyecto es un análisis periodístico de datos públicos con fines informativos y educativos. No está afiliado ni patrocinado por Angel Studios, The Chosen, Netflix, Amazon, ni ninguna de las plataformas mencionadas. Los datos de Google Trends representan interés relativo de búsqueda, no audiencia certificada.',
      disclaimerLabel: 'Descargo de responsabilidad:',
      officialNoteLabel: 'Nota sobre cifras oficiales:',
      officialNote:
        'Los responsables de The Chosen afirman que la serie ha sido vista en más de 175 países, aunque no publicaron una lista completa y oficial de esos países. También informaron que la serie fue reconocida por Guinness World Records por su alcance idiomático, con una temporada disponible en 125 idiomas al 20 de febrero de 2026. Por eso, los cruces y estimaciones geográficas de esta página se apoyan en fuentes externas y no representan un desglose oficial de la serie.',
      referenceData: 'Datos referenciales — verificar fuentes para info actualizada',
      builtBy: 'Construido por',
      builtWith: 'con React + Vite + Tailwind CSS, Claude Code mediante',
      cards: [
        {
          title: 'Google Trends — Índice de Interés Relativo',
          description:
            'Los datos de interés por país se obtienen de Google Trends para el término "The Chosen" (serie de TV). El índice va de 0 a 100, donde 100 representa el máximo interés relativo en el período y geografía analizada. Este índice no refleja volumen absoluto de audiencia sino popularidad relativa de búsquedas.',
          note: 'Los datos no son absolutos ni representan audiencia real.',
          urlLabel: 'trends.google.com',
        },
        {
          title: 'Pew Research Center — Global Religious Futures (2020)',
          description:
            'Las estadísticas de composición religiosa por país provienen del proyecto "Global Religious Futures" de Pew Research Center. Los datos son proyecciones demográficas basadas en censos y encuestas representativas. Año de referencia: 2020. Los porcentajes han sido redondeados al número entero más cercano.',
          note: 'Proyecciones demográficas — no encuestas de audiencia.',
          urlLabel: 'pewresearch.org',
        },
        {
          title: 'JustWatch — Plataformas de Streaming',
          description:
            'Disponibilidad obtenida en tiempo real desde la API de JustWatch, el agregador de streaming más completo del mundo. Solo se muestran servicios de suscripción (se excluyen alquiler y compra).',
          note: 'Fuente: JustWatch API — actualizado automáticamente.',
          urlLabel: 'Ver en JustWatch →',
        },
        {
          title: 'Angel Studios / The Chosen — Cifra Oficial de Audiencia',
          description:
            'La cifra de "200 millones de vistas globales" es una declaración oficial de Angel Studios y el equipo de producción de The Chosen. Esta métrica incluye visualizaciones a través de la app oficial The Chosen, plataformas de streaming asociadas y transmisiones en cines. La metodología exacta de conteo no ha sido auditada de forma independiente.',
          note: 'Cifra oficial de producción, no auditada de forma independiente.',
          urlLabel: 'thechosen.tv',
        },
      ],
    },
  },
};
