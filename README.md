# GTA VI Trophy Guide & Tracker

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/ruri08219/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and checklist for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — 1 Platinum, 2 Gold, 6 Silver, 46 Bronze — built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/bounty/gta6-trophy-guide-01) ($250, top 50 share).

## What it is

- **Every trophy, with a guide.** Each of the 55 official trophies carries a guide written for this page, in its own words, naming the source of each fact (PowerPyx, PSNProfiles, Exophase, GTA Zone, GTABase). Where a trigger has not been confirmed, the guide says so instead of guessing.
- **A checklist that saves.** Tick trophies as you earn them; progress is stored in your browser's localStorage, with export to a file and import back.
- **Filters that answer real questions.** Filter by kind (story 25, missable 1, collectibles 8, activities 21, online 0 — there are no online trophies) and by grade, or search by name, description or guide text.
- **A spoiler setting.** With it on, unearned hidden story trophies show as “Hidden story trophy” instead of spoiling the story.
- **A 9-stage roadmap to the Platinum.** Story first, the one possibly-missable trophy (Positive Mental Attitude — meditate at the Chapter 1 spots before you leave Chapter 1) second, the grinds last.
- **Fully offline.** Plain HTML, CSS and JavaScript, no framework, no build step, no network requests. Open `app/index.html` through any static server — `node serve.ts` serves it at <http://localhost:8080>.

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json` with the kit's `buildDossier` from `vendor/makefun-frontend.ts`.

## Notes

- Trophy names, descriptions and grades are the official PlayStation 5 list as published before launch.
- This is an unofficial fan guide, not affiliated with Rockstar Games, and uses no Rockstar artwork, logos or game screenshots. The screenshots in `screenshots/` are renders of this guide's own pages.
- License: MIT — see [LICENSE](LICENSE).
