(function () {
  "use strict";

  const STORAGE_KEY = "gta6_decoded_tracker_v1";
  const THEME_KEY = "gta6_decoded_theme_v1";

  const DATA = window.GTA6_DATA;
  const CONFIG = window.GTA6_CONFIG;

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
  let activeView = "checklist";
  let filters = {
    search: "",
    category: "all",
    source: "all",
    region: "all",
    status: "all"
  };
  let mapCategory = "all";
  let mapZoom = 1;
  let selectedPinId = null;
  let activeDetailId = null;
  let toastTimer = null;

  const el = {
    brandNameText: document.getElementById("brandNameText"),
    brandSubText: document.getElementById("brandSubText"),
    footerVersionText: document.getElementById("footerVersionText"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    copyShareBtn: document.getElementById("copyShareBtn"),
    kpiDoneCount: document.getElementById("kpiDoneCount"),
    kpiPercent: document.getElementById("kpiPercent"),
    overallProgressBar: document.getElementById("overallProgressBar"),
    overallProgressFill: document.getElementById("overallProgressFill"),
    categoryMiniGrid: document.getElementById("categoryMiniGrid"),

    searchInput: document.getElementById("searchInput"),
    categorySelect: document.getElementById("categorySelect"),
    sourceSelect: document.getElementById("sourceSelect"),
    regionSelect: document.getElementById("regionSelect"),
    statusSelect: document.getElementById("statusSelect"),
    resultCountText: document.getElementById("resultCountText"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    checklistContainer: document.getElementById("checklistContainer"),
    emptyStateBox: document.getElementById("emptyStateBox"),

    mapFilterPills: document.getElementById("mapFilterPills"),
    mapPinsLayer: document.getElementById("mapPinsLayer"),
    mapCanvas: document.getElementById("mapCanvas"),
    mapInspectorContent: document.getElementById("mapInspectorContent"),
    mapZoomInBtn: document.getElementById("mapZoomInBtn"),
    mapZoomOutBtn: document.getElementById("mapZoomOutBtn"),
    mapZoomResetBtn: document.getElementById("mapZoomResetBtn"),

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

  function getCategoryLabel(catId) {
    const found = DATA.categories.find((c) => c.id === catId);
    return found ? found.shortLabel : catId;
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
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(saved);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    el.themeToggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  /* View Tabs */
  function switchView(viewName) {
    activeView = viewName;
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      const isSelected = btn.dataset.view === viewName;
      btn.setAttribute("aria-selected", String(isSelected));
    });
    document.querySelectorAll(".view-panel").forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + viewName;
    });
  }

  /* Populate static dropdowns & config-driven sections */
  function initControls() {
    el.brandNameText.textContent = CONFIG.brand.name;
    el.brandSubText.textContent = CONFIG.brand.subtitle;
    el.footerVersionText.textContent = `${CONFIG.brand.version} | Updated ${CONFIG.brand.lastUpdated}`;

    el.categorySelect.innerHTML = `<option value="all">All Categories</option>` +
      DATA.categories.map((c) => `<option value="${c.id}">${c.label}</option>`).join("");

    el.regionSelect.innerHTML = `<option value="all">All Regions</option>` +
      DATA.regions.map((r) => `<option value="${r.id}">${r.label}</option>`).join("");

    el.cashInput.value = state.cash;
    el.heistTakeInput.value = state.heistTake;

    renderMonetization();
  }

  /* Render Overview KPIs & Category Mini-Grid */
  function renderOverview() {
    const total = DATA.items.length;
    const done = state.completedIds.filter((id) => DATA.items.some((i) => i.id === id)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    el.kpiDoneCount.textContent = `${done} / ${total}`;
    el.kpiPercent.textContent = `${pct}%`;
    el.overallProgressBar.setAttribute("aria-valuenow", String(pct));
    el.overallProgressFill.style.width = `${pct}%`;

    el.categoryMiniGrid.innerHTML = DATA.categories.map((cat) => {
      const catItems = DATA.items.filter((i) => i.category === cat.id);
      const catDone = catItems.filter((i) => isCompleted(i.id)).length;
      const isActive = filters.category === cat.id && activeView === "checklist";
      return `
        <button type="button" class="cat-mini-btn ${isActive ? "active" : ""}" data-quick-cat="${cat.id}">
          <span class="cat-mini-name">${cat.shortLabel}</span>
          <span class="cat-mini-count tabular">${catDone}/${catItems.length}</span>
        </button>
      `;
    }).join("");
  }

  /* Render Checklist */
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

    if (items.length === 0) {
      el.checklistContainer.innerHTML = "";
      el.emptyStateBox.hidden = false;
      return;
    }

    el.emptyStateBox.hidden = true;
    el.checklistContainer.innerHTML = items.map((item) => {
      const done = isCompleted(item.id);
      const hasNote = Boolean(state.notes[item.id] && state.notes[item.id].trim());
      const sourceBadge = item.source === "confirmed"
        ? `<span class="tag tag-confirmed">Confirmed</span>`
        : `<span class="tag tag-rumor">Community / Rumor</span>`;

      return `
        <li class="check-row ${done ? "is-done" : ""}">
          <button type="button" class="check-toggle" data-toggle-id="${item.id}" aria-pressed="${done}" aria-label="${done ? "Unmark" : "Mark"} ${item.title} complete">
            ${done ? "&#10003;" : ""}
          </button>
          <div class="check-body">
            <div class="check-head">
              <h3 class="check-title">${item.title}</h3>
              ${sourceBadge}
              <span class="tag tag-neutral">${getCategoryLabel(item.category)}</span>
              ${hasNote ? `<span class="tag tag-neutral">Note saved</span>` : ""}
            </div>
            <p class="check-summary">${item.summary}</p>
            <div class="check-meta">
              <span>Region: <strong>${getRegionLabel(item.region)}</strong></span>
              <span>|</span>
              <span>Reward: <strong>${item.reward}</strong></span>
            </div>
          </div>
          <div class="check-actions">
            <button type="button" class="btn btn-sm" data-open-detail="${item.id}">Details &amp; Tip</button>
            <button type="button" class="btn btn-sm" data-jump-map="${item.id}">Map Pin</button>
          </div>
        </li>
      `;
    }).join("");
  }

  /* Render Interactive Map */
  function renderMap() {
    const pillCategories = [{ id: "all", shortLabel: "All Pins" }, ...DATA.categories];
    el.mapFilterPills.innerHTML = pillCategories.map((cat) => {
      const active = mapCategory === cat.id;
      return `
        <button type="button" class="btn btn-sm ${active ? "btn-primary" : ""}" data-map-cat="${cat.id}">
          ${cat.shortLabel}
        </button>
      `;
    }).join("");

    const visiblePins = DATA.items.filter((i) => mapCategory === "all" || i.category === mapCategory);
    el.mapPinsLayer.innerHTML = visiblePins.map((item, idx) => {
      const done = isCompleted(item.id);
      const selected = selectedPinId === item.id;
      const cls = [
        "map-pin",
        done ? "is-done" : "",
        item.source === "rumor" ? "is-rumor" : "",
        selected ? "is-selected" : ""
      ].filter(Boolean).join(" ");

      return `
        <button type="button"
                class="${cls}"
                style="left: ${item.x}%; top: ${item.y}%;"
                data-pin-id="${item.id}"
                aria-label="${item.title} (${getRegionLabel(item.region)})">
          ${done ? "&#10003;" : idx + 1}
        </button>
      `;
    }).join("");

    el.mapCanvas.style.transform = `scale(${mapZoom})`;
    el.mapZoomResetBtn.textContent = `${Math.round(mapZoom * 100)}%`;

    renderMapInspector();
  }

  function renderMapInspector() {
    if (!selectedPinId) return;
    const item = DATA.items.find((i) => i.id === selectedPinId);
    if (!item) return;

    const done = isCompleted(item.id);
    const sourceBadge = item.source === "confirmed"
      ? `<span class="tag tag-confirmed">Confirmed</span>`
      : `<span class="tag tag-rumor">Community / Rumor</span>`;

    el.mapInspectorContent.innerHTML = `
      <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-bottom:0.45rem;">
        ${sourceBadge}
        <span class="tag tag-neutral">${getCategoryLabel(item.category)}</span>
        <span class="tag tag-neutral">${getRegionLabel(item.region)}</span>
      </div>
      <h2>${item.title}</h2>
      <p style="margin:0.4rem 0 0; color:var(--text-secondary);">${item.summary}</p>
      <div class="tip-box">
        <strong>Field Tip:</strong> ${item.tip}
      </div>
      <p style="font-size:0.85rem; color:var(--text-muted); margin:0 0 1rem;">
        Expected Value / Type: <strong style="color:var(--text-primary);">${item.reward}</strong>
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <button type="button" class="btn ${done ? "btn-teal" : "btn-primary"}" data-toggle-id="${item.id}">
          ${done ? "Completed (Undo)" : "Mark Complete"}
        </button>
        <button type="button" class="btn" data-open-detail="${item.id}">Add Note</button>
      </div>
    `;
  }

  /* Render Money & Heist Prep */
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

  /* Render Config-Driven Affiliate & Ecosystem Links (No dead buttons per R-26) */
  function renderMonetization() {
    el.affiliateGrid.innerHTML = CONFIG.affiliates.map((item) => {
      const hasUrl = Boolean(item.url && item.url.trim());
      const actionHtml = hasUrl
        ? `<a class="btn btn-sm" href="${item.url}" target="_blank" rel="noopener noreferrer sponsored">${item.ctaLabel}</a>`
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
      { ...CONFIG.social.youtubeMain, primary: false },
      { ...CONFIG.social.fbDecoded, primary: false },
      { ...CONFIG.social.fbLootGuides, primary: false },
      { ...CONFIG.support.buyMeACoffee, primary: true }
    ];

    el.socialLinksContainer.innerHTML = links.map((link) => {
      const hasUrl = Boolean(link.url && link.url.trim());
      if (hasUrl) {
        return `<a class="btn btn-sm ${link.primary ? "btn-primary" : ""}" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`;
      }
      return `<button type="button" class="btn btn-sm" disabled title="Add URL in config.js">${link.label} (Soon)</button>`;
    }).join("");
  }

  /* Detail Modal */
  function openDetailModal(id) {
    const item = DATA.items.find((i) => i.id === id);
    if (!item) return;
    activeDetailId = id;

    const done = isCompleted(id);
    const sourceBadge = item.source === "confirmed"
      ? `<span class="tag tag-confirmed">Confirmed</span>`
      : `<span class="tag tag-rumor">Community / Rumor</span>`;

    el.detailModalBadges.innerHTML = `${sourceBadge}<span class="tag tag-neutral">${getCategoryLabel(item.category)}</span><span class="tag tag-neutral">${getRegionLabel(item.region)}</span>`;
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

  /* Backup Modal */
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
        if (!Array.isArray(incoming.completedIds)) {
          throw new Error("Invalid backup format.");
        }
        state = {
          ...structuredClone(DEFAULT_STATE),
          ...incoming
        };
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

  /* Copy Shareable Progress Card */
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
      `Tracked with GTA 6 Decoded Tracker`
    ].join("\n");

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lines).then(() => {
        showToast("Progress summary copied! Paste it in YouTube comments.");
      }).catch(() => {
        showToast("Clipboard blocked. Copy manually from Backup export.");
      });
    } else {
      showToast("Progress ready: " + pct + "% complete.");
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
    renderChecklist();
    renderMap();
    renderMoneyView();
  }

  /* Event Wiring */
  function bindEvents() {
    document.querySelectorAll(".nav-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });

    el.themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });

    el.copyShareBtn.addEventListener("click", copyProgressCard);

    el.categoryMiniGrid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quick-cat]");
      if (!btn) return;
      const catId = btn.dataset.quickCat;
      filters.category = filters.category === catId ? "all" : catId;
      el.categorySelect.value = filters.category;
      switchView("checklist");
      renderOverview();
      renderChecklist();
    });

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

    el.resetFiltersBtn.addEventListener("click", resetFilters);
    el.emptyResetBtn.addEventListener("click", resetFilters);

    document.addEventListener("click", (e) => {
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
        mapCategory = "all";
        switchView("map");
        renderMap();
        return;
      }

      const pinBtn = e.target.closest("[data-pin-id]");
      if (pinBtn) {
        selectedPinId = pinBtn.dataset.pinId;
        renderMap();
        return;
      }

      const mapCatBtn = e.target.closest("[data-map-cat]");
      if (mapCatBtn) {
        mapCategory = mapCatBtn.dataset.mapCat;
        renderMap();
      }
    });

    el.mapZoomInBtn.addEventListener("click", () => {
      mapZoom = Math.min(2, +(mapZoom + 0.25).toFixed(2));
      renderMap();
    });

    el.mapZoomOutBtn.addEventListener("click", () => {
      mapZoom = Math.max(1, +(mapZoom - 0.25).toFixed(2));
      renderMap();
    });

    el.mapZoomResetBtn.addEventListener("click", () => {
      mapZoom = 1;
      renderMap();
    });

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
      mapCategory = "all";
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
  }

  initTheme();
  initControls();
  bindEvents();
  renderAll();
})();
