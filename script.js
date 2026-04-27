const STORAGE_KEY = "five-whys-app-state-v1";
const ACTION_TEMPLATE = document.getElementById("action-row-template");
const actionsBody = document.getElementById("actions-body");
const form = document.getElementById("five-whys-form");
const progressValue = document.getElementById("progress-value");
const actionCountValue = document.getElementById("action-count");
const nextDueDateValue = document.getElementById("next-due-date");

const defaultState = {
  analysisTitle: "",
  facilitator: "",
  department: "",
  analysisDate: "",
  problemStatement: "",
  why1: "",
  why2: "",
  why3: "",
  why4: "",
  why5: "",
  therefore1: "",
  therefore2: "",
  therefore3: "",
  therefore4: "",
  therefore5: "",
  rootCause: "",
  actions: [{ action: "", owner: "", dueDate: "" }],
};

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") {
      return cloneState(defaultState);
    }
    return {
      ...cloneState(defaultState),
      ...saved,
      actions: Array.isArray(saved.actions) && saved.actions.length ? saved.actions : cloneState(defaultState.actions),
    };
  } catch {
    return cloneState(defaultState);
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateSummary();
}

function formatDate(dateString) {
  if (!dateString) {
    return "None";
  }
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "None"
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function updateSummary() {
  const fieldNames = [
    "analysisTitle",
    "facilitator",
    "department",
    "analysisDate",
    "problemStatement",
    "why1",
    "why2",
    "why3",
    "why4",
    "why5",
    "therefore1",
    "therefore2",
    "therefore3",
    "therefore4",
    "therefore5",
    "rootCause",
  ];

  const completed = fieldNames.filter((key) => String(state[key] || "").trim()).length;
  const total = fieldNames.length;
  progressValue.textContent = `${Math.round((completed / total) * 100)}%`;
  actionCountValue.textContent = String(state.actions.length);

  const nextDueDate = state.actions
    .map((item) => item.dueDate)
    .filter(Boolean)
    .sort()[0];
  nextDueDateValue.textContent = formatDate(nextDueDate);
}

function syncFormFields() {
  for (const element of form.elements) {
    if (!element.name) {
      continue;
    }
    element.value = state[element.name] || "";
  }
}

function createActionRow(action = { action: "", owner: "", dueDate: "" }) {
  const fragment = ACTION_TEMPLATE.content.cloneNode(true);
  const row = fragment.querySelector("tr");

  row.querySelectorAll("[data-field]").forEach((field) => {
    const key = field.dataset.field;
    field.value = action[key] || "";
    field.addEventListener("input", () => {
      const index = [...actionsBody.children].indexOf(row);
      state.actions[index][key] = field.value;
      saveState();
    });
  });

  row.querySelector(".remove-action").addEventListener("click", () => {
    const index = [...actionsBody.children].indexOf(row);
    state.actions.splice(index, 1);
    if (!state.actions.length) {
      state.actions.push({ action: "", owner: "", dueDate: "" });
    }
    renderActions();
    saveState();
  });

  return row;
}

function renderActions() {
  actionsBody.innerHTML = "";
  state.actions.forEach((action) => {
    actionsBody.appendChild(createActionRow(action));
  });
}

function collectFormValues() {
  for (const element of form.elements) {
    if (!element.name) {
      continue;
    }
    state[element.name] = element.value;
  }
}

function exportJson() {
  collectFormValues();
  const payload = {
    ...state,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const slug = (state.analysisTitle || "five-whys-analysis")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  link.href = url;
  link.download = `${slug || "five-whys-analysis"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function generateThereforeChain() {
  for (let i = 1; i <= 5; i += 1) {
    const whyValue = String(state[`why${i}`] || "").trim();
    if (whyValue && !String(state[`therefore${i}`] || "").trim()) {
      state[`therefore${i}`] = `Therefore, ${whyValue.charAt(0).toLowerCase()}${whyValue.slice(1)}`;
    }
  }
  syncFormFields();
  saveState();
}

function resetForm() {
  const confirmed = window.confirm("Start a new analysis? This will clear the saved worksheet on this device.");
  if (!confirmed) {
    return;
  }
  state = cloneState(defaultState);
  syncFormFields();
  renderActions();
  saveState();
}

form.addEventListener("input", () => {
  collectFormValues();
  saveState();
});

document.getElementById("add-action").addEventListener("click", () => {
  state.actions.push({ action: "", owner: "", dueDate: "" });
  renderActions();
  saveState();
});

document.getElementById("export-json").addEventListener("click", exportJson);
document.getElementById("print-report").addEventListener("click", () => window.print());
document.getElementById("autofill-therefore").addEventListener("click", generateThereforeChain);
document.getElementById("reset-form").addEventListener("click", resetForm);

syncFormFields();
renderActions();
updateSummary();
