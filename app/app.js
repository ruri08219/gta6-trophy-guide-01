// GTA VI trophy guide + tracker. Plain script, no libraries, no network:
// the only request it makes is a same-server fetch of data/trophies.json.
(function () {
  "use strict";

  var PROGRESS_KEY = "gta6-trophy-progress-v1";
  var SPOILER_KEY = "gta6-trophy-spoiler-v1";
  var TOTAL = 55;

  var trophies = [];
  var earned = new Set();
  var kindFilter = "all";
  var gradeFilter = "all";
  var query = "";
  var spoilerOn = false;
  var openDetailId = null;

  var listEl = document.getElementById("trophy-list");
  var countEl = document.getElementById("progress-count");
  var pctEl = document.getElementById("progress-pct");
  var fillEl = document.getElementById("progress-fill");
  var emptyEl = document.getElementById("empty-note");
  var searchEl = document.getElementById("search");
  var gradeEl = document.getElementById("grade-filter");
  var spoilerEl = document.getElementById("spoiler");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      var arr = JSON.parse(raw);
      if (Array.isArray(arr)) arr.forEach(function (name) { earned.add(name); });
    } catch (e) { /* a corrupt save starts empty rather than breaking the page */ }
  }

  function saveProgress() {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(earned).sort()));
    } catch (e) { /* private mode: the page still works, it just cannot persist */ }
  }

  function loadSpoiler() {
    try { spoilerOn = localStorage.getItem(SPOILER_KEY) === "1"; } catch (e) { spoilerOn = false; }
    spoilerEl.checked = spoilerOn;
  }

  function saveSpoiler() {
    try { localStorage.setItem(SPOILER_KEY, spoilerOn ? "1" : "0"); } catch (e) { /* ignore */ }
  }

  function isVeiled(t) {
    return spoilerOn && t.hidden && t.kind === "story" && !earned.has(t.name);
  }

  function visibleTrophies() {
    var q = query.trim().toLowerCase();
    return trophies.filter(function (t) {
      if (kindFilter !== "all" && t.kind !== kindFilter) return false;
      if (gradeFilter !== "all" && t.grade !== gradeFilter) return false;
      if (q) {
        var hay = (t.name + " " + t.description + " " + t.guide + " " + (t.sources || []).join(" ")).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function gradeLabel(g) {
    return g.charAt(0).toUpperCase() + g.slice(1);
  }

  function renderRoadmap() {
    var ol = document.getElementById("roadmap");
    ol.textContent = "";
    (window.ROADMAP_STAGES || []).forEach(function (stage) {
      var li = el("li");
      li.appendChild(el("h3", null, stage.title));
      li.appendChild(el("p", null, stage.text));
      li.appendChild(el("p", "stage-trophies", "Trophies: " + stage.trophies.join(" · ")));
      ol.appendChild(li);
    });
  }

  function renderProgress() {
    var n = earned.size;
    countEl.textContent = n + " of " + TOTAL + " earned";
    pctEl.textContent = Math.round((n / TOTAL) * 100) + "%";
    fillEl.style.width = (n / TOTAL) * 100 + "%";
  }

  function renderList() {
    var shown = visibleTrophies();
    listEl.textContent = "";
    if (shown.length === 0) {
      if (kindFilter === "online") {
        emptyEl.textContent = "No online trophies — GTA VI has no online mode at launch, so all 55 trophies are earnable solo. This filter is here so you can see that for yourself.";
      } else {
        emptyEl.textContent = "Nothing matches those filters. Clear the search or pick another kind or grade.";
      }
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
    }

    shown.forEach(function (t) {
      var card = el("article", "trophy" + (earned.has(t.name) ? " earned" : ""));
      card.id = "trophy-" + t.id;

      var head = el("div", "trophy-head");
      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = earned.has(t.name);
      box.setAttribute("aria-label", "Earned: " + t.name);
      box.addEventListener("change", function () {
        if (box.checked) earned.add(t.name); else earned.delete(t.name);
        saveProgress();
        renderProgress();
        renderList();
      });
      head.appendChild(box);

      var veiled = isVeiled(t);
      head.appendChild(el("h3", null, veiled ? "Hidden story trophy" : t.name));
      var badge = el("span", "grade-badge grade-" + t.grade, gradeLabel(t.grade));
      head.appendChild(badge);
      card.appendChild(head);

      card.appendChild(el("p", "trophy-desc", veiled
        ? "A hidden story trophy. Earn it to reveal it — or turn the spoiler setting off."
        : t.description));

      if (!veiled) {
        var tags = el("div", "trophy-tags");
        tags.appendChild(el("span", "tag", t.kind === "story" ? "Story" : t.kind === "missable" ? "Missable" : t.kind === "collectibles" ? "Collectible" : "Activity"));
        if (t.hidden) tags.appendChild(el("span", "tag tag-hidden", "Hidden"));
        if (t.missable) tags.appendChild(el("span", "tag tag-missable", "Possibly missable"));
        if (t.count) tags.appendChild(el("span", "tag", "Count: " + t.count.toLocaleString("en-US")));
        card.appendChild(tags);

        var toggle = el("button", "guide-toggle", openDetailId === t.id ? "Hide guide" : "Show guide");
        toggle.type = "button";
        toggle.setAttribute("aria-expanded", openDetailId === t.id ? "true" : "false");
        toggle.addEventListener("click", function () {
          openDetailId = openDetailId === t.id ? null : t.id;
          renderList();
        });
        card.appendChild(toggle);

        if (openDetailId === t.id) {
          var detail = el("div", "trophy-guide");
          detail.appendChild(el("p", null, t.guide));
          if (t.sources && t.sources.length) {
            detail.appendChild(el("p", "trophy-sources", "Sources: " + t.sources.join(", ") + "."));
          }
          card.appendChild(detail);
        }
      }
      listEl.appendChild(card);
    });
  }

  function renderAll() {
    renderProgress();
    renderList();
  }

  function applyShotPreset() {
    var shot = new URLSearchParams(window.location.search).get("shot");
    if (!shot) return;
    if (shot === "checklist") {
      [2, 3, 4, 8, 16, 21, 42, 44].forEach(function (id) {
        var t = trophies.find(function (x) { return x.id === id; });
        if (t) earned.add(t.name);
      });
      saveProgress();
    } else if (shot === "detail") {
      openDetailId = 28;
    } else if (shot === "spoiler") {
      spoilerOn = true;
      spoilerEl.checked = true;
      saveSpoiler();
    }
  }

  function exportProgress() {
    var blob = new Blob([JSON.stringify({ game: "Grand Theft Auto VI", earned: Array.from(earned).sort() }, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gta6-trophy-progress.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(String(reader.result));
        var names = Array.isArray(data) ? data : data.earned;
        if (!Array.isArray(names)) throw new Error("expected a list of trophy names");
        var known = new Set(trophies.map(function (t) { return t.name; }));
        earned = new Set(names.filter(function (n) { return known.has(n); }));
        saveProgress();
        renderAll();
      } catch (e) {
        alert("That file is not a progress export from this guide.");
      }
    };
    reader.readAsText(file);
  }

  // Wire the controls once; the list re-renders underneath them.
  document.querySelectorAll("#kind-filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      kindFilter = btn.getAttribute("data-kind");
      document.querySelectorAll("#kind-filters button").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      renderList();
    });
  });
  gradeEl.addEventListener("change", function () { gradeFilter = gradeEl.value; renderList(); });
  searchEl.addEventListener("input", function () { query = searchEl.value; renderList(); });
  spoilerEl.addEventListener("change", function () { spoilerOn = spoilerEl.checked; saveSpoiler(); renderList(); });
  document.getElementById("export-btn").addEventListener("click", exportProgress);
  document.getElementById("import-btn").addEventListener("click", function () {
    document.getElementById("import-file").click();
  });
  document.getElementById("import-file").addEventListener("change", function (ev) {
    if (ev.target.files && ev.target.files[0]) importProgress(ev.target.files[0]);
    ev.target.value = "";
  });
  document.getElementById("reset-btn").addEventListener("click", function () {
    if (window.confirm("Clear every tick on the checklist?")) {
      earned = new Set();
      saveProgress();
      renderAll();
    }
  });

  loadProgress();
  loadSpoiler();
  renderRoadmap();
  fetch("data/trophies.json")
    .then(function (r) { if (!r.ok) throw new Error("trophies.json: " + r.status); return r.json(); })
    .then(function (data) {
      trophies = data.trophies || data;
      applyShotPreset();
      renderAll();
    })
    .catch(function (err) {
      emptyEl.textContent = "The trophy list could not be loaded (" + err.message + "). Reload the page.";
      emptyEl.hidden = false;
    });
})();
