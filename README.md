# GTA VI Trophy Guide & Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI —
built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Every trophy, official and complete:** all 55 names, descriptions and grades as PlayStation
  publishes them (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden; 0 online), each with a
  guide written in our own words that names its sources beside it. Triggers the launch-era
  guides have not confirmed yet are flagged as unconfirmed, never invented.
- **A tracker:** a checklist saved in your browser (localStorage), with export to a file and
  import back, filters by kind (story, missable, collectibles, activities, online) and grade,
  text search, and a spoiler setting that hides story trophy names and descriptions until earned.
- **A roadmap to the Platinum:** nine stages in order — story first (with the one possibly
  missable trophy, Positive Mental Attitude, flagged up front), then side-character finales,
  Strangers &amp; Freaks, exploration, activities and medals, partner play and robberies,
  collectibles and money, one-offs and challenges, and finally 100% completion for A Long Road,
  after which the Platinum pops.

## How to run it

No build step, no network needed — it is plain static files under `app/`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` from any static file server with `app/` at its root.

## How to hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

That copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`).

## Layout

- `app/index.html` — the page: progress, filters, roadmap, checklist
- `app/style.css` — the look (our own design; no Rockstar artwork or logo)
- `app/app.js` — the tracker: checklist, filters, search, spoiler setting, export/import
- `app/roadmap.js` — the nine-stage roadmap to the Platinum
- `app/data/trophies.json` — the 55 official trophies with our guides and sources
- `screenshots/` — four renders of the guide in a browser (checklist, guide detail,
  roadmap, spoiler setting)
- `main.ts` — the hand-in program; `serve.ts` — a tiny local static server

## License

MIT — see [LICENSE](LICENSE).
