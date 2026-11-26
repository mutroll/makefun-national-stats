// views.js — one renderer per page. Each renderer writes its HTML into
// #view and then wires its controls and draws its charts. Every figure
// shown here comes from data.js and is labelled with source + year.
import {
  HEADLINES, POPULATION_YEAR, AGE_GROUPS, PROVINCES, GDP_GROWTH,
  TRADE, INFLATION,
  UNEMPLOYMENT, POVERTY, HDI, SOURCE_NOTES,
} from './data.js';
import { drawBars, drawLine, drawHBars } from './charts.js';

let redraw = null;
window.addEventListener('resize', () => {
  if (!redraw) return;
  clearTimeout(window.__nusaResize);
  window.__nusaResize = setTimeout(() => redraw(), 180);
});

function onDraw(fn) {
  redraw = fn;
  fn();
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function srcLine(text) {
  return `<p class="src-line">Source: ${esc(text)}</p>`;
}

function statCards(list) {
  return `<div class="stat-grid">${list.map((s) => `
    <div class="stat-card">
      <div class="label">${esc(s.label)}</div>
      <div class="value">${esc(s.value)}</div>
      <p class="note">${esc(s.note)}</p>
      <p class="src">Source: ${esc(s.source)}</p>
    </div>`).join('')}
  </div>`;
}

function chartCard(id, title, sub, source) {
  return `<section class="card"><h2>${esc(title)}</h2>
    <p class="sub">${esc(sub)}</p>
    <div class="chart-wrap"><canvas id="${id}" role="img" aria-label="${esc(title)}"></canvas></div>
    ${srcLine(source)}</section>`;
}

function yearOptions(years, selected) {
  return years.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

// ---------------------------------------------------------------- home
export function renderHome(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Indonesia · Official statistics</p>
    <h1>Indonesia in numbers</h1>
    <p class="lede">The headline figures for Indonesia — population, the economy,
    prices, work and poverty — from BPS, Statistics Indonesia, in one place.
    Every figure below is labelled with its source and year.</p>
  </div>
  ${statCards(HEADLINES)}
  <div class="two-col">
    ${chartCard('home-gdp', 'The economy keeps growing near 5%', 'Real GDP growth, % year on year', 'BPS national accounts, 2019–2024')}
    ${chartCard('home-pop', 'Population still rising', 'Total population, millions', 'BPS official estimates, 2019–2024')}
  </div>
  <div class="two-col">
    ${chartCard('home-inf', 'Inflation fell to 1.57% in 2024', 'Consumer-price inflation, % year on year (December)', 'BPS CPI release, 2019–2024')}
    ${chartCard('home-pov', 'Poverty at its lowest on record', 'Poverty rate, % of population (September)', 'BPS poverty release, 2019–2024')}
  </div>
  <div class="callout insight"><p><strong>What to take from this page:</strong>
  Indonesia had 281.6 million people in 2024 and an economy that grew 5.03%,
  with inflation inside Bank Indonesia's target and poverty at 8.57% — the lowest
  BPS has recorded since 1960. Use the pages above to go deeper: population,
  economy, prices, labour and the provinces.</p></div>
  <section class="card"><h2>Start exploring</h2>
    <p class="sub">Each page answers one question, with charts, tables and sources.</p>
    <p><a href="#/population">Population &amp; demography →</a> · Who lives here, how old they are, and where.<br>
    <a href="#/economy">Economy →</a> · GDP, growth, trade and what the economy is made of.<br>
    <a href="#/prices">Prices &amp; inflation →</a> · What got more expensive, and by how much.<br>
    <a href="#/labour">Labour &amp; poverty →</a> · Jobs, unemployment, poverty and human development.<br>
    <a href="#/regions">Regions &amp; provinces →</a> · Compare all 38 provinces.<br>
    <a href="#/sources">Sources &amp; methods →</a> · Where every figure comes from, and how it was checked.</p>
  </section>`;
  onDraw(() => {
    drawLine(document.getElementById('home-gdp'), GDP_GROWTH.map((d) => ({ label: d.year, value: d.value })), { unit: '% per year', valueLabel: (v) => v.toFixed(2) + '%' });
    drawBars(document.getElementById('home-pop'), POPULATION_YEAR.map((d) => ({ label: d.year, value: d.value })), { unit: 'millions', valueLabel: (v) => v.toFixed(1) });
    drawLine(document.getElementById('home-inf'), INFLATION.map((d) => ({ label: d.year, value: d.value })), { unit: '% per year', valueLabel: (v) => v.toFixed(2) + '%' });
    drawLine(document.getElementById('home-pov'), POVERTY.map((d) => ({ label: d.year, value: d.value })), { unit: '% of population', valueLabel: (v) => v.toFixed(2) + '%' });
  });
}

// ----------------------------------------------------------- population
export function renderPopulation(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">People</p>
    <h1>Population &amp; demography</h1>
    <p class="lede">Indonesia is the world's fourth most populous country. Most people
    live on Java, and the population is still young — a quarter are under 15.</p>
  </div>
  <div class="controls">
    <label for="pop-year">Year</label>
    <select id="pop-year">${yearOptions(POPULATION_YEAR.map((d) => d.year), 2024)}</select>
    <span id="pop-year-text" aria-live="polite"></span>
  </div>
  <div class="tabs" role="group" aria-label="Population charts">
    <button type="button" data-metric="total" aria-pressed="true">Total population</button>
    <button type="button" data-metric="age" aria-pressed="false">Age structure</button>
    <button type="button" data-metric="hdi" aria-pressed="false">Human development</button>
  </div>
  <section class="card"><h2 id="pop-chart-title">Total population, 2019–2024</h2>
    <p class="sub" id="pop-chart-sub">Millions of people, mid-year estimates</p>
    <div class="chart-wrap"><canvas id="pop-chart" role="img" aria-label="Population chart"></canvas></div>
    <p class="src-line" id="pop-chart-src">Source: BPS official estimates, 2019–2024. 2020 is the census count (270.2 million).</p>
  </section>
  <section class="card"><h2>Population by year</h2>
    <p class="sub">Click a column heading to sort. Source: BPS, 2019–2024.</p>
    <div class="table-scroll"><table class="data" id="pop-table">
      <thead><tr>
        <th><button type="button" data-sort="year">Year ↕</button></th>
        <th class="num"><button type="button" data-sort="value">Population (millions) ↕</button></th>
        <th class="num"><button type="button" data-sort="change">Change on previous year ↕</button></th>
      </tr></thead>
      <tbody></tbody>
    </table></div>
  </section>
  <div class="callout"><p><strong>Why it matters:</strong> with 281.6 million people in 2024
  and a median age near 30, Indonesia's working-age population keeps growing —
  the "demographic bonus" BPS and Bappenas track. Java alone holds about 157
  million people, more than half the country (BPS, 2024).</p></div>`;

  const yearSel = view.querySelector('#pop-year');
  const yearText = view.querySelector('#pop-year-text');
  const canvas = view.querySelector('#pop-chart');
  const title = view.querySelector('#pop-chart-title');
  const sub = view.querySelector('#pop-chart-sub');
  const src = view.querySelector('#pop-chart-src');
  const tabs = [...view.querySelectorAll('.tabs button')];
  let metric = 'total';

  function showYear() {
    const row = POPULATION_YEAR.find((d) => d.year === Number(yearSel.value));
    const prev = POPULATION_YEAR[POPULATION_YEAR.indexOf(row) - 1];
    const change = prev ? ((row.value - prev.value) / prev.value * 100).toFixed(2) : '—';
    yearText.textContent = `Population in ${row.year}: ${row.value.toFixed(1)} million people — ${change}% on the previous year (BPS, ${row.year}).`;
  }
  function drawChart() {
    if (metric === 'total') {
      title.textContent = 'Total population, 2019–2024';
      sub.textContent = 'Millions of people, mid-year estimates';
      src.textContent = 'Source: BPS official estimates, 2019–2024. 2020 is the census count (270.2 million).';
      drawBars(canvas, POPULATION_YEAR.map((d) => ({ label: d.year, value: d.value })), { unit: 'millions', valueLabel: (v) => v.toFixed(1) });
    } else if (metric === 'age') {
      title.textContent = 'Age structure, 2024';
      sub.textContent = 'Share of the population in each age band (approximate shares)';
      src.textContent = 'Source: BPS / UN World Population Prospects 2024. Ages 0–14: 24.6%; 65+: 7.3%.';
      drawHBars(canvas, AGE_GROUPS.map((g) => ({ label: g.group, value: g.share })), { unit: '% of population', valueLabel: (v) => v.toFixed(1) + '%' });
    } else {
      title.textContent = 'Human Development Index, 2019–2024';
      sub.textContent = 'Index, 0–100. 75.02 in 2024: high human development.';
      src.textContent = 'Source: BPS HDI release, 2019–2024.';
      drawLine(canvas, HDI.map((d) => ({ label: d.year, value: d.value })), { unit: 'HDI points', valueLabel: (v) => v.toFixed(2), min: 70 });
    }
  }
  tabs.forEach((b) => b.addEventListener('click', () => {
    metric = b.dataset.metric;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    drawChart();
  }));
  yearSel.addEventListener('change', showYear);
  showYear();

  // Sortable table.
  const tbody = view.querySelector('#pop-table tbody');
  let rows = POPULATION_YEAR.map((d, i) => ({
    year: d.year, value: d.value,
    change: i === 0 ? null : ((d.value - POPULATION_YEAR[i - 1].value) / POPULATION_YEAR[i - 1].value * 100),
  }));
  let sortKey = 'year'; let sortDir = 1;
  function paintTable() {
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? -Infinity; const bv = b[sortKey] ?? -Infinity;
      return (av - bv) * sortDir;
    });
    tbody.innerHTML = sorted.map((r) => `<tr><td>${r.year}</td><td class="num">${r.value.toFixed(1)}</td><td class="num">${r.change === null ? '—' : '+' + r.change.toFixed(2) + '%'}</td></tr>`).join('');
  }
  view.querySelectorAll('#pop-table th button').forEach((b) => b.addEventListener('click', () => {
    if (sortKey === b.dataset.sort) sortDir *= -1; else { sortKey = b.dataset.sort; sortDir = 1; }
    paintTable();
  }));
  paintTable();
  onDraw(drawChart);
}

