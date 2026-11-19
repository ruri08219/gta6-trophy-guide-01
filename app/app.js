// GTA VI trophy guide & tracker: checklist saved in localStorage, export/import,
// filters by kind and grade, a spoiler setting, and the roadmap to the Platinum.
// Loads its data from data/trophies.json (same origin, no network at runtime).
import { renderRoadmap } from './roadmap.js';

const STORAGE_KEY = 'gta6-trophy-progress-v1';
const SPOILER_KEY = 'gta6-trophy-spoiler-v1';
const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

const listElement = document.getElementById('list');
const roadmapElement = document.getElementById('roadmap');
const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('grade');
const spoilerCheckbox = document.getElementById('spoiler');
const earnedOnlyCheckbox = document.getElementById('earned-only');
const progressCount = document.getElementById('progress-count');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-pct');
const progressGrades = document.getElementById('progress-grades');
const emptyNote = document.getElementById('empty-note');

let earned = loadEarned();
let revealedSpoilers = new Set();
let openGuides = new Set();
let activeKind = 'all';

function loadEarned() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(stored) ? stored.filter((name) => typeof name === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoilerCheckbox.checked ? '1' : '0');
}

spoilerCheckbox.checked = loadSpoiler();

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

// Screenshot presets (?shot=checklist | detail | roadmap | spoiler) set a fixed
// starting view for the guide's own screenshots; normal visits use none of them.
function applyShotPreset() {
  const preset = new URLSearchParams(location.search).get('shot');
  if (!preset) return;
  if (preset === 'checklist' || preset === 'detail') {
    for (const name of ['Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!', 'Top Of The World, Ma', 'Trust', 'Master of None', 'Stick Fiddler']) earned.add(name);
    saveEarned();
  }
  if (preset === 'detail') openGuides.add('Positive Mental Attitude');
  if (preset === 'spoiler') {
    spoilerCheckbox.checked = true;
    saveSpoiler();
    activeKind = 'story';
    earned = new Set();
    saveEarned();
  }
  // After the first render, scroll the preset's subject into view.
  requestAnimationFrame(() => {
    if (preset === 'checklist') document.querySelector('.progress')?.scrollIntoView();
    if (preset === 'detail') document.getElementById('trophy-28')?.scrollIntoView({ block: 'center' });
    if (preset === 'roadmap') document.getElementById('roadmap-section')?.scrollIntoView();
  });
}
applyShotPreset();

function isSpoilerHidden(trophy) {
  return spoilerCheckbox.checked && trophy.kind === 'story' && trophy.hidden
    && !earned.has(trophy.name) && !revealedSpoilers.has(trophy.name);
}

function matchesFilters(trophy) {
  if (activeKind === 'online') return false;
  if (activeKind !== 'all' && trophy.kind !== activeKind) return false;
  if (gradeSelect.value !== 'all' && trophy.grade !== gradeSelect.value) return false;
  if (earnedOnlyCheckbox.checked && !earned.has(trophy.name)) return false;
  const query = searchInput.value.trim().toLowerCase();
  if (query) {
    const haystack = [trophy.name, trophy.description, trophy.guide].join(' ').toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = 'badge ' + trophy.grade;
  badge.textContent = trophy.grade;
  return badge;
}

function renderTrophy(trophy) {
  const card = document.createElement('article');
  card.className = 'trophy' + (earned.has(trophy.name) ? ' earned' : '');
  card.id = 'trophy-' + trophy.id;
  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', 'Mark ' + trophy.name + ' as earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveEarned();
    renderAll();
  });
  const title = document.createElement('div');
  title.className = 'trophy-title';
  const name = document.createElement('h3');
  const hidden = isSpoilerHidden(trophy);
  name.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  if (hidden) name.classList.add('spoiler-hidden');
  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = hidden ? 'A story trophy — its name and description stay hidden until you earn it.' : '“' + trophy.description + '”';
  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(gradeBadge(trophy));
  if (trophy.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge hidden';
    hiddenBadge.textContent = 'hidden';
    badges.append(hiddenBadge);
  }
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge missable';
    missableBadge.textContent = 'possibly missable';
    badges.append(missableBadge);
  }
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kindBadge);
  const stageBadge = document.createElement('span');
  stageBadge.className = 'badge kind';
  stageBadge.textContent = 'roadmap stage ' + trophy.stage;
  badges.append(stageBadge);
  title.append(name, official, badges);
  head.append(box, title);
  card.append(head);
  if (hidden) {
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.className = 'reveal-btn';
    reveal.textContent = 'Show this trophy anyway';
    reveal.addEventListener('click', () => {
      revealedSpoilers.add(trophy.name);
      renderAll();
    });
    card.append(reveal);
    return card;
  }
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'guide-toggle';
  const isOpen = openGuides.has(trophy.name);
  toggle.textContent = (isOpen ? 'Hide guide ▲' : 'Show guide ▼') + ' — how to earn it, and where each fact comes from';
  const body = document.createElement('div');
  body.className = 'guide-body';
  body.hidden = !isOpen;
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = trophy.guide;
  body.append(guide);
  const sources = document.createElement('p');
  sources.className = 'sources';
  const sourcesLabel = document.createElement('span');
  sourcesLabel.textContent = 'Sources: ';
  sources.append(sourcesLabel);
  trophy.sources.forEach((source, index) => {
    if (index > 0) sources.append(document.createTextNode(' · '));
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.target = '_blank';
      link.rel = 'noopener';
      sources.append(link);
    } else {
      sources.append(document.createTextNode(source.name));
    }
  });
  body.append(sources);
  toggle.addEventListener('click', () => {
    if (openGuides.has(trophy.name)) openGuides.delete(trophy.name);
    else openGuides.add(trophy.name);
    renderAll();
  });
  card.append(toggle, body);
  return card;
}

