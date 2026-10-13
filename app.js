// Tahap 2: rendering daftar tugas dari state (array of objects).
const initialTasks = [
  {
    id: 1,
    judul: "Lab 10 event delegation",
    matkul: "Pemrograman Web",
    deadline: "2026-10-08",
    selesai: false,
  },
  {
    id: 2,
    judul: "ERD sistem perpustakaan",
    matkul: "Basis Data",
    deadline: "2026-10-12",
    selesai: true,
  },
];
const storageKey = "task-tracker-kuliah-tasks";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(storageKey);
    if (!savedTasks) return initialTasks;

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks)) return initialTasks;

    return parsedTasks.filter((task) =>
      task && Number.isFinite(Number(task.id)) &&
      typeof task.judul === "string" &&
      typeof task.matkul === "string" &&
      typeof task.deadline === "string" &&
      typeof task.selesai === "boolean"
    );
  } catch (error) {
    console.warn("Data tugas dari localStorage tidak dapat dibaca.", error);
    return initialTasks;
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Data tugas tidak dapat disimpan ke localStorage.", error);
  }
}

const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const emptyState = document.querySelector("#empty-state");
const taskForm = document.querySelector("#task-form");
const formMessage = document.querySelector("#form-message");
const filterButtons = document.querySelector(".filters");
let currentFilter = "semua";

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
  saveTasks();
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
  saveTasks();
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

  saveTasks();
  taskForm.reset();
  formMessage.textContent = "";
  render();
});

render();
