(function () {
  "use strict";

  const STORAGE_KEY = "gta6_decoded_tracker_v1";
  const THEME_KEY = "gta6_decoded_theme_v1";
  const RING_CIRCUMFERENCE = 2 * Math.PI * 38;

  const DATA = window.GTA6_DATA;
  const CONFIG = window.GTA6_CONFIG;

  const CATEGORY_ICONS = {
    "easter-eggs": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/></svg>`,
    "locations": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    "vehicles": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 17h14v-5l-2-5H7l-2 5v5z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg>`,
    "weapons": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
    "characters": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    "money": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
  };

  const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

  const DEFAULT_STATE = {
    completedIds: [],
    notes: {},
    cash: 25000,
    heistTake: 1200000,
    heistSplits: [
      { role: "Leader (Lucia)", pct: 40 },
      { role: "Driver (Jason)", pct: 25 },
      { role: "Hacker", pct: 20 },
      { role: "Lookout", pct: 15 }
    ]
  };

  let state = loadState();
  let activeView = "map";
  let checklistMode = "list";
  let filters = {
    search: "",
    category: "all",
    source: "all",
    region: "all",
    status: "all"
  };

  // MapGenie-style multi-layer state
  let mapLayers = Object.fromEntries(DATA.categories.map((c) => [c.id, true]));
  let mapSearch = "";
  let mapSource = "all";
  let mapHideCompleted = false;
  let mapZoom = 1;
  let mapPanX = 0;
  let mapPanY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let selectedPinId = DATA.items[0] ? DATA.items[0].id : null;
  let activeDetailId = null;
  let toastTimer = null;

  const el = {
    brandNameText: document.getElementById("brandNameText"),
    brandSubText: document.getElementById("brandSubText"),
    footerVersionText: document.getElementById("footerVersionText"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    heroCopyBtn: document.getElementById("heroCopyBtn"),
    heroJumpChecklistBtn: document.getElementById("heroJumpChecklistBtn"),
    kpiDoneCount: document.getElementById("kpiDoneCount"),
    kpiPercent: document.getElementById("kpiPercent"),
    ringProgressCircle: document.getElementById("ringProgressCircle"),
    hudCatSummary: document.getElementById("hudCatSummary"),
    categoryStrip: document.getElementById("categoryStrip"),

    mapVisibleCountTag: document.getElementById("mapVisibleCountTag"),
    mapSearchInput: document.getElementById("mapSearchInput"),
    mapShowAllBtn: document.getElementById("mapShowAllBtn"),
    mapHideAllBtn: document.getElementById("mapHideAllBtn"),
    mapLayerList: document.getElementById("mapLayerList"),
    mapHideCompletedToggle: document.getElementById("mapHideCompletedToggle"),
    mapSourceSelect: document.getElementById("mapSourceSelect"),
    mapViewport: document.getElementById("mapViewport"),
    mapCanvas: document.getElementById("mapCanvas"),
    mapRegionLabels: document.getElementById("mapRegionLabels"),
    mapPinsLayer: document.getElementById("mapPinsLayer"),
    mapInspectorBar: document.getElementById("mapInspectorBar"),
    mapZoomInBtn: document.getElementById("mapZoomInBtn"),
    mapZoomOutBtn: document.getElementById("mapZoomOutBtn"),
    mapZoomResetBtn: document.getElementById("mapZoomResetBtn"),

    searchInput: document.getElementById("searchInput"),
    categorySelect: document.getElementById("categorySelect"),
    sourceSelect: document.getElementById("sourceSelect"),
    regionSelect: document.getElementById("regionSelect"),
    statusSelect: document.getElementById("statusSelect"),
    resultCountText: document.getElementById("resultCountText"),
    viewListBtn: document.getElementById("viewListBtn"),
    viewGridBtn: document.getElementById("viewGridBtn"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    checklistContainer: document.getElementById("checklistContainer"),
    emptyStateBox: document.getElementById("emptyStateBox"),

    cashInput: document.getElementById("cashInput"),
    milestoneList: document.getElementById("milestoneList"),
    heistTakeInput: document.getElementById("heistTakeInput"),
    heistPlayersContainer: document.getElementById("heistPlayersContainer"),
    heistWarning: document.getElementById("heistWarning"),

    affiliateGrid: document.getElementById("affiliateGrid"),
    socialLinksContainer: document.getElementById("socialLinksContainer"),
    supportDescText: document.getElementById("supportDescText"),

    detailModal: document.getElementById("detailModal"),
    detailModalTitle: document.getElementById("detailModalTitle"),
    detailModalBadges: document.getElementById("detailModalBadges"),
    detailModalSummary: document.getElementById("detailModalSummary"),
    detailModalTip: document.getElementById("detailModalTip"),
    detailNoteInput: document.getElementById("detailNoteInput"),
    detailModalClose: document.getElementById("detailModalClose"),
    detailShowOnMapBtn: document.getElementById("detailShowOnMapBtn"),
    detailToggleDoneBtn: document.getElementById("detailToggleDoneBtn"),

    backupOpenBtn: document.getElementById("backupOpenBtn"),
    backupModal: document.getElementById("backupModal"),
    backupModalClose: document.getElementById("backupModalClose"),
    backupDoneBtn: document.getElementById("backupDoneBtn"),
    exportJsonBtn: document.getElementById("exportJsonBtn"),
    importJsonInput: document.getElementById("importJsonInput"),
    backupFeedback: document.getElementById("backupFeedback"),
    resetAllDataBtn: document.getElementById("resetAllDataBtn"),

    toastBox: document.getElementById("toastBox")
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
        notes: parsed.notes && typeof parsed.notes === "object" ? parsed.notes : {},
        cash: typeof parsed.cash === "number" ? parsed.cash : DEFAULT_STATE.cash,
        heistTake: typeof parsed.heistTake === "number" ? parsed.heistTake : DEFAULT_STATE.heistTake,
        heistSplits: Array.isArray(parsed.heistSplits) && parsed.heistSplits.length === 4
          ? parsed.heistSplits
          : structuredClone(DEFAULT_STATE.heistSplits)
      };
    } catch (_err) {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_err) {
      showToast("Storage full: progress kept for this session only.");
    }
  }

  function showToast(message) {
    el.toastBox.textContent = message;
    el.toastBox.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toastBox.hidden = true;
    }, 2800);
  }

  function formatUSD(amount) {
    return "$" + Math.round(amount).toLocaleString("en-US");
  }

  function getCategory(catId) {
    return DATA.categories.find((c) => c.id === catId) || { id: catId, shortLabel: catId, color: "#F2545B" };
  }

  function getRegionLabel(regId) {
    const found = DATA.regions.find((r) => r.id === regId);
    return found ? found.label : regId;
  }

  function isCompleted(id) {
    return state.completedIds.includes(id);
  }

  function toggleCompleted(id) {
    const idx = state.completedIds.indexOf(id);
    if (idx === -1) {
      state.completedIds.push(id);
    } else {
      state.completedIds.splice(idx, 1);
    }
    saveState();
    renderAll();
  }

  /* Theme */
  function initTheme() {
    applyTheme(localStorage.getItem(THEME_KEY) || "dark");
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    el.themeToggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  /* Views */
  function switchView(viewName) {
    activeView = viewName;
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.dataset.view === viewName));
    });
    document.querySelectorAll(".view-panel").forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + viewName;
    });
  }

  function initControls() {
    el.brandNameText.textContent = CONFIG.brand.name;
    el.brandSubText.textContent = CONFIG.brand.subtitle;
    el.footerVersionText.textContent = `v2.0 (Leonida Tactical) | Updated ${CONFIG.brand.lastUpdated}`;

    el.categorySelect.innerHTML = `<option value="all">All Categories</option>` +
      DATA.categories.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");

    el.regionSelect.innerHTML = `<option value="all">All Regions</option>` +
      DATA.regions.map((r) => `<option value="${r.id}">${r.label}</option>`).join("");

    el.mapRegionLabels.innerHTML = DATA.regions.map((r) =>
      `<span class="map-region-tag" style="left:${r.mapX}%; top:${r.mapY}%;">${r.label}</span>`
    ).join("");

    el.cashInput.value = state.cash;
    el.heistTakeInput.value = state.heistTake;

    renderMonetization();
  }

  /* Overview HUD + Category Strip */
  function renderOverview() {
    const total = DATA.items.length;
    const done = state.completedIds.filter((id) => DATA.items.some((i) => i.id === id)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    el.kpiDoneCount.textContent = `${done} / ${total}`;
    el.kpiPercent.textContent = `${pct}%`;
    const offset = RING_CIRCUMFERENCE - (pct / 100) * RING_CIRCUMFERENCE;
    el.ringProgressCircle.style.strokeDashoffset = String(offset);

    el.hudCatSummary.innerHTML = DATA.categories.map((cat) => {
      const catItems = DATA.items.filter((i) => i.category === cat.id);
      const catDone = catItems.filter((i) => isCompleted(i.id)).length;
      return `
        <div class="hud-mini-stat">
          <span><span class="hud-dot" style="background:${cat.color};"></span>${cat.shortLabel}</span>
          <strong class="tabular">${catDone}/${catItems.length}</strong>
        </div>
      `;
    }).join("");

    el.categoryStrip.innerHTML = DATA.categories.map((cat) => {
      const catItems = DATA.items.filter((i) => i.category === cat.id);
      const catDone = catItems.filter((i) => isCompleted(i.id)).length;
      const isActive = filters.category === cat.id && activeView === "checklist";
      return `
        <button type="button" class="cat-card-btn ${isActive ? "active" : ""}" data-quick-cat="${cat.id}">
          <span class="cat-icon-box" style="background:${cat.color};">${CATEGORY_ICONS[cat.id] || ""}</span>
          <span class="cat-card-info">
            <span class="cat-card-name">${cat.shortLabel}</span>
            <span class="cat-card-count tabular">${catDone} / ${catItems.length}</span>
          </span>
        </button>
      `;
    }).join("");
  }

  /* MapGenie-style Interactive Map */
  function applyMapTransform() {
    el.mapCanvas.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapZoom})`;
    el.mapZoomResetBtn.textContent = `${Math.round(mapZoom * 100)}%`;
  }

  function renderMap() {
    el.mapLayerList.innerHTML = DATA.categories.map((cat) => {
      const catItems = DATA.items.filter((i) => i.category === cat.id);
      const catDone = catItems.filter((i) => isCompleted(i.id)).length;
      const on = Boolean(mapLayers[cat.id]);
      return `
        <button type="button" class="layer-btn ${on ? "" : "is-off"}" data-layer-id="${cat.id}" aria-pressed="${on}">
          <span class="layer-left">
            <span class="layer-swatch" style="background:${cat.color};">${CATEGORY_ICONS[cat.id] || ""}</span>
            <span>${cat.shortLabel}</span>
          </span>
          <span class="tabular" style="color:var(--text-muted);">${catDone}/${catItems.length}</span>
        </button>
      `;
    }).join("");

    const q = mapSearch.trim().toLowerCase();
    const visiblePins = DATA.items.filter((item) => {
      if (!mapLayers[item.category]) return false;
      if (mapSource !== "all" && item.source !== mapSource) return false;
      if (mapHideCompleted && isCompleted(item.id)) return false;
      if (q) {
        const hay = `${item.title} ${item.summary} ${getRegionLabel(item.region)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    el.mapVisibleCountTag.textContent = `${visiblePins.length} pins`;

    el.mapPinsLayer.innerHTML = visiblePins.map((item) => {
      const cat = getCategory(item.category);
      const done = isCompleted(item.id);
      const selected = selectedPinId === item.id;
      return `
        <button type="button"
                class="map-pin ${done ? "is-done" : ""} ${selected ? "is-selected" : ""}"
                style="left:${item.x}%; top:${item.y}%; background:${done ? "#10B981" : cat.color};"
                data-pin-id="${item.id}"
                title="${item.title}"
                aria-label="${item.title} (${getRegionLabel(item.region)})">
          ${done ? CHECK_ICON : (CATEGORY_ICONS[item.category] || "")}
        </button>
      `;
    }).join("");

    applyMapTransform();
    renderMapInspector();
  }

  function renderMapInspector() {
    const item = DATA.items.find((i) => i.id === selectedPinId);
    if (!item) return;

    const done = isCompleted(item.id);
    const cat = getCategory(item.category);
    const sourceBadge = item.source === "confirmed"
      ? `<span class="tag tag-confirmed">Confirmed</span>`
      : `<span class="tag tag-rumor">Community / Rumor</span>`;

    el.mapInspectorBar.innerHTML = `
      <div class="inspector-grid">
        <div style="min-width:0; flex:1;">
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap; align-items:center;">
            ${sourceBadge}
            <span class="tag tag-neutral">${cat.shortLabel}</span>
            <span class="tag tag-neutral">${getRegionLabel(item.region)}</span>
            <span class="tag tag-neutral">${item.reward}</span>
          </div>
          <h3 class="inspector-title">${item.title}</h3>
          <p style="margin:0 0 0.4rem; color:var(--text-secondary); font-size:0.88rem;">${item.summary}</p>
          <p style="margin:0; font-size:0.84rem;"><strong style="color:var(--accent-coral);">Field Tip:</strong> ${item.tip}</p>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:0.45rem; flex-shrink:0;">
          <button type="button" class="btn ${done ? "btn-teal" : "btn-primary"}" data-toggle-id="${item.id}">
            ${done ? "Completed (Undo)" : "Mark Complete"}
          </button>
          <button type="button" class="btn" data-open-detail="${item.id}">Note &amp; Details</button>
        </div>
      </div>
    `;
  }

  /* GTABase-style Checklist */
  function getFilteredItems() {
    const q = filters.search.trim().toLowerCase();
    return DATA.items.filter((item) => {
      if (filters.category !== "all" && item.category !== filters.category) return false;
      if (filters.source !== "all" && item.source !== filters.source) return false;
      if (filters.region !== "all" && item.region !== filters.region) return false;
      const done = isCompleted(item.id);
      if (filters.status === "done" && !done) return false;
      if (filters.status === "remaining" && done) return false;
      if (q) {
        const hay = `${item.title} ${item.summary} ${item.tip} ${getRegionLabel(item.region)} ${item.reward}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderChecklist() {
    const items = getFilteredItems();
    el.resultCountText.textContent = `Showing ${items.length} of ${DATA.items.length} entries`;
    el.checklistContainer.classList.toggle("is-grid", checklistMode === "grid");
    el.viewListBtn.setAttribute("aria-pressed", String(checklistMode === "list"));
    el.viewGridBtn.setAttribute("aria-pressed", String(checklistMode === "grid"));

    if (items.length === 0) {
      el.checklistContainer.innerHTML = "";
      el.emptyStateBox.hidden = false;
      return;
    }

    el.emptyStateBox.hidden = true;
    el.checklistContainer.innerHTML = items.map((item) => {
      const done = isCompleted(item.id);
      const cat = getCategory(item.category);
      const hasNote = Boolean(state.notes[item.id] && state.notes[item.id].trim());
      const sourceBadge = item.source === "confirmed"
        ? `<span class="tag tag-confirmed">Confirmed</span>`
        : `<span class="tag tag-rumor">Community / Rumor</span>`;

      return `
        <li class="check-row ${done ? "is-done" : ""}" style="--row-accent:${cat.color};">
          <button type="button" class="check-toggle" data-toggle-id="${item.id}" aria-pressed="${done}" aria-label="${done ? "Unmark" : "Mark"} ${item.title} complete">
            ${done ? CHECK_ICON : ""}
          </button>
          <div class="check-body">
            <div class="check-head">
              <h3 class="check-title">${item.title}</h3>
              ${sourceBadge}
              <span class="tag tag-neutral">${cat.shortLabel}</span>
              ${hasNote ? `<span class="tag tag-neutral">Note saved</span>` : ""}
            </div>
            <p class="check-summary">${item.summary}</p>
            <div class="check-meta">
              <span>Region: <strong>${getRegionLabel(item.region)}</strong></span>
              <span>|</span>
              <span>Value: <strong>${item.reward}</strong></span>
            </div>
          </div>
          <div class="check-actions">
            <button type="button" class="btn btn-sm" data-open-detail="${item.id}">Details &amp; Tip</button>
            <button type="button" class="btn btn-sm" data-jump-map="${item.id}">Locate Pin</button>
          </div>
        </li>
      `;
    }).join("");
  }

  /* Money & Heist Planner */
  function renderMoneyView() {
    const cash = Math.max(0, Number(state.cash) || 0);
    el.milestoneList.innerHTML = DATA.moneyMilestones.map((ms) => {
      const pct = Math.min(100, Math.round((cash / ms.target) * 100));
      const reached = cash >= ms.target;
      return `
        <div class="milestone-item">
          <div class="milestone-top">
            <span>${ms.title}</span>
            <span class="tabular" style="color:${reached ? "var(--accent-teal)" : "var(--text-primary)"};">
              ${formatUSD(ms.target)} (${pct}%)
            </span>
          </div>
          <p style="margin:0.2rem 0 0.45rem; font-size:0.82rem; color:var(--text-secondary);">${ms.note}</p>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width:${pct}%;"></div>
          </div>
        </div>
      `;
    }).join("");

    const take = Math.max(0, Number(state.heistTake) || 0);
    const totalPct = state.heistSplits.reduce((sum, p) => sum + Number(p.pct), 0);

    el.heistPlayersContainer.innerHTML = state.heistSplits.map((player, index) => {
      const payout = (take * player.pct) / 100;
      return `
        <div class="heist-row">
          <label for="splitRange-${index}" style="font-weight:700; font-size:0.88rem;">${player.role}</label>
          <span class="tabular" style="font-weight:700; color:var(--accent-teal);">${player.pct}% (${formatUSD(payout)})</span>
          <input type="range" id="splitRange-${index}" min="0" max="100" step="5" value="${player.pct}" data-split-index="${index}">
        </div>
      `;
    }).join("");

    if (totalPct !== 100) {
      el.heistWarning.hidden = false;
      el.heistWarning.textContent = `Total crew split is ${totalPct}%. Adjust sliders so all four cuts add up to 100%.`;
    } else {
      el.heistWarning.hidden = true;
    }
  }

  /* Config-Driven Ecosystem & Monetization */
  function renderMonetization() {
    el.affiliateGrid.innerHTML = CONFIG.affiliates.map((item) => {
      const hasUrl = Boolean(item.url && item.url.trim());
      const actionHtml = hasUrl
        ? `<a class="btn btn-primary btn-sm" href="${item.url}" target="_blank" rel="noopener noreferrer sponsored">${item.ctaLabel}</a>`
        : `<button type="button" class="btn btn-sm" disabled title="Configure URL in config.js">Link Coming Soon</button>`;

      return `
        <article class="gear-card">
          <div>
            <span class="tag tag-neutral">${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
          </div>
          <div>${actionHtml}</div>
        </article>
      `;
    }).join("");

    el.supportDescText.textContent = CONFIG.support.buyMeACoffee.description;

    const links = [
      { ...CONFIG.social.youtubeMain, primary: true },
      { ...CONFIG.social.fbDecoded, primary: false },
      { ...CONFIG.social.fbLootGuides, primary: false },
      { ...CONFIG.support.buyMeACoffee, primary: false }
    ];

    el.socialLinksContainer.innerHTML = links.map((link) => {
      const hasUrl = Boolean(link.url && link.url.trim());
      if (hasUrl) {
        return `<a class="btn btn-sm ${link.primary ? "btn-primary" : ""}" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`;
      }
      return `<button type="button" class="btn btn-sm" disabled title="Add URL in config.js">${link.label} (Soon)</button>`;
    }).join("");
  }

  /* Modals */
  function openDetailModal(id) {
    const item = DATA.items.find((i) => i.id === id);
    if (!item) return;
    activeDetailId = id;

    const done = isCompleted(id);
    const cat = getCategory(item.category);
    const sourceBadge = item.source === "confirmed"
      ? `<span class="tag tag-confirmed">Confirmed</span>`
      : `<span class="tag tag-rumor">Community / Rumor</span>`;

    el.detailModalBadges.innerHTML = `${sourceBadge}<span class="tag tag-neutral">${cat.shortLabel}</span><span class="tag tag-neutral">${getRegionLabel(item.region)}</span>`;
    el.detailModalTitle.textContent = item.title;
    el.detailModalSummary.textContent = item.summary;
    el.detailModalTip.textContent = item.tip;
    el.detailNoteInput.value = state.notes[id] || "";
    el.detailToggleDoneBtn.textContent = done ? "Completed (Mark Remaining)" : "Mark Complete";

    el.detailModal.hidden = false;
    el.detailModalClose.focus();
  }

  function closeDetailModal() {
    el.detailModal.hidden = true;
    activeDetailId = null;
  }

  function openBackupModal() {
    el.backupFeedback.hidden = true;
    el.backupModal.hidden = false;
    el.backupModalClose.focus();
  }

  function closeBackupModal() {
    el.backupModal.hidden = true;
  }

  function exportBackup() {
    const payload = {
      app: "GTA 6 Decoded 100% Tracker",
      exportedAt: new Date().toISOString(),
      state
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta6-decoded-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast("Backup JSON downloaded.");
  }

  function importBackupFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming = parsed.state || parsed;
        if (!Array.isArray(incoming.completedIds)) throw new Error("Invalid format");
        state = { ...structuredClone(DEFAULT_STATE), ...incoming };
        saveState();
        el.cashInput.value = state.cash;
        el.heistTakeInput.value = state.heistTake;
        renderAll();
        el.backupFeedback.hidden = false;
        el.backupFeedback.textContent = `Restored ${state.completedIds.length} completed entries successfully.`;
        showToast("Progress restored from backup.");
      } catch (_err) {
        el.backupFeedback.hidden = false;
        el.backupFeedback.textContent = "Could not import file. Make sure it is a valid GTA 6 Tracker JSON backup.";
      }
    };
    reader.readAsText(file);
  }

  function copyProgressCard() {
    const total = DATA.items.length;
    const done = state.completedIds.length;
    const pct = Math.round((done / total) * 100);
    const lines = [
      `GTA 6 Decoded 100% Progress: ${done}/${total} (${pct}%)`,
      ...DATA.categories.map((cat) => {
        const list = DATA.items.filter((i) => i.category === cat.id);
        const cDone = list.filter((i) => isCompleted(i.id)).length;
        return `- ${cat.shortLabel}: ${cDone}/${list.length}`;
      }),
      `Track your run at GTA 6 Decoded`
    ].join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lines).then(() => {
        showToast("Progress card copied! Paste it in YouTube comments.");
      }).catch(() => {
        showToast("Progress: " + pct + "% complete.");
      });
    } else {
      showToast("Progress: " + pct + "% complete.");
    }
  }

  function resetFilters() {
    filters = { search: "", category: "all", source: "all", region: "all", status: "all" };
    el.searchInput.value = "";
    el.categorySelect.value = "all";
    el.sourceSelect.value = "all";
    el.regionSelect.value = "all";
    el.statusSelect.value = "all";
    renderOverview();
    renderChecklist();
  }

  function renderAll() {
    renderOverview();
    renderMap();
    renderChecklist();
    renderMoneyView();
  }

  /* Events */
  function bindEvents() {
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    el.themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });

    el.heroCopyBtn.addEventListener("click", copyProgressCard);
    el.heroJumpChecklistBtn.addEventListener("click", () => {
      switchView("checklist");
      document.getElementById("panel-checklist").scrollIntoView({ behavior: "smooth" });
    });

    el.categoryStrip.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quick-cat]");
      if (!btn) return;
      const catId = btn.dataset.quickCat;
      if (activeView === "map") {
        const allOthersOff = DATA.categories.every((c) => c.id === catId ? mapLayers[c.id] : !mapLayers[c.id]);
        if (allOthersOff) {
          DATA.categories.forEach((c) => { mapLayers[c.id] = true; });
        } else {
          DATA.categories.forEach((c) => { mapLayers[c.id] = c.id === catId; });
        }
        renderMap();
      } else {
        filters.category = filters.category === catId ? "all" : catId;
        el.categorySelect.value = filters.category;
        switchView("checklist");
        renderOverview();
        renderChecklist();
      }
    });

    /* Map Controls */
    el.mapSearchInput.addEventListener("input", (e) => {
      mapSearch = e.target.value;
      renderMap();
    });

    el.mapShowAllBtn.addEventListener("click", () => {
      DATA.categories.forEach((c) => { mapLayers[c.id] = true; });
      renderMap();
    });

    el.mapHideAllBtn.addEventListener("click", () => {
      DATA.categories.forEach((c) => { mapLayers[c.id] = false; });
      renderMap();
    });

    el.mapHideCompletedToggle.addEventListener("change", (e) => {
      mapHideCompleted = e.target.checked;
      renderMap();
    });

    el.mapSourceSelect.addEventListener("change", (e) => {
      mapSource = e.target.value;
      renderMap();
    });

    el.mapZoomInBtn.addEventListener("click", () => {
      mapZoom = Math.min(2.25, +(mapZoom + 0.25).toFixed(2));
      applyMapTransform();
    });

    el.mapZoomOutBtn.addEventListener("click", () => {
      mapZoom = Math.max(1, +(mapZoom - 0.25).toFixed(2));
      if (mapZoom === 1) { mapPanX = 0; mapPanY = 0; }
      applyMapTransform();
    });

    el.mapZoomResetBtn.addEventListener("click", () => {
      mapZoom = 1;
      mapPanX = 0;
      mapPanY = 0;
      applyMapTransform();
    });

    /* Drag-to-Pan Map */
    el.mapViewport.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".map-pin")) return;
      if (mapZoom <= 1) return;
      isDragging = true;
      dragStartX = e.clientX - mapPanX;
      dragStartY = e.clientY - mapPanY;
      el.mapViewport.classList.add("is-dragging");
      el.mapViewport.setPointerCapture(e.pointerId);
    });

    el.mapViewport.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const maxOffset = (mapZoom - 1) * 320;
      mapPanX = Math.max(-maxOffset, Math.min(maxOffset, e.clientX - dragStartX));
      mapPanY = Math.max(-maxOffset, Math.min(maxOffset, e.clientY - dragStartY));
      applyMapTransform();
    });

    el.mapViewport.addEventListener("pointerup", () => {
      isDragging = false;
      el.mapViewport.classList.remove("is-dragging");
    });

    /* Checklist Controls */
    el.searchInput.addEventListener("input", (e) => {
      filters.search = e.target.value;
      renderChecklist();
    });
    el.categorySelect.addEventListener("change", (e) => {
      filters.category = e.target.value;
      renderOverview();
      renderChecklist();
    });
    el.sourceSelect.addEventListener("change", (e) => {
      filters.source = e.target.value;
      renderChecklist();
    });
    el.regionSelect.addEventListener("change", (e) => {
      filters.region = e.target.value;
      renderChecklist();
    });
    el.statusSelect.addEventListener("change", (e) => {
      filters.status = e.target.value;
      renderChecklist();
    });
    el.viewListBtn.addEventListener("click", () => {
      checklistMode = "list";
      renderChecklist();
    });
    el.viewGridBtn.addEventListener("click", () => {
      checklistMode = "grid";
      renderChecklist();
    });
    el.resetFiltersBtn.addEventListener("click", resetFilters);
    el.emptyResetBtn.addEventListener("click", resetFilters);

    /* Delegated Clicks */
    document.addEventListener("click", (e) => {
      const layerBtn = e.target.closest("[data-layer-id]");
      if (layerBtn) {
        const id = layerBtn.dataset.layerId;
        mapLayers[id] = !mapLayers[id];
        renderMap();
        return;
      }

      const toggleBtn = e.target.closest("[data-toggle-id]");
      if (toggleBtn) {
        toggleCompleted(toggleBtn.dataset.toggleId);
        return;
      }

      const detailBtn = e.target.closest("[data-open-detail]");
      if (detailBtn) {
        openDetailModal(detailBtn.dataset.openDetail);
        return;
      }

      const jumpMapBtn = e.target.closest("[data-jump-map]");
      if (jumpMapBtn) {
        const id = jumpMapBtn.dataset.jumpMap;
        selectedPinId = id;
        DATA.categories.forEach((c) => { mapLayers[c.id] = true; });
        mapHideCompleted = false;
        el.mapHideCompletedToggle.checked = false;
        switchView("map");
        renderMap();
        document.getElementById("panel-map").scrollIntoView({ behavior: "smooth" });
        return;
      }

      const pinBtn = e.target.closest("[data-pin-id]");
      if (pinBtn) {
        selectedPinId = pinBtn.dataset.pinId;
        renderMap();
        return;
      }

      const addCashBtn = e.target.closest("[data-add-cash]");
      if (addCashBtn) {
        state.cash = Math.max(0, Number(state.cash || 0) + Number(addCashBtn.dataset.addCash));
        el.cashInput.value = state.cash;
        saveState();
        renderMoneyView();
        return;
      }

      const presetBtn = e.target.closest("[data-split-preset]");
      if (presetBtn) {
        const parts = presetBtn.dataset.splitPreset.split(",").map(Number);
        state.heistSplits.forEach((p, i) => { p.pct = parts[i]; });
        saveState();
        renderMoneyView();
      }
    });

    /* Money Inputs */
    el.cashInput.addEventListener("input", (e) => {
      state.cash = Math.max(0, Number(e.target.value) || 0);
      saveState();
      renderMoneyView();
    });

    el.heistTakeInput.addEventListener("input", (e) => {
      state.heistTake = Math.max(0, Number(e.target.value) || 0);
      saveState();
      renderMoneyView();
    });

    el.heistPlayersContainer.addEventListener("input", (e) => {
      const idx = e.target.dataset.splitIndex;
      if (idx === undefined) return;
      state.heistSplits[Number(idx)].pct = Number(e.target.value);
      saveState();
      renderMoneyView();
    });

    /* Modals */
    el.detailNoteInput.addEventListener("input", (e) => {
      if (!activeDetailId) return;
      state.notes[activeDetailId] = e.target.value;
      saveState();
      renderChecklist();
    });

    el.detailModalClose.addEventListener("click", closeDetailModal);
    el.detailModal.addEventListener("click", (e) => {
      if (e.target === el.detailModal) closeDetailModal();
    });

    el.detailToggleDoneBtn.addEventListener("click", () => {
      if (!activeDetailId) return;
      toggleCompleted(activeDetailId);
      openDetailModal(activeDetailId);
    });

    el.detailShowOnMapBtn.addEventListener("click", () => {
      if (!activeDetailId) return;
      selectedPinId = activeDetailId;
      DATA.categories.forEach((c) => { mapLayers[c.id] = true; });
      closeDetailModal();
      switchView("map");
      renderMap();
    });

    el.backupOpenBtn.addEventListener("click", openBackupModal);
    el.backupModalClose.addEventListener("click", closeBackupModal);
    el.backupDoneBtn.addEventListener("click", closeBackupModal);
    el.backupModal.addEventListener("click", (e) => {
      if (e.target === el.backupModal) closeBackupModal();
    });

    el.exportJsonBtn.addEventListener("click", exportBackup);
    el.importJsonInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        importBackupFile(e.target.files[0]);
        e.target.value = "";
      }
    });

    el.resetAllDataBtn.addEventListener("click", () => {
      if (window.confirm("Reset all GTA 6 checklist progress and notes? This cannot be undone.")) {
        state = structuredClone(DEFAULT_STATE);
        saveState();
        el.cashInput.value = state.cash;
        el.heistTakeInput.value = state.heistTake;
        renderAll();
        closeBackupModal();
        showToast("All progress reset.");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!el.detailModal.hidden) closeDetailModal();
        if (!el.backupModal.hidden) closeBackupModal();
      }
    });

    /* V13 GoatCounter CTA & outbound Edge/Gumroad click tracking */
    const fireGcEvent = (slug, title) => {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        const site = (location.pathname.split("/")[1] || location.hostname || "gta6-decoded-tracker").slice(0, 40);
        window.goatcounter.count({ path: "click/" + site + "/" + slug, title: title, event: true });
      }
    };
    const heroCopy = document.getElementById("heroCopyBtn");
    if (heroCopy) heroCopy.addEventListener("click", () => fireGcEvent("copy-progress-card", "SP01 Copy Progress Card"));
    const heroBrowse = document.getElementById("heroJumpChecklistBtn");
    if (heroBrowse) heroBrowse.addEventListener("click", () => fireGcEvent("browse-40-entries", "SP01 Browse 40 Entries"));
    document.addEventListener("click", (ev) => {
      const a = ev.target && ev.target.closest ? ev.target.closest('a[href*="microsoftedge.microsoft.com"]') : null;
      if (a) fireGcEvent("edge-store", "SP01 Edge Store click");
    }, true);
  }

  initTheme();
  initControls();
  bindEvents();
  renderAll();
})();
