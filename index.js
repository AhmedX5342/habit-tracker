// ── State ──────────────────────────────────────────
let data = { habits: [], entries: {} };
let diary = {};
let charts = {};
let habits = [];

const calState = {};
let trackerChoice = {};
let activeDiaryKey = null;
let viewMode = 'weekly'; // 'weekly' or 'monthly'
let failsMode = 'weekly'; // 'weekly' or 'monthly'
let chartVisibility = {
  successRate: true,
  bar: true,
  cumulative: false,
  rolling: false
};

// ── Helpers ────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function pad(n) { return String(n).padStart(2, '0'); }
function dateKey(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }
function monthName(m) {
  return ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][m];
}

// Color palette for habits (5 unique colors)
const colorPalette = [
  { text: '#c4763a', light: 'rgba(196, 118, 58, 0.7)' },    // Orange
  { text: '#3a7cc4', light: 'rgba(58, 124, 196, 0.7)' },    // Blue
  { text: '#5aa36f', light: 'rgba(90, 163, 111, 0.7)' },    // Green
  { text: '#a574bc', light: 'rgba(165, 116, 188, 0.7)' },   // Purple
  { text: '#d97a6f', light: 'rgba(217, 122, 111, 0.7)' }    // Red/Pink
];

function getHabitColor(habit) {
  const index = habits.indexOf(habit);
  if (index !== -1) {
    return colorPalette[index % colorPalette.length];
  }
  // Fallback (shouldn't happen)
  return colorPalette[0];
}

