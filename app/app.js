// GTA VI trophy guide & tracker: a checklist saved in localStorage, export to a
// file and import back, filters by kind and grade, text search, a spoiler setting
// that hides unearned hidden story trophies, and the roadmap to the Platinum.
// Data comes from data/trophies.json (same origin, nothing fetched at runtime
// from anywhere else). Written for this entry, in my own words and structure.
import { paintRoadmap } from './roadmap.js';

const DATA_URL = 'data/trophies.json';
const PROGRESS_KEY = 'gta6-trophy-progress-v1';
const SPOILER_KEY = 'gta6-trophy-spoiler-v1';
const TOTAL = 55;

const listEl = document.getElementById('trophy-list');
const countEl = document.getElementById('progress-count');
const barEl = document.getElementById('progress-bar');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade-filter');
const spoilerEl = document.getElementById('spoiler');
const emptyEl = document.getElementById('empty-note');
const roadmapEl = document.getElementById('roadmap');

let trophies = [];
let earned = loadEarned();
let kindFilter = 'all';
let gradeFilter = 'all';
let query = '';

function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned]));
}

function spoilerOn() {
  return spoilerEl.checked;
}

function hiddenFromSpoilers(trophy) {
  return spoilerOn() && trophy.hidden && trophy.kind === 'story' && !earned.has(trophy.name);
}

function gradeLabel(grade) {
  return grade === 'platinum' ? 'Platinum' : grade[0].toUpperCase() + grade.slice(1);
}

function kindLabel(kind) {
  return kind === 'missable' ? 'Missable' : kind[0].toUpperCase() + kind.slice(1);
}

function sourceLink(source) {
  if (source.url) {
    const a = document.createElement('a');
    a.href = source.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = source.name;
    return a;
  }
  const span = document.createElement('span');
  span.textContent = source.name;
  return span;
}

function buildCard(trophy) {
  const card = document.createElement('article');
  card.className = 'trophy' + (earned.has(trophy.name) ? ' earned' : '');
  card.id = `trophy-${trophy.id}`;
  card.dataset.kind = trophy.kind;
  card.dataset.grade = trophy.grade;

  const label = document.createElement('label');
  label.className = 'tick';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', `Earned: ${trophy.name}`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveEarned();
    render();
  });
  label.append(box, document.createTextNode('Earned'));

  const title = document.createElement('h3');
  const pill = document.createElement('span');
  pill.className = `grade grade-${trophy.grade}`;
  pill.textContent = gradeLabel(trophy.grade);
  const kindTag = document.createElement('span');
  kindTag.className = 'kind';
  kindTag.textContent = kindLabel(trophy.kind);

  const hidden = hiddenFromSpoilers(trophy);
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;

  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = hidden
    ? 'Earn this trophy to reveal its name and guide.'
    : trophy.description;

  card.append(label, title, pill, kindTag);

  if (trophy.missable) {
    const flag = document.createElement('p');
    flag.className = 'flag missable-flag';
    flag.textContent = 'Possibly missable — do it before the story moves on.';
    card.append(flag);
  }
  if (trophy.unconfirmed) {
    const flag = document.createElement('p');
    flag.className = 'flag unconfirmed-flag';
    flag.textContent = 'Exact trigger unconfirmed — see the guide and its sources.';
    card.append(flag);
  }
  card.append(desc);

  if (!hidden) {
    const details = document.createElement('details');
    details.className = 'guide-box';
    const summary = document.createElement('summary');
    summary.textContent = 'Guide & sources';
    const guide = document.createElement('p');
    guide.className = 'guide';
    guide.textContent = trophy.guide;
    const sourceLine = document.createElement('p');
    sourceLine.className = 'sources';
    sourceLine.textContent = 'Sources: ';
    trophy.sources.forEach((source, i) => {
      if (i > 0) sourceLine.append(document.createTextNode(' · '));
      sourceLine.append(sourceLink(source));
    });
    details.append(summary, guide, sourceLine);
    card.append(details);
  }
  return card;
}

function visible(trophy) {
  if (kindFilter === 'online') return false;
  if (kindFilter !== 'all' && trophy.kind !== kindFilter) return false;
  if (gradeFilter !== 'all' && trophy.grade !== gradeFilter) return false;
  if (query) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function render() {
  const shown = trophies.filter(visible);
  listEl.innerHTML = '';
  for (const trophy of shown) listEl.append(buildCard(trophy));
  countEl.textContent = `${earned.size} of ${TOTAL} earned`;
  barEl.style.width = `${Math.round((earned.size / TOTAL) * 100)}%`;
  barEl.setAttribute('aria-valuenow', String(earned.size));
  emptyEl.hidden = shown.length !== 0;
  paintRoadmap(roadmapEl, earned);
  document.querySelectorAll('#kind-filters button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.kind === kindFilter));
  });
}

function exportProgress() {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned] }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

async function importProgress(file) {
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveEarned();
    render();
  } catch {
    alert('That file is not a trophy progress export from this guide.');
  }
}

document.querySelectorAll('#kind-filters button').forEach((button) => {
  button.addEventListener('click', () => {
    kindFilter = button.dataset.kind;
    render();
  });
});
gradeEl.addEventListener('change', () => {
  gradeFilter = gradeEl.value;
  render();
});
searchEl.addEventListener('input', () => {
  query = searchEl.value.trim().toLowerCase();
  render();
});
spoilerEl.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerEl.checked));
  render();
});
document.getElementById('export').addEventListener('click', exportProgress);
document.getElementById('import').addEventListener('change', (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) importProgress(file);
  event.target.value = '';
});

// Screenshot presets (?shot=): checklist shows 8 earned, detail opens the
// meditation trophy's guide, spoiler turns the spoiler setting on.
// Returns the shot name so the caller can finish setup after rendering.
function applyShotPreset() {
  const shot = new URLSearchParams(location.search).get('shot');
  if (!shot) return null;
  if (shot === 'checklist' || shot === 'spoiler') {
    if (earned.size === 0) {
      for (const name of ['Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!', 'Top Of The World, Ma', 'You Gotta Know When to Get Off', 'Trust', 'Break the Bank']) earned.add(name);
      saveEarned();
    }
  }
  if (shot === 'spoiler') {
    spoilerEl.checked = true;
    localStorage.setItem(SPOILER_KEY, 'true');
  }
  return shot;
}

spoilerEl.checked = JSON.parse(localStorage.getItem(SPOILER_KEY) || 'false');
const response = await fetch(DATA_URL);
const data = await response.json();
trophies = data.trophies;
const shotPreset = applyShotPreset();
render();
if (shotPreset === 'detail') {
  const card = document.getElementById('trophy-28');
  const details = card && card.querySelector('details');
  if (details) details.open = true;
}
