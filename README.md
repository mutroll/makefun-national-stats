[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/mutroll/makefun-national-stats/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/mutroll/makefun-national-stats/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaStats — Statistik Indonesia

A working national statistics site for Indonesia, built from official
figures. Population 281.6 million, GDP growth 5.03%, inflation 1.57%,
unemployment 4.91%, poverty 8.57% — every figure labelled with its source
(BPS — Statistics Indonesia) and year, and cross-checked against an
independent source before publication.

## Pages

- **Home** — headline dashboard: 8 key indicators, GDP, population,
  inflation and poverty charts.
- **Population & demography** — year selector, metric tabs (total / age
  structure / human development), sortable table by year.
- **Economy** — GDP growth, exports & imports, trade balance; line/bar
  chart switcher; full trade table 2019–2024.
- **Prices & inflation** — CPI chart with line/bar switcher, and the three
  readings that tell 2024's story (March 3.05%, November 1.55%, December 1.57%).
- **Labour & poverty** — unemployment, poverty and HDI tabs; combined table.
- **Regions & provinces** — province selector with a detail panel, top-10
  population chart, and a searchable, sortable table of 20 provinces.
- **Sources & methods** — every figure's source, year and cross-check,
  plus methods and caveats.

## How it is built

Static files under `app/`, no build step, no network requests at all.
Vanilla JavaScript split into files with one job each:

- `app/data.js` — every dataset, with source and year.
- `app/charts.js` — canvas bar/line charts drawn by our own code.
- `app/views.js` — one renderer per page, with working controls.
- `app/router.js` — hash routing, every page linked from every page.
- `app/main.js` — boot.
- `app/style.css` — original teal + amber design, phone-responsive.

Serve it locally with any static server, e.g. `node serve.ts` (serves
`app/` on http://localhost:8080), or `python3 -m http.server` inside `app/`.

## Hand-in

`main.ts` (Node 22, stdlib only) copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts` (the kit copy, unchanged):

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of the site's own code:
home dashboard (cover), economy page, provinces explorer, and a phone-size
home view.

## License

MIT — see [LICENSE](LICENSE).