// -------------------------------------------------------------- economy
export function renderEconomy(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Money</p>
    <h1>Economy</h1>
    <p class="lede">Southeast Asia's largest economy: Rp 22,139 trillion of output in 2024,
    growing 5.03%, with exports of US$264.7 billion. Household spending is just
    over half of GDP.</p>
  </div>
  ${statCards([
    { label: 'GDP growth', value: '5.03%', note: '2024, real, year on year', source: 'BPS, 2024' },
    { label: 'Nominal GDP', value: 'Rp 22,139tn', note: 'US$1.40 trillion at market rates', source: 'BPS, 2024' },
    { label: 'GDP per capita', value: 'US$4,960', note: 'Rp 78.62 million per person', source: 'BPS, 2024' },
    { label: 'Trade balance', value: '+US$31.0bn', note: 'Exports 264.7, imports 233.7', source: 'BPS / UN Comtrade, 2024' },
  ])}
  <div class="tabs" role="group" aria-label="Economy charts">
    <button type="button" data-metric="growth" aria-pressed="true">GDP growth</button>
    <button type="button" data-metric="trade" aria-pressed="false">Exports &amp; imports</button>
    <button type="button" data-metric="balance" aria-pressed="false">Trade balance</button>
  </div>
  <div class="controls">
    <span>Chart type:</span>
    <div class="tabs" role="group" aria-label="Chart type">
      <button type="button" data-kind="line" aria-pressed="true">Line</button>
      <button type="button" data-kind="bar" aria-pressed="false">Bars</button>
    </div>
  </div>
  <section class="card"><h2 id="eco-chart-title">Real GDP growth, 2019–2024</h2>
    <p class="sub" id="eco-chart-sub">% change on the previous year, constant prices</p>
    <div class="chart-wrap"><canvas id="eco-chart" role="img" aria-label="Economy chart"></canvas></div>
    <p class="src-line" id="eco-chart-src">Source: BPS national accounts, 2019–2024.</p>
  </section>
  <section class="card"><h2>Trade in goods, 2019–2024</h2>
    <p class="sub">US$ billion. Source: BPS / UN Comtrade.</p>
    <div class="table-scroll"><table class="data">
      <thead><tr><th>Year</th><th class="num">Exports (US$bn)</th><th class="num">Imports (US$bn)</th><th class="num">Balance (US$bn)</th></tr></thead>
      <tbody>${TRADE.map((t) => `<tr><td>${t.year}</td><td class="num">${t.exports.toFixed(1)}</td><td class="num">${t.imports.toFixed(1)}</td><td class="num">${(t.exports - t.imports).toFixed(1)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="src-line">Source: BPS / UN Comtrade, 2019–2024. Indonesia has run a goods surplus every year since 2020.</p>
  </section>`;

  const canvas = view.querySelector('#eco-chart');
  const title = view.querySelector('#eco-chart-title');
  const sub = view.querySelector('#eco-chart-sub');
  const src = view.querySelector('#eco-chart-src');
  let metric = 'growth'; let kind = 'line';
  const tabs = [...view.querySelectorAll('[data-metric]')];
  const kinds = [...view.querySelectorAll('[data-kind]')];

  function drawChart() {
    const series = metric === 'growth'
      ? GDP_GROWTH.map((d) => ({ label: d.year, value: d.value }))
      : metric === 'trade'
        ? TRADE.map((d) => ({ label: d.year, value: d.exports }))
        : TRADE.map((d) => ({ label: d.year, value: Math.round((d.exports - d.imports) * 10) / 10 }));
    if (metric === 'growth') {
      title.textContent = 'Real GDP growth, 2019–2024';
      sub.textContent = '% change on the previous year, constant prices';
      src.textContent = 'Source: BPS national accounts, 2019–2024. 2020: −2.07% (COVID-19).';
    } else if (metric === 'trade') {
      title.textContent = 'Exports of goods, 2019–2024';
      sub.textContent = 'US$ billion per year';
      src.textContent = 'Source: BPS / UN Comtrade, 2019–2024. Imports are in the table below.';
    } else {
      title.textContent = 'Trade balance in goods, 2019–2024';
      sub.textContent = 'Exports minus imports, US$ billion per year';
      src.textContent = 'Source: BPS / UN Comtrade, 2019–2024. Surplus every year since 2020; 2019 was a deficit of US$3.0bn.';
    }
    const opts = { unit: metric === 'growth' ? '% per year' : 'US$ billion', valueLabel: metric === 'growth' ? (v) => v.toFixed(2) + '%' : (v) => v.toFixed(1) };
    if (kind === 'bar') drawBars(canvas, series, opts);
    else drawLine(canvas, series, { ...opts, min: metric === 'growth' ? -3 : metric === 'balance' ? -5 : null });
  }
  tabs.forEach((b) => b.addEventListener('click', () => {
    metric = b.dataset.metric;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    drawChart();
  }));
  kinds.forEach((b) => b.addEventListener('click', () => {
    kind = b.dataset.kind;
    kinds.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    drawChart();
  }));
  onDraw(drawChart);
}

// --------------------------------------------------------------- prices
export function renderPrices(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Prices</p>
    <h1>Prices &amp; inflation</h1>
    <p class="lede">Inflation was 1.57% in December 2024 — inside Bank Indonesia's 2.5% ± 1
    target band, and the lowest year-end reading since the pandemic years.
    Food prices drove most of the rise.</p>
  </div>
  ${statCards([
    { label: 'Inflation, Dec 2024', value: '1.57%', note: 'Year on year; CPI 106.80', source: 'BPS, Dec 2024' },
    { label: 'Inflation, Dec 2023', value: '2.61%', note: 'A year earlier, for comparison', source: 'BPS, Dec 2023' },
    { label: 'Peak, 2022', value: '5.51%', note: 'Fuel-price adjustment year', source: 'BPS, Dec 2022' },
    { label: 'BI target', value: '2.5% ± 1', note: 'Inflation target band', source: 'Bank Indonesia' },
  ])}
  <div class="controls">
    <span>Chart type:</span>
    <div class="tabs" role="group" aria-label="Chart type">
      <button type="button" data-kind="line" aria-pressed="true">Line</button>
      <button type="button" data-kind="bar" aria-pressed="false">Bars</button>
    </div>
  </div>
  <section class="card"><h2>Inflation, 2019–2024</h2>
    <p class="sub">Consumer-price inflation, % year on year (December reading)</p>
    <div class="chart-wrap"><canvas id="price-chart" role="img" aria-label="Inflation chart"></canvas></div>
    ${srcLine('BPS CPI releases, 2019–2024. March 2024 peaked at 3.05% before easing through the year.')}
  </section>
  <section class="card"><h2>How 2024 unfolded</h2>
    <p class="sub">Three readings that tell the year's story. Source: BPS CPI releases, 2024.</p>
    <div class="table-scroll"><table class="data">
      <thead><tr><th>Reading</th><th class="num">Inflation (% y-on-y)</th><th>What happened</th></tr></thead>
      <tbody>
        <tr><td>March 2024</td><td class="num">3.05%</td><td>The year's peak, driven by food prices ahead of Ramadan.</td></tr>
        <tr><td>November 2024</td><td class="num">1.55%</td><td>The low point of the year, the lowest since April 2021.</td></tr>
        <tr><td>December 2024</td><td class="num">1.57%</td><td>Year-end reading; CPI 106.80 against 105.15 a year earlier.</td></tr>
      </tbody>
    </table></div>
    <p class="src-line">Source: BPS CPI releases, 2024; March peak and November low via LPEM-FEB UI analysis of BPS data. Food, beverages &amp; tobacco rose 1.90% in December 2024 and contributed 0.55 points of the 1.57% (BPS, 2 January 2025).</p>
  </section>
  <div class="callout"><p><strong>How to read this:</strong> 1.57% means the average
  basket of goods cost 1.57% more in December 2024 than in December 2023. The
  CPI index itself rose from 105.15 to 106.80 (BPS, 2024).</p></div>`;

  const canvas = view.querySelector('#price-chart');
  let kind = 'line';
  const kinds = [...view.querySelectorAll('[data-kind]')];
  function drawAll() {
    const series = INFLATION.map((d) => ({ label: d.year, value: d.value }));
    if (kind === 'bar') drawBars(canvas, series, { unit: '% per year', valueLabel: (v) => v.toFixed(2) + '%' });
    else drawLine(canvas, series, { unit: '% per year', valueLabel: (v) => v.toFixed(2) + '%' });
  }
  kinds.forEach((b) => b.addEventListener('click', () => {
    kind = b.dataset.kind;
    kinds.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    drawAll();
  }));
  onDraw(drawAll);
}

// --------------------------------------------------------------- labour
export function renderLabour(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Work &amp; welfare</p>
    <h1>Labour &amp; poverty</h1>
    <p class="lede">Unemployment fell to 4.91% in August 2024 and poverty to 8.57% in
    September 2024 — the lowest poverty rate BPS has recorded. Human development
    keeps climbing, reaching 75.02 in 2024.</p>
  </div>
  ${statCards([
    { label: 'Unemployment', value: '4.91%', note: 'Open rate, August 2024', source: 'BPS Sakernas, 2024' },
    { label: 'Poverty rate', value: '8.57%', note: '24.06 million people', source: 'BPS, Sep 2024' },
    { label: 'Life expectancy', value: '74.15 yrs', note: 'At birth, up 0.22 yrs on 2023', source: 'BPS, 2024' },
    { label: 'Gini ratio', value: '0.379', note: 'Down from 0.388 in 2023', source: 'BPS, Sep 2024' },
  ])}
  <div class="tabs" role="group" aria-label="Labour charts">
    <button type="button" data-metric="unemployment" aria-pressed="true">Unemployment</button>
    <button type="button" data-metric="poverty" aria-pressed="false">Poverty</button>
    <button type="button" data-metric="hdi" aria-pressed="false">Human development</button>
  </div>
  <section class="card"><h2 id="lab-chart-title">Open unemployment rate, 2019–2024</h2>
    <p class="sub" id="lab-chart-sub">% of the labour force, August round each year</p>
    <div class="chart-wrap"><canvas id="lab-chart" role="img" aria-label="Labour chart"></canvas></div>
    <p class="src-line" id="lab-chart-src">Source: BPS Sakernas, 2019–2024.</p>
  </section>
  <section class="card"><h2>Labour &amp; poverty by year</h2>
    <p class="sub">Unemployment (August) and poverty (September) side by side. Source: BPS, 2019–2024.</p>
    <div class="table-scroll"><table class="data">
      <thead><tr><th>Year</th><th class="num">Unemployment (%)</th><th class="num">Poverty (%)</th><th class="num">HDI</th></tr></thead>
      <tbody>${UNEMPLOYMENT.map((u, i) => `<tr><td>${u.year}</td><td class="num">${u.value.toFixed(2)}</td><td class="num">${POVERTY[i].value.toFixed(2)}</td><td class="num">${HDI[i].value.toFixed(2)}</td></tr>`).join('')}</tbody>
    </table></div>
  </section>
  <div class="callout"><p><strong>The caveat behind the good news:</strong> poverty
  fell, but the poverty line is low and inequality, while improving (Gini 0.379
  in September 2024, down from 0.388 a year earlier), remains a structural
  challenge — and most new jobs are informal. The official poverty line and
  the World Bank's international lines measure different things, so the two
  poverty counts differ (BPS).</p></div>`;

  const canvas = view.querySelector('#lab-chart');
  const title = view.querySelector('#lab-chart-title');
  const sub = view.querySelector('#lab-chart-sub');
  const src = view.querySelector('#lab-chart-src');
  let metric = 'unemployment';
  const tabs = [...view.querySelectorAll('[data-metric]')];
  function drawChart() {
    if (metric === 'unemployment') {
      title.textContent = 'Open unemployment rate, 2019–2024';
      sub.textContent = '% of the labour force, August round each year';
      src.textContent = 'Source: BPS Sakernas, 2019–2024. 2020 peak: 7.07% (COVID-19).';
      drawLine(canvas, UNEMPLOYMENT.map((d) => ({ label: d.year, value: d.value })), { unit: '% of labour force', valueLabel: (v) => v.toFixed(2) + '%' });
    } else if (metric === 'poverty') {
      title.textContent = 'Poverty rate, 2019–2024';
      sub.textContent = '% of population, September round each year';
      src.textContent = 'Source: BPS poverty releases, 2019–2024. September 2024: 8.57%, the lowest on record.';
      drawLine(canvas, POVERTY.map((d) => ({ label: d.year, value: d.value })), { unit: '% of population', valueLabel: (v) => v.toFixed(2) + '%' });
    } else {
      title.textContent = 'Human Development Index, 2019–2024';
      sub.textContent = 'Index, 0–100';
      src.textContent = 'Source: BPS HDI release, 2019–2024. Life expectancy 74.15 years in 2024.';
      drawLine(canvas, HDI.map((d) => ({ label: d.year, value: d.value })), { unit: 'HDI points', valueLabel: (v) => v.toFixed(2), min: 70 });
    }
  }
  tabs.forEach((b) => b.addEventListener('click', () => {
    metric = b.dataset.metric;
    tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    drawChart();
  }));
  onDraw(drawChart);
}

// -------------------------------------------------------------- regions
export function renderRegions(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Where people live</p>
    <h1>Regions &amp; provinces explorer</h1>
    <p class="lede">Indonesia has 38 provinces across more than 17,000 islands. Java holds
    about 157 million people — over half the country — while the eastern provinces
    are far less dense. Pick a province, or search and sort the table.</p>
  </div>
  <div class="controls">
    <label for="prov-select">Province</label>
    <select id="prov-select">${PROVINCES.map((p, i) => `<option value="${i}">${esc(p.name)}</option>`).join('')}</select>
  </div>
  <div class="province-detail" id="prov-detail" aria-live="polite"></div>
  <section class="card"><h2>All provinces in this explorer</h2>
    <p class="sub">Population and density, mid-2024. Click a heading to sort.</p>
    <div class="controls">
      <label for="prov-search">Search</label>
      <input type="search" id="prov-search" placeholder="Type a province or island…" aria-label="Search provinces">
    </div>
    <div class="table-scroll"><table class="data" id="prov-table">
      <thead><tr>
        <th><button type="button" data-sort="name">Province ↕</button></th>
        <th><button type="button" data-sort="capital">Capital ↕</button></th>
        <th><button type="button" data-sort="island">Island ↕</button></th>
        <th class="num"><button type="button" data-sort="pop">Population (m) ↕</button></th>
        <th class="num"><button type="button" data-sort="density">Density /km² ↕</button></th>
      </tr></thead>
      <tbody></tbody>
    </table></div>
    <p class="count-line" id="prov-count"></p>
    ${srcLine('BPS provincial estimates, mid-2024. Full 38-province table: BPS provincial publications.')}
  </section>
  <section class="card"><h2>Largest provinces by population, 2024</h2>
    <p class="sub">Millions of people, mid-2024 estimates</p>
    <div class="chart-wrap"><canvas id="prov-chart" role="img" aria-label="Largest provinces chart"></canvas></div>
    ${srcLine('BPS provincial estimates, mid-2024.')}
  </section>`;

  const select = view.querySelector('#prov-select');
  const detail = view.querySelector('#prov-detail');
  const canvas = view.querySelector('#prov-chart');
  const tbody = view.querySelector('#prov-table tbody');
  const search = view.querySelector('#prov-search');
  const count = view.querySelector('#prov-count');

  function showProvince() {
    const p = PROVINCES[Number(select.value)];
    const share = ((p.pop / 281.6) * 100).toFixed(1);
    detail.innerHTML = `<h3>${esc(p.name)}</h3>
      <p style="margin:0">Capital ${esc(p.capital)} · Island of ${esc(p.island)} · ${share}% of Indonesia's population (BPS, 2024).</p>
      <dl>
        <div><dt>Population</dt><dd>${p.pop.toFixed(2)}m</dd></div>
        <div><dt>Density</dt><dd>${p.density.toLocaleString('en-US')}/km²</dd></div>
        <div><dt>Capital</dt><dd>${esc(p.capital)}</dd></div>
        <div><dt>Share of Indonesia</dt><dd>${share}%</dd></div>
      </dl>`;
  }
  select.addEventListener('change', showProvince);
  showProvince();

  let sortKey = 'pop'; let sortDir = -1;
  function paintTable() {
    const q = search.value.trim().toLowerCase();
    let rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q));
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === 'string') return av.localeCompare(bv) * sortDir;
      return (av - bv) * sortDir;
    });
    tbody.innerHTML = rows.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.capital)}</td><td>${esc(p.island)}</td><td class="num">${p.pop.toFixed(2)}</td><td class="num">${p.density.toLocaleString('en-US')}</td></tr>`).join('')
      || `<tr><td colspan="5">No province matches “${esc(search.value)}”. Try another name.</td></tr>`;
    count.textContent = `Showing ${rows.length} of ${PROVINCES.length} provinces in this explorer (20 of 38; full list: BPS).`;
  }
  search.addEventListener('input', paintTable);
  view.querySelectorAll('#prov-table th button').forEach((b) => b.addEventListener('click', () => {
    if (sortKey === b.dataset.sort) sortDir *= -1; else { sortKey = b.dataset.sort; sortDir = sortKey === 'name' || sortKey === 'capital' || sortKey === 'island' ? 1 : -1; }
    paintTable();
  }));
  paintTable();
  onDraw(() => {
    const top = [...PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 10);
    drawHBars(canvas, top.map((p) => ({ label: p.name, value: p.pop })), { unit: 'millions', valueLabel: (v) => v.toFixed(1) });
  });
}

