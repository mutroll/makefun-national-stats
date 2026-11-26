// main.js — boot the site: start the hash router. Nothing is fetched
// from the network; all data lives in data.js, all charts are drawn by
// charts.js, all pages are rendered by views.js.
import { startRouter } from './router.js';

startRouter();
