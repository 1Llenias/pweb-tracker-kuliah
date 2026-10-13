// Tahap 2: rendering daftar tugas dari state (array of objects).
const tasks = [
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

const taskList = document.querySelector("#task-list");
const taskCounter = document.querySelector("#task-counter");
const emptyState = document.querySelector("#empty-state");
const taskForm = document.querySelector("#task-form");
const formMessage = document.querySelector("#form-message");

function render() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";

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
  emptyState.hidden = tasks.length > 0;
}

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

render();