// ── Init ───────────────────────────────────────────
async function load() {
  const resp = await fetch('/data').then(r => r.json());
  
  // Handle both old and new data structures
  if (resp.habits) {
    data = resp;
  } else {
    // Migrate old data
    data = { habits: [], entries: {} };
    Object.entries(resp).forEach(([k, v]) => {
      if (k !== 'habits' && k !== 'entries') {
        data.entries[k] = v;
      }
    });
    // Save migrated data
    await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
  
  diary = await fetch('/diary').then(r => r.json());
  habits = data.habits || [];

  // Initialize calendar state for each habit
  const now = new Date();
  habits.forEach(h => {
    calState[h] = { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  // Initialize tracker choices
  habits.forEach(h => {
    trackerChoice[h] = null;
  });

  // Set tracker date to today
  document.getElementById('tracker-date').value = todayStr();
  document.getElementById('header-date').textContent =
    new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Load existing entry for today if present
  loadTrackerForDate(todayStr());

  // Render calendars and stats
  renderCalendarsGrid();
  habits.forEach(h => renderCalendar(h));
  renderTrackerRows();
  renderHabitsList();
  renderStats();
  renderDiaryList();
  renderTrackerStreak();

  // When date changes in tracker
  document.getElementById('tracker-date').addEventListener('change', e => {
    loadTrackerForDate(e.target.value);
  });

  // Close chart menu when clicking outside
  document.addEventListener('click', e => {
    const menu = document.getElementById('chart-visibility-menu');
    const toggle = document.getElementById('chart-visibility-toggle');
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
}

// ── Tabs ───────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('page-' + name).classList.add('active');
  if (name === 'stats') renderStats();
}

// ── Tracker ────────────────────────────────────────
function setTrackerToday() {
  document.getElementById('tracker-date').value = todayStr();
  loadTrackerForDate(todayStr());
}

function loadTrackerForDate(dateStr) {
  const entry = data.entries[dateStr];
  habits.forEach(h => {
    trackerChoice[h] = entry ? entry[h] : null;
  });
  updateChoiceButtons();
}

function setChoice(field, val) {
  trackerChoice[field] = val;
  updateChoiceButtons();
}

function updateChoiceButtons() {
  habits.forEach(habit => {
    const pass = document.getElementById(`${habit}-pass`);
    const fail = document.getElementById(`${habit}-fail`);
    if (pass && fail) {
      pass.className = 'choice-btn' + (trackerChoice[habit] === 1 ? ' selected-pass' : '');
      fail.className = 'choice-btn' + (trackerChoice[habit] === 0 ? ' selected-fail' : '');
    }
  });
}

function renderTrackerRows() {
  const container = document.getElementById('tracker-rows');
  if (!container) return;
  
  let html = '';
  habits.forEach(h => {
    const color = getHabitColor(h).text;
    const label = h.charAt(0).toUpperCase() + h.slice(1);
    html += `
      <div class="tracker-row">
        <div class="tracker-label" style="color: ${color}">${label}</div>
        <div class="choice-btns">
          <button class="choice-btn" id="${h}-pass" onclick="setChoice('${h}', 1)">✓ Pass</button>
          <button class="choice-btn" id="${h}-fail" onclick="setChoice('${h}', 0)">✗ Fail</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  updateChoiceButtons();
}

async function saveEntry() {
  // Check all habits are set
  for (let h of habits) {
    if (trackerChoice[h] === null) {
      alert(`Please select Pass or Fail for ${h}.`);
      return;
    }
  }
  const dateStr = document.getElementById('tracker-date').value;
  data.entries[dateStr] = { ...trackerChoice };
  
  await fetch('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  habits.forEach(h => renderCalendar(h));
  renderStats();
  renderTrackerStreak();
  
  const msg = document.getElementById('save-msg');
  msg.classList.add('show');
  setTimeout(() => msg.classList.remove('show'), 2000);
}

// ── Streak Display ────────────────────────────────
function computeStreaks(habit) {
  let current = 0, best = 0;
  let temp = 0;
  
  const sorted = Object.keys(data.entries).sort();
  sorted.forEach(k => {
    if (data.entries[k][habit] === 1) {
      temp++;
      best = Math.max(best, temp);
    } else {
      temp = 0;
    }
  });
  
  // Current streak from end
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (data.entries[sorted[i]][habit] === 1) current++;
    else break;
  }
  
  return { current, best };
}

function renderTrackerStreak() {
  const streakContainer = document.getElementById('tracker-streaks');
  if (!streakContainer) return;
  
  let html = '';
  habits.forEach(h => {
    const streaks = computeStreaks(h);
    html += `
      <div class="streak-display" style="color: ${getHabitColor(h).text}">
        <span>🔥 ${streaks.current} day streak</span>
        <span>Best: ${streaks.best} days</span>
      </div>
    `;
  });
  streakContainer.innerHTML = html;
}

function renderHabitsList() {
  const container = document.getElementById('habits-list');
  if (!container) return;
  
  let html = '';
  habits.forEach(h => {
    const color = getHabitColor(h).text;
    const label = h.charAt(0).toUpperCase() + h.slice(1);
    html += `
      <div class="habit-item">
        <span class="habit-item-name" style="color: ${color}">${label}</span>
        <button class="habit-item-delete" onclick="deleteHabit('${h}')">×</button>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ── Calendar ───────────────────────────────────────
function calNav(which, dir) {
  const s = calState[which];
  s.month += dir;
  if (s.month > 12) { s.month = 1; s.year++; }
  if (s.month < 1) { s.month = 12; s.year--; }
  renderCalendar(which);
}

function renderCalendarsGrid() {
  const grid = document.getElementById('calendars-grid');
  if (!grid) return;
  
  let html = '';
  habits.forEach(h => {
    const color = getHabitColor(h).text;
    const label = h.charAt(0).toUpperCase() + h.slice(1);
    html += `
      <div class="cal-wrapper" id="cal-${h}">
        <div class="cal-header">
          <span class="cal-title" style="color: ${color}">${label}</span>
          <div class="cal-nav">
            <button onclick="calNav('${h}', -1)">‹</button>
            <span class="cal-month" id="cal-${h}-month"></span>
            <button onclick="calNav('${h}', 1)">›</button>
          </div>
        </div>
        <div class="cal-grid">
          <div class="cal-days-header">
            <div class="cal-day-name">Sun</div>
            <div class="cal-day-name">Mon</div>
            <div class="cal-day-name">Tue</div>
            <div class="cal-day-name">Wed</div>
            <div class="cal-day-name">Thu</div>
            <div class="cal-day-name">Fri</div>
            <div class="cal-day-name">Sat</div>
          </div>
          <div class="cal-cells" id="cal-${h}-cells"></div>
        </div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

function renderCalendar(which) {
  const s = calState[which];
  const { year, month } = s;
  const today = todayStr();

  const monthEl = document.getElementById(`cal-${which}-month`);
  if (monthEl) monthEl.textContent = `${monthName(month - 1)} ${year}`;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = document.getElementById(`cal-${which}-cells`);
  if (!cells) return;
  
  cells.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-cell empty';
    cells.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(year, month, d);
    const el = document.createElement('div');
    const isToday = key === today;
    const isFuture = key > today;
    const entry = data.entries[key];

    let cls = 'cal-cell';
    let content = `<span class="day-num">${d}</span>`;

    if (isFuture) {
      cls += ' future';
    } else if (entry) {
      const val = entry[which];
      if (val === 1) { cls += ' pass'; content = `<span class="icon">✓</span>`; }
      else { cls += ' fail'; content = `<span class="icon">✗</span>`; }
    } else {
      cls += ' unset';
    }
    if (isToday) cls += ' today-cell';

    el.className = cls;
    el.innerHTML = content;

    if (!isFuture) {
      el.title = key;
      el.onclick = () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelector('.tab').classList.add('active');
        document.getElementById('page-tracker').classList.add('active');
        document.getElementById('tracker-date').value = key;
        loadTrackerForDate(key);
        document.querySelector('.tracker-panel').scrollIntoView({ behavior: 'smooth' });
      };
    }

    cells.appendChild(el);
  }
}

// ── Stats ──────────────────────────────────────────
function computeStats(habit) {
  let pass = 0, fail = 0;
  const sorted = Object.keys(data.entries).sort();
  sorted.forEach(k => {
    if (data.entries[k][habit] === 1) pass++;
    else fail++;
  });
  const total = sorted.length;
  return {
    rate: total ? (pass / total * 100).toFixed(1) : '0.0',
    pass, fail, total, sorted
  };
}

function weeklyData() {
  const weeks = {};
  const sorted = Object.keys(data.entries).sort();
  
  if (sorted.length === 0) return weeks;
  
  const firstDate = new Date(sorted[0]);
  const startOfWeek = new Date(firstDate);
  startOfWeek.setDate(firstDate.getDate() - firstDate.getDay()); // Start from Sunday
  
  sorted.forEach(d => {
    const date = new Date(d);
    const daysSinceStart = Math.floor((date - startOfWeek) / (24 * 60 * 60 * 1000));
    const weekNum = Math.floor(daysSinceStart / 7) + 1;
    const wk = `W${weekNum}`;
    
    if (!weeks[wk]) {
      weeks[wk] = {};
      habits.forEach(h => weeks[wk][h] = { pass: 0, fail: 0 });
    }
    habits.forEach(h => {
      if (data.entries[d][h] === 1) weeks[wk][h].pass++;
      else if (data.entries[d][h] === 0) weeks[wk][h].fail++;
    });
  });
  
  return weeks;
}

function monthlyData() {
  const months = {};
  Object.entries(data.entries).forEach(([d, v]) => {
    const [year, month] = d.split('-');
    const key = `${year}-${month}`;
    if (!months[key]) {
      months[key] = {};
      habits.forEach(h => months[key][h] = { pass: 0, fail: 0 });
    }
    habits.forEach(h => {
      if (v[h] === 1) months[key][h].pass++;
      else months[key][h].fail++;
    });
  });
  return months;
}

function sortPeriods(periods, isWeekly) {
  if (isWeekly) {
    return periods.sort((a, b) => {
      const numA = parseInt(a.slice(1));
      const numB = parseInt(b.slice(1));
      return numA - numB;
    });
  } else {
    return periods.sort();
  }
}

function successRateByPeriod() {
  const data_src = viewMode === 'weekly' ? weeklyData() : monthlyData();
  const periods = sortPeriods(Object.keys(data_src), viewMode === 'weekly');
  const rates = {};
  
  habits.forEach(h => {
    rates[h] = periods.map(p => {
      const total = data_src[p][h].pass + data_src[p][h].fail;
      return total > 0 ? ((data_src[p][h].pass / total) * 100).toFixed(1) : 0;
    });
  });
  
  return { periods, rates };
}

function cumulativeRate(sorted, habit) {
  let pass = 0;
  return sorted.map((k, i) => {
    if (data.entries[k][habit] === 1) pass++;
    return ((pass / (i + 1)) * 100).toFixed(1);
  });
}

function rollingRate(sorted, habit, window = 30) {
  return sorted.map((_, i) => {
    const slice = sorted.slice(Math.max(0, i - window + 1), i + 1);
    const passes = slice.filter(k => data.entries[k][habit] === 1).length;
    return ((passes / slice.length) * 100).toFixed(1);
  });
}

const CHART_DEFAULTS = {
  responsive: true,
  plugins: { legend: { labels: { color: '#6b6560', font: { family: 'DM Mono', size: 11 } } } },
  scales: {
    x: { ticks: { color: '#6b6560', font: { family: 'DM Mono', size: 10 } }, grid: { color: '#2a2a2a' } },
    y: { ticks: { color: '#6b6560', font: { family: 'DM Mono', size: 10 } }, grid: { color: '#2a2a2a' } }
  }
};

function renderStats() {
  // Stat cards
  let statsHtml = '';
  habits.forEach(h => {
    const s = computeStats(h);
    const color = getHabitColor(h).text;
    statsHtml += `
      <div class="stat-card">
        <div class="stat-card-label">${h.charAt(0).toUpperCase() + h.slice(1)} Success Rate</div>
        <div class="stat-card-value" style="color: ${color}">${s.rate}%</div>
        <div class="stat-card-sub">${s.pass} passed / ${s.fail} failed</div>
      </div>
    `;
  });
  document.getElementById('stats-grid').innerHTML = statsHtml;

  // Destroy old charts
  Object.values(charts).forEach(c => c.destroy());
  charts = {};

  // Success rate per week/month chart
  if (chartVisibility.successRate) {
    const { periods, rates } = successRateByPeriod();
    const datasets = habits.map(h => ({
      label: `${h.charAt(0).toUpperCase() + h.slice(1)} Success %`,
      data: rates[h],
      borderColor: getHabitColor(h).text,
      backgroundColor: getHabitColor(h).light,
      tension: 0,
      pointRadius: 4,
      pointHoverRadius: 6
    }));

    charts.successRate = new Chart(document.getElementById('chart-success-rate'), {
      type: 'line',
      data: { labels: periods, datasets },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Weekly/Monthly fails bar chart
  if (chartVisibility.bar) {
    const data_src = failsMode === 'weekly' ? weeklyData() : monthlyData();
    const periods = sortPeriods(Object.keys(data_src), failsMode === 'weekly');
    const title = failsMode === 'weekly' ? 'Weekly Fails' : 'Monthly Fails';
    document.querySelector('#chart-bar-container .chart-card-title').textContent = title;
    
    const barDatasets = habits.map(h => ({
      label: `${h.charAt(0).toUpperCase() + h.slice(1)} Fails`,
      data: periods.map(k => data_src[k][h].fail),
      backgroundColor: getHabitColor(h).light,
      borderColor: getHabitColor(h).text,
      borderWidth: 1
    }));

    charts.bar = new Chart(document.getElementById('chart-bar'), {
      type: 'bar',
      data: { labels: periods, datasets: barDatasets },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Cumulative success rate
  if (chartVisibility.cumulative) {
    const s = computeStats(habits[0]);
    const dLabels = s.sorted.map(k => k.slice(5));
    
    const cumulativeDatasets = habits.map(h => ({
      label: `${h.charAt(0).toUpperCase() + h.slice(1)} Cumulative %`,
      data: cumulativeRate(s.sorted, h),
      borderColor: getHabitColor(h).text,
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 0
    }));

    charts.cumulative = new Chart(document.getElementById('chart-cumulative'), {
      type: 'line',
      data: { labels: dLabels, datasets: cumulativeDatasets },
      options: { ...CHART_DEFAULTS }
    });
  }

  // Rolling average
  if (chartVisibility.rolling) {
    const s = computeStats(habits[0]);
    const dLabels = s.sorted.map(k => k.slice(5));
    
    const rollingDatasets = habits.map(h => ({
      label: `${h.charAt(0).toUpperCase() + h.slice(1)} 30-day %`,
      data: rollingRate(s.sorted, h),
      borderColor: getHabitColor(h).text,
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 0
    }));

    charts.rolling = new Chart(document.getElementById('chart-rolling'), {
      type: 'line',
      data: { labels: dLabels, datasets: rollingDatasets },
      options: { ...CHART_DEFAULTS }
    });
  }
}

function togglePeriod() {
  viewMode = viewMode === 'weekly' ? 'monthly' : 'weekly';
  failsMode = viewMode; // Keep both in sync
  const btn = document.getElementById('period-toggle-btn');
  btn.textContent = viewMode === 'weekly' ? 'Weekly' : 'Monthly';
  renderStats();
}

function toggleChartMenu() {
  const menu = document.getElementById('chart-visibility-menu');
  menu.classList.toggle('show');
}

function toggleChart(chartName) {
  chartVisibility[chartName] = !chartVisibility[chartName];
  
  // Toggle visibility of chart container
  const containerMap = {
    successRate: 'chart-success-rate-container',
    bar: 'chart-bar-container',
    cumulative: 'chart-cumulative-container',
    rolling: 'chart-rolling-container'
  };
  
  const container = document.getElementById(containerMap[chartName]);
  if (container) {
    container.style.display = chartVisibility[chartName] ? 'block' : 'none';
  }
  
  renderStats();
}



// ── Habits Management ──────────────────────────────
async function addHabit() {
  const name = prompt('Enter habit name:');
  if (!name) return;
  if (habits.includes(name)) {
    alert('Habit already exists');
    return;
  }
  habits.push(name);
  data.habits = habits;
  trackerChoice[name] = null;
  calState[name] = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
  
  // Initialize all entries with this habit
  Object.keys(data.entries).forEach(k => {
    data.entries[k][name] = null;
  });
  
  await fetch('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  renderTrackerRows();
  renderHabitsList();
  renderCalendarsGrid();
  habits.forEach(h => renderCalendar(h));
  renderStats();
}

async function deleteHabit(habit) {
  if (!confirm(`Delete habit "${habit}"?`)) return;
  
  habits = habits.filter(h => h !== habit);
  data.habits = habits;
  delete trackerChoice[habit];
  delete calState[habit];
  
  // Remove from all entries
  Object.keys(data.entries).forEach(k => {
    delete data.entries[k][habit];
  });
  
  await fetch('/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  renderTrackerRows();
  renderHabitsList();
  renderCalendarsGrid();
  habits.forEach(h => renderCalendar(h));
  renderStats();
  loadTrackerForDate(document.getElementById('tracker-date').value);
}

// ── Diary ──────────────────────────────────────────
function renderDiaryList() {
  const list = document.getElementById('diary-list');
  const keys = Object.keys(diary).sort().reverse();
  list.innerHTML = '';
  if (keys.length === 0) {
    list.innerHTML = `<div style="padding:20px;color:var(--muted);font-size:11px">No entries yet.</div>`;
    return;
  }
  keys.forEach(k => {
    const el = document.createElement('div');
    el.className = 'diary-entry-item' + (k === activeDiaryKey ? ' active' : '');
    const preview = diary[k].body ? diary[k].body.substring(0, 60).replace(/\n/g, ' ') : '—';
    el.innerHTML = `<div class="diary-entry-date">${k}</div><div class="diary-entry-preview">${diary[k].title || preview}</div>`;
    el.onclick = () => openDiaryEntry(k);
    list.appendChild(el);
  });
}

function openDiaryEntry(key) {
  activeDiaryKey = key;
  renderDiaryList();
  renderDiaryEditor(key);
}

function renderDiaryEditor(key) {
  const entry = diary[key] || { title: '', body: '' };
  const main = document.getElementById('diary-main');
  main.innerHTML = `
    <div class="diary-editor-header">
      <span class="diary-editor-date">${key}</span>
      <div class="diary-editor-actions">
        <button class="diary-delete-btn" onclick="deleteDiaryEntry('${key}')">Delete</button>
        <button class="diary-save-btn" onclick="saveDiaryEntry('${key}')">Save</button>
      </div>
    </div>
    <input class="diary-title-input" id="diary-title" placeholder="Title..." value="${(entry.title || '').replace(/"/g, '&quot;')}">
    <textarea class="diary-textarea" id="diary-body" placeholder="Write your thoughts...">${entry.body || ''}</textarea>
  `;
}

function newDiaryEntry() {
  const key = todayStr();
  if (!diary[key]) diary[key] = { title: '', body: '' };
  openDiaryEntry(key);
}

async function saveDiaryEntry(key) {
  diary[key] = {
    title: document.getElementById('diary-title').value,
    body: document.getElementById('diary-body').value
  };
  await fetch('/diary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(diary)
  });
  renderDiaryList();
}

async function deleteDiaryEntry(key) {
  if (!confirm('Delete this entry?')) return;
  delete diary[key];
  await fetch('/diary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(diary)
  });
  activeDiaryKey = null;
  document.getElementById('diary-main').innerHTML = `
    <div class="diary-empty-state">
      <div class="icon">✦</div>
      <p>Select an entry or create a new one</p>
    </div>
  `;
  renderDiaryList();
}

// ── Boot ───────────────────────────────────────────
load();
