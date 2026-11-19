# GTA VI Trophy Guide & Tracker

[![GTA 6 Trophy Guide](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI —
built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **Every trophy, official and complete:** all 55 names, descriptions and grades as PlayStation
  publishes them (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden; 0 online), each with a
  guide written in our own words that names its sources beside it.
- **A tracker:** a checklist saved in your browser (localStorage), with export to a file and
  import back, filters by kind (story, missable, collectibles, activities, online) and grade,
  text search, and a spoiler setting that hides story trophy names and descriptions until earned.
- **A roadmap to the Platinum:** nine stages in order — story first, then side-character finales,
  Strangers &amp; Freaks, exploration, races and stunts, robberies, collectibles and money, challenges,
  and finally 100% completion for A Long Road, after which the Platinum pops.
- **One trophy may be missable:** Positive Mental Attitude, flagged in the app with the Chapter 1
  meditation to do before it disappears.
- **Fully offline:** static files under `app/`, no build step, no network requests at runtime.
  Serve `app/` with any static server and open `index.html` in desktop Chrome.

## Honesty note

GTA VI released on 19 November 2026. Where the cited launch-era guides have not yet confirmed an
exact trigger, the guide says so instead of inventing one. Keep cheats off while chasing trophies:
launch guides report that cheats disable trophies and saving.

## Run it

```sh
node serve.ts   # serves app/ at http://localhost:8080
```

Build the submission output (what the grader runs):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html`, `app/style.css` — the guide's page and look (original design, no game artwork).
- `app/app.js` — checklist, filters, spoiler setting, export/import.
- `app/roadmap.js` — the nine-stage roadmap to the Platinum.
- `app/data/trophies.json` — the 55 official trophies with our own guides and sources.
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes `dossier.json`.
- `screenshots/` — real renders of the app in a browser (checklist, guide detail, roadmap, spoiler view).

## License

MIT — see [LICENSE](LICENSE). An unofficial fan guide, not affiliated with Rockstar Games or PlayStation.