// -------------------------------------------------------------- sources
export function renderSources(view) {
  view.innerHTML = `
  <div class="page-head">
    <p class="kicker">Trust</p>
    <h1>Sources &amp; methods</h1>
    <p class="lede">Every figure on NusaStats comes from an official release, is labelled
    with its source and year where it appears, and was cross-checked against at
    least one independent source before publication.</p>
  </div>
  <section class="card"><h2>Headline source</h2>
    <p><strong>BPS — Statistics Indonesia (Badan Pusat Statistik), bps.go.id</strong> —
    Indonesia's official statistics office. National accounts, CPI, Sakernas labour
    survey, poverty releases and the Human Development Index are all BPS releases.
    Trade figures are BPS customs data, cross-checked with UN Comtrade.</p>
    <p>Other sources cited for cross-checks: World Bank World Development Indicators,
    UN World Population Prospects 2024, Bank Indonesia (inflation target).</p>
  </section>
  <section class="card"><h2>Figure by figure — source and check</h2>
    <ul class="method-list">
      ${SOURCE_NOTES.map((n) => `<li><span class="topic">${esc(n.topic)}</span>
        <p>${esc(n.figure)} — ${esc(n.source)}</p>
        <p class="check">Cross-check: ${esc(n.check)}</p></li>`).join('')}
    </ul>
  </section>
  <section class="card"><h2>Methods &amp; caveats</h2>
    <p><strong>Population:</strong> BPS mid-year estimates; 2020 is the census count.
    The UN's 2024 estimate (283.5m) is about 0.7% higher — different methods,
    same picture. BPS figures are used throughout.</p>
    <p><strong>GDP:</strong> growth is real (constant 2010 prices), year on year.
    Nominal GDP is at current prices. GDP per capita divides nominal GDP by the
    mid-year population.</p>
    <p><strong>Inflation:</strong> the December year-on-year CPI change, the figure
    BPS headlines each January. The annual average can differ slightly.</p>
    <p><strong>Unemployment:</strong> the open unemployment rate from Sakernas,
    the August round. <strong>Poverty:</strong> the September round; the poverty
    line is the cost of a minimum basket of food and non-food needs.</p>
    <p><strong>Provinces:</strong> 38 provinces since the Papua splits. This explorer
    lists 20 provinces with full detail; the remaining 18 are in BPS provincial
    publications. Densities use BPS land-area figures.</p>
    <p><strong>Updates:</strong> figures are as published for 2024, checked
    26 November 2026. BPS releases new data through the year; the next full
    refresh follows the February GDP release.</p>
  </section>
  <section class="card"><h2>How to cite this site</h2>
    <p>“NusaStats — Statistik Indonesia. Population 281.6 million (BPS, 2024);
    GDP growth 5.03% (BPS, 2024).” Figures are reproduced as published; see the
    BPS release named beside each figure for the primary source.</p>
    <p class="src-line">NusaStats is an independent presentation of public official
    statistics. It is not affiliated with BPS or the Government of Indonesia.</p>
  </section>`;
  onDraw(() => {});
}
