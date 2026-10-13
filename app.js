// Tahap GET: server menjadi sumber data tugas.
let tasks = [];

const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const emptyState = document.querySelector("#empty-state");
const taskForm = document.querySelector("#task-form");
const formMessage = document.querySelector("#form-message");
const filterButtons = document.querySelector(".filters");
const loadStatus = document.querySelector("#load-status");
const retryButton = document.querySelector("#retry-button");
let currentFilter = "semua";

async function api(path) {
  const response = await fetch(path);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || `Request gagal (${response.status}).`);
  }

  return payload;
}

async function fetchTasks() {
  retryButton.hidden = true;
  retryButton.disabled = true;
  loadStatus.hidden = false;
  loadStatus.className = "load-status is-loading";
  loadStatus.textContent = "Memuat tugas dari server…";
  emptyState.hidden = true;
  taskCounter.textContent = "Memuat…";

  try {
    const payload = await api("/api/tugas");
    const serverTasks = Array.isArray(payload) ? payload : payload?.data;
    if (!Array.isArray(serverTasks)) {
      throw new Error("Format data tugas dari server tidak sesuai.");
    }

    tasks = serverTasks;
    loadStatus.hidden = true;
    render();
  } catch (error) {
    tasks = [];
    taskList.replaceChildren();
    taskCounter.textContent = "Tugas belum termuat";
    emptyState.hidden = true;
    loadStatus.className = "load-status is-error";
    loadStatus.textContent = `Gagal memuat tugas: ${error.message}`;
    retryButton.hidden = false;
  } finally {
    retryButton.disabled = false;
  }
}

function render() {
  taskList.replaceChildren();

  const sortedTasks = [...tasks].sort((first, second) =>
    first.deadline.localeCompare(second.deadline)
  );
  const visibleTasks = sortedTasks.filter((task) => {
    if (currentFilter === "aktif") return !task.selesai;
    if (currentFilter === "selesai") return task.selesai;
    return true;
  });

  visibleTasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.taskId = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.selesai;
    checkbox.setAttribute("aria-label", `Tandai ${task.judul} selesai`);

    const details = document.createElement("div");
    details.className = "task-details";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.judul;
    if (task.selesai) title.classList.add("is-complete");

    const metadata = document.createElement("p");
    metadata.className = "task-metadata";
    metadata.textContent = `${task.matkul} · deadline ${task.deadline}`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Hapus";
    deleteButton.setAttribute("aria-label", `Hapus ${task.judul}`);

    details.append(title, metadata);
    item.append(checkbox, details, deleteButton);
    taskList.append(item);
  });

  const activeCount = tasks.filter((task) => !task.selesai).length;
  taskCounter.textContent = `${activeCount} tugas aktif`;
  emptyState.textContent = tasks.length === 0
    ? "Belum ada tugas. Tambahkan tugas pertamamu."
    : "Tidak ada tugas untuk filter ini.";
  emptyState.hidden = visibleTasks.length > 0;

  filterButtons.querySelectorAll(".filter-button").forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (!button || !filterButtons.contains(button)) return;

  currentFilter = button.dataset.filter;
  render();
});

// Satu listener di parent menangani kontrol pada semua item tugas.
taskList.addEventListener("change", (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;

  const item = event.target.closest(".task-item");
  const taskId = Number(item.dataset.taskId);
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (!task) return;
  task.selesai = event.target.checked;
  render();
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton || !taskList.contains(deleteButton)) return;

  const item = deleteButton.closest(".task-item");
  const taskId = Number(item.dataset.taskId);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) return;
  tasks.splice(taskIndex, 1);
  render();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(taskForm);
  const judul = formData.get("judul").trim();
  const matkul = formData.get("matkul");
  const deadline = formData.get("deadline");

  if (judul.length < 3) {
    formMessage.textContent = "Judul tugas harus terdiri dari minimal 3 karakter.";
    return;
  }

  if (!deadline) {
    formMessage.textContent = "Deadline wajib diisi.";
    return;
  }

  const duplicateTask = tasks.some((task) =>
    task.judul.trim().toLocaleLowerCase("id") === judul.toLocaleLowerCase("id") &&
    task.matkul === matkul
  );

  if (duplicateTask) {
    formMessage.textContent = "Tugas dengan judul tersebut sudah ada di mata kuliah ini.";
    return;
  }

  tasks.push({
    id: Date.now(),
    judul,
    matkul,
    deadline,
    selesai: false,
  });

  taskForm.reset();
  formMessage.textContent = "";
  render();
});

retryButton.addEventListener("click", fetchTasks);
fetchTasks();