function renderList() {
  listElement.replaceChildren();
  const visible = trophies.filter(matchesFilters);
  if (activeKind === 'online') {
    emptyNote.hidden = false;
    emptyNote.textContent = 'No online trophies — all 55 trophies are single-player and offline, per PowerPyx. This filter is here so you can check that for yourself.';
  } else if (visible.length === 0) {
    emptyNote.hidden = false;
    emptyNote.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
  } else {
    emptyNote.hidden = true;
  }
  for (const trophy of visible) listElement.append(renderTrophy(trophy));
  document.getElementById('list-heading').textContent =
    'The checklist — ' + visible.length + ' of 55 trophies shown';
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  progressCount.textContent = done + ' of ' + total + ' earned';
  const percent = Math.round((done / total) * 100);
  progressPercent.textContent = percent + '%';
  progressFill.style.width = percent + '%';
  const counts = ['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
    const ofGrade = trophies.filter((trophy) => trophy.grade === grade);
    const earnedOfGrade = ofGrade.filter((trophy) => earned.has(trophy.name)).length;
    return earnedOfGrade + '/' + ofGrade.length + ' ' + grade;
  });
  progressGrades.textContent = counts.join(' · ') + ' · ' + trophies.filter((t) => t.hidden).length + ' hidden · 1 possibly missable';
}

function renderAll() {
  renderProgress();
  renderRoadmap(roadmapElement, trophies, earned, (name) => {
    const trophy = trophies.find((candidate) => candidate.name === name);
    if (!trophy) return;
    activeKind = 'all';
    gradeSelect.value = 'all';
    searchInput.value = '';
    earnedOnlyCheckbox.checked = false;
    openGuides.add(name);
    document.querySelectorAll('#kind-filters button').forEach((button) => {
      button.classList.toggle('active', button.dataset.kind === 'all');
    });
    renderAll();
    document.getElementById('trophy-' + trophy.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  renderList();
}

document.querySelectorAll('#kind-filters button').forEach((button) => {
  button.addEventListener('click', () => {
    activeKind = button.dataset.kind;
    document.querySelectorAll('#kind-filters button').forEach((other) => {
      other.classList.toggle('active', other === button);
    });
    renderAll();
  });
});
if (activeKind !== 'all') {
  document.querySelectorAll('#kind-filters button').forEach((button) => {
    button.classList.toggle('active', button.dataset.kind === activeKind);
  });
}
searchInput.addEventListener('input', renderList);
gradeSelect.addEventListener('change', renderAll);
earnedOnlyCheckbox.addEventListener('change', renderAll);
spoilerCheckbox.addEventListener('change', () => {
  saveSpoiler();
  renderAll();
});

document.getElementById('export').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const names = Array.isArray(imported) ? imported : imported.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((trophy) => trophy.name));
    earned = new Set(names.filter((name) => known.has(name)));
    saveEarned();
    renderAll();
  } catch {
    alert('That file is not a trophy-progress export from this guide.');
  }
  event.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned ticks? This cannot be undone.')) {
    earned = new Set();
    saveEarned();
    renderAll();
  }
});

renderAll();
