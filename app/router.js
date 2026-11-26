// router.js — one job: map the URL hash to a page renderer and mark
// the active navigation link. Every page is reachable by a link from
// every other page (header nav + footer nav).
import {
  renderHome, renderPopulation, renderEconomy, renderPrices,
  renderLabour, renderRegions, renderSources,
} from './views.js';

const ROUTES = {
  '': { render: renderHome, title: 'NusaStats — Statistik Indonesia' },
  population: { render: renderPopulation, title: 'Population & demography — NusaStats' },
  economy: { render: renderEconomy, title: 'Economy — NusaStats' },
  prices: { render: renderPrices, title: 'Prices & inflation — NusaStats' },
  labour: { render: renderLabour, title: 'Labour & poverty — NusaStats' },
  regions: { render: renderRegions, title: 'Regions & provinces — NusaStats' },
  sources: { render: renderSources, title: 'Sources & methods — NusaStats' },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[hash] ? hash : '';
}

export function route() {
  const name = currentRoute();
  const page = ROUTES[name];
  const view = document.getElementById('view');
  page.render(view);
  document.title = page.title;
  document.querySelectorAll('.main-nav a').forEach((a) => {
    const active = a.dataset.route === name;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener('hashchange', route);
  route();
}
