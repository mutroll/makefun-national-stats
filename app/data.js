// NusaStats data — every figure carries its source and year.
// Headline source: BPS — Statistics Indonesia (bps.go.id).
// Cross-checked 26 Nov 2026 against BPS press releases, World Bank WDI
// and UN Comtrade summaries. Figures are shown exactly as published;
// where two official series differ slightly (BPS vs UN/WB population),
// the BPS figure is used and the difference is noted on the Sources page.

export const META = {
  country: 'Indonesia',
  source: 'BPS — Statistics Indonesia',
  updated: '26 November 2026',
};

// Population, millions — BPS official estimates (mid-year).
// 2020 is the census count (270.2m). BPS 2024 estimate: 281.6m.
export const POPULATION_YEAR = [
  { year: 2019, value: 266.9 },
  { year: 2020, value: 270.2 },
  { year: 2021, value: 272.2 },
  { year: 2022, value: 275.8 },
  { year: 2023, value: 278.7 },
  { year: 2024, value: 281.6 },
];

// Age structure, 2024 — BPS / UN World Population Prospects 2024.
// Shares are rounded; they sum to 100%.
export const AGE_GROUPS = [
  { group: '0–14 years', share: 24.6 },
  { group: '15–24 years', share: 16.9 },
  { group: '25–54 years', share: 42.3 },
  { group: '55–64 years', share: 8.9 },
  { group: '65+ years', share: 7.3 },
];

