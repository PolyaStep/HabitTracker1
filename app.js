const DATE_LOCALE = "en-CA";
const today = () => new Date();
const dateKey = (d) => d.toLocaleDateString(DATE_LOCALE);

function lastNDates(n) {
  const out = [];
  const t = today();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(t);
    d.setDate(t.getDate() - i);
    out.push(d);
  }
  return out;
}

const form = document.getElementById("habit-form");
const input = document.getElementById("habit-input");
const tbody = document.querySelector("#habit-table tbody");
const statusEl = document.getElementById("status");

function setStatus(msg, kind = "info") {
  if (!statusEl) return;
  statusEl.textContent = msg || "";
  statusEl.className = kind === "error" ? "status error" : "status";
  if (msg) setTimeout(() => setStatus(""), 3000);
}

function load() {
  try {
    const raw = localStorage.getItem("habits");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // shape guard
    return parsed.map((h) => ({ name: String(h.name || "").trim(), days: h.days || {} }))
                 .filter((h) => h.name.length > 0);
  } catch {
    setStatus("Stored data was corrupted and has been reset.", "error");
    localStorage.removeItem("habits");
    return [];
  }
}

let habits = load();

function save() {
  try {
    localStorage.setItem("habits", JSON.stringify(habits));
  } catch {
    setStatus("Could not save data to this browser.", "error");
  }
}

function calcStreak(habit) {
  let s = 0;
  const t = today();
  while (true) {
    const d = new Date(t);
    d.setDate(t.getDate() - s);
    const key = dateKey(d);
    if (habit.days[key]) s++;
    else break;
  }
  return s;
}

function render() {
  tbody.innerHTML = "";

  if (habits.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 10;
    td.textContent = "No habits yet. Add one above!";
    td.style.textAlign = "center";
    td.style.color = "#777";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  habits.forEach((habit, idx) => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = habit.name;
    tr.appendChild(nameTd);

    lastNDates(7).forEach((d) => {
      const key = dateKey(d);
      const td = document.createElement("td");
      td.title = key;
      td.tabIndex = 0;
      if (habit.days[key]) td.classList.add("done");

      const toggle = () => {
        habit.days[key] = !habit.days[key];
        save();
        render();
      };

      td.addEventListener("click", toggle);
      td.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });

      tr.appendChild(td);
    });

    const streakTd = document.createElement("td");
    streakTd.textContent = calcStreak(habit);
    tr.appendChild(streakTd);

    const actionsTd = document.createElement("td");

    const tickBtn = document.createElement("button");
    tickBtn.type = "button";
    tickBtn.textContent = "Tick today";
    tickBtn.addEventListener("click", () => {
      const key = dateKey(today());
      habit.days[key] = true;
      save();
      render();
      setStatus(`Marked today for "${habit.name}".`);
    });

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Delete";
    delBtn.style.marginLeft = "8px";
    delBtn.addEventListener("click", () => {
      habits.splice(idx, 1);
      save();
      render();
      setStatus(`Deleted habit "${habit.name}".`);
    });

    actionsTd.appendChild(tickBtn);
    actionsTd.appendChild(delBtn);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = (input.value || "").trim();

  if (!name) {
    setStatus("Please enter a habit name before adding!", "error");
    input.focus();
    return;
  }
  if (name.length > 40) {
    setStatus("Habit name is too long (max 40 chars).", "error");
    input.focus();
    return;
  }
  if (habits.some((h) => h.name.toLowerCase() === name.toLowerCase())) {
    setStatus("That habit already exists.", "error");
    input.select();
    return;
  }

  habits.push({ name, days: {} });
  save();
  input.value = "";
  render();
  setStatus(`Added "${name}".`);
});

render();