// Provinces, mid-2024 population (millions) and density — BPS.
// 38 provinces in total; the 20 largest are listed here. Capitals are
// the provincial capitals. Densities are population ÷ BPS land area.
export const PROVINCES = [
  { name: 'West Java', capital: 'Bandung', island: 'Java', pop: 50.35, density: 1359 },
  { name: 'East Java', capital: 'Surabaya', island: 'Java', pop: 41.81, density: 875 },
  { name: 'Central Java', capital: 'Semarang', island: 'Java', pop: 37.89, density: 1104 },
  { name: 'North Sumatra', capital: 'Medan', island: 'Sumatra', pop: 15.59, density: 215 },
  { name: 'Banten', capital: 'Serang', island: 'Java', pop: 12.43, density: 1287 },
  { name: 'Jakarta', capital: 'Jakarta', island: 'Java', pop: 10.68, density: 16165 },
  { name: 'South Sulawesi', capital: 'Makassar', island: 'Sulawesi', pop: 9.46, density: 203 },
  { name: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatra', pop: 9.28, density: 268 },
  { name: 'South Sumatra', capital: 'Palembang', island: 'Sumatra', pop: 8.84, density: 96 },
  { name: 'West Sumatra', capital: 'Padang', island: 'Sumatra', pop: 5.84, density: 139 },
  { name: 'West Kalimantan', capital: 'Pontianak', island: 'Kalimantan', pop: 5.75, density: 39 },
  { name: 'Aceh', capital: 'Banda Aceh', island: 'Sumatra', pop: 5.55, density: 98 },
  { name: 'Riau', capital: 'Pekanbaru', island: 'Sumatra', pop: 6.73, density: 75 },
  { name: 'East Kalimantan', capital: 'Samarinda', island: 'Kalimantan', pop: 3.92, density: 31 },
  { name: 'Bali', capital: 'Denpasar', island: 'Bali', pop: 4.34, density: 753 },
  { name: 'South Kalimantan', capital: 'Banjarmasin', island: 'Kalimantan', pop: 4.29, density: 111 },
  { name: 'West Nusa Tenggara', capital: 'Mataram', island: 'Nusa Tenggara', pop: 5.60, density: 301 },
  { name: 'East Nusa Tenggara', capital: 'Kupang', island: 'Nusa Tenggara', pop: 5.66, density: 116 },
  { name: 'Central Sulawesi', capital: 'Palu', island: 'Sulawesi', pop: 3.10, density: 50 },
  { name: 'North Sulawesi', capital: 'Manado', island: 'Sulawesi', pop: 2.73, density: 197 },
];

// Real GDP growth, % year on year — BPS national accounts.
export const GDP_GROWTH = [
  { year: 2019, value: 5.02 },
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.70 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
];

// Trade in goods, US$ billion — BPS / UN Comtrade.
export const TRADE = [
  { year: 2019, exports: 167.7, imports: 170.7 },
  { year: 2020, exports: 163.2, imports: 141.6 },
  { year: 2021, exports: 231.6, imports: 196.2 },
  { year: 2022, exports: 291.9, imports: 237.4 },
  { year: 2023, exports: 258.8, imports: 221.9 },
  { year: 2024, exports: 264.7, imports: 233.7 },
];

// Consumer-price inflation, % year on year — BPS (December reading).
export const INFLATION = [
  { year: 2019, value: 2.72 },
  { year: 2020, value: 1.68 },
  { year: 2021, value: 1.87 },
  { year: 2022, value: 5.51 },
  { year: 2023, value: 2.61 },
  { year: 2024, value: 1.57 },
];

// Open unemployment rate, % — BPS Sakernas (August round).
export const UNEMPLOYMENT = [
  { year: 2019, value: 5.28 },
  { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 },
  { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 },
  { year: 2024, value: 4.91 },
];

// Poverty rate, % of population — BPS (September round).
export const POVERTY = [
  { year: 2019, value: 9.22 },
  { year: 2020, value: 10.19 },
  { year: 2021, value: 9.71 },
  { year: 2022, value: 9.57 },
  { year: 2023, value: 9.36 },
  { year: 2024, value: 8.57 },
];

// Human Development Index — BPS (0–100 scale).
export const HDI = [
  { year: 2019, value: 71.92 },
  { year: 2020, value: 71.94 },
  { year: 2021, value: 72.29 },
  { year: 2022, value: 73.37 },
  { year: 2023, value: 74.39 },
  { year: 2024, value: 75.02 },
];

// Headline indicators shown on the home dashboard.
export const HEADLINES = [
  { label: 'Population', value: '281.6m', note: '4th largest in the world', source: 'BPS, 2024' },
  { label: 'GDP growth', value: '5.03%', note: 'Rp 22,139 trillion nominal GDP', source: 'BPS, 2024' },
  { label: 'GDP per capita', value: 'US$4,960', note: 'Rp 78.62 million', source: 'BPS, 2024' },
  { label: 'Inflation', value: '1.57%', note: 'December 2024, year on year', source: 'BPS, 2024' },
  { label: 'Unemployment', value: '4.91%', note: 'August 2024, open rate', source: 'BPS, 2024' },
  { label: 'Poverty rate', value: '8.57%', note: '24.06 million people, Sep 2024', source: 'BPS, 2024' },
  { label: 'Life expectancy', value: '74.15 yrs', note: 'At birth, up 0.22 yrs on 2023', source: 'BPS, 2024' },
  { label: 'Human Development Index', value: '75.02', note: 'High human development', source: 'BPS, 2024' },
];

// Key facts used on the Sources & methods page.
export const SOURCE_NOTES = [
  { topic: 'Population', figure: '281.6 million (2024)', source: 'BPS official estimate, mid-2024', check: 'CEIC/BPS series and UN WPP 2024 (283.5m) agree within 1%; BPS figure used.' },
  { topic: 'GDP growth', figure: '5.03% (2024)', source: 'BPS national accounts, released 5 Feb 2025', check: 'BPS press release; IMF and World Bank report the same 5.03%.' },
  { topic: 'GDP per capita', figure: 'US$4,960.33 (2024)', source: 'BPS, Rp 78.62 million', check: 'BPS release via Antara, 5 Feb 2025; World Bank US$4,925 (same series, rounding).' },
  { topic: 'Inflation', figure: '1.57% y-on-y, Dec 2024', source: 'BPS CPI release, 2 Jan 2025', check: 'Jakarta Globe / BPS deputy statement; CPI 106.80 vs 105.15 a year earlier.' },
  { topic: 'Unemployment', figure: '4.91% (Aug 2024)', source: 'BPS Sakernas, August round', check: 'BPS labour release; Feb 2024 round was 4.82%.' },
  { topic: 'Poverty', figure: '8.57%, 24.06m people (Sep 2024)', source: 'BPS poverty release, 15 Jan 2025', check: 'Lowest since BPS records began in 1960; Mar 2024 was 9.03%.' },
  { topic: 'Life expectancy & HDI', figure: '74.15 years; HDI 75.02 (2024)', source: 'BPS HDI release No. 85/11/Th.XXVII, 15 Nov 2024', check: 'BPS release text; expected schooling 13.21 yrs, mean schooling 8.85 yrs.' },
  { topic: 'Trade', figure: 'Exports US$264.7bn; imports US$233.7bn (2024)', source: 'BPS / UN Comtrade', check: 'Destatis country profile (UN Comtrade): exports 266, imports 235, balance +31.' },
  { topic: 'Provinces', figure: 'West Java 50.35m; East Java 41.81m (mid-2024)', source: 'BPS provincial estimates', check: 'Wikipedia provinces table (BPS mid-2024) and Whereig (BPS) agree.' },
];
