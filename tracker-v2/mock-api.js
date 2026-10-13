const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.env.PORT) || 3000;
const publicFiles = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"],
  "/app.js": ["app.js", "text/javascript; charset=utf-8"],
};

const courses = ["Pemrograman Web", "Basis Data", "Struktur Data"];
let tasks = [
  {
    id: 1,
    judul: "Lab 10 event delegation",
    matkul: "Pemrograman Web",
    deadline: "2026-10-16",
    selesai: false,
  },
  {
    id: 2,
    judul: "ERD sistem perpustakaan",
    matkul: "Basis Data",
    deadline: "2026-10-20",
    selesai: true,
  },
];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(payload === null ? "" : JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new HttpError(413, "Ukuran request terlalu besar."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new HttpError(400, "Body harus berformat JSON yang valid."));
      }
    });
    request.on("error", reject);
  });
}

function validateNewTask(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Body tugas harus berupa object." );
  }

  const judul = typeof body.judul === "string" ? body.judul.trim() : "";
  const matkul = typeof body.matkul === "string" ? body.matkul.trim() : "";
  const deadline = typeof body.deadline === "string" ? body.deadline : "";

  if (judul.length < 3) throw new HttpError(400, "Judul tugas minimal 3 karakter.");
  if (!courses.includes(matkul)) throw new HttpError(400, "Mata kuliah tidak valid.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline) || Number.isNaN(Date.parse(`${deadline}T00:00:00`))) {
    throw new HttpError(400, "Deadline wajib diisi dengan tanggal yang valid.");
  }

  const normalizedTitle = judul.toLocaleLowerCase("id");
  const duplicate = tasks.some((task) =>
    task.judul.toLocaleLowerCase("id") === normalizedTitle && task.matkul === matkul
  );
  if (duplicate) throw new HttpError(400, "Tugas dengan judul tersebut sudah ada di mata kuliah ini.");

  return { judul, matkul, deadline };
}

async function handleApi(request, response, url) {
  if (url.pathname === "/api/matkul") {
    if (request.method !== "GET") throw new HttpError(405, "Method tidak didukung untuk daftar mata kuliah.");
    sendJson(response, 200, courses);
    return;
  }

  if (url.pathname === "/api/tugas" && request.method === "GET") {
    sendJson(response, 200, tasks);
    return;
  }

  if (url.pathname === "/api/tugas" && request.method === "POST") {
    const fields = validateNewTask(await readJson(request));
    const task = {
      id: Math.max(0, ...tasks.map((item) => Number(item.id) || 0)) + 1,
      ...fields,
      selesai: false,
    };
    tasks.push(task);
    sendJson(response, 201, { data: task });
    return;
  }

  const taskRoute = url.pathname.match(/^\/api\/tugas\/([^/]+)$/);
  if (taskRoute) {
    const id = decodeURIComponent(taskRoute[1]);
    const taskIndex = tasks.findIndex((task) => String(task.id) === id);
    if (taskIndex === -1) throw new HttpError(404, "Tugas tidak ditemukan.");

    if (request.method === "PATCH") {
      const body = await readJson(request);
      if (!body || typeof body.selesai !== "boolean") {
        throw new HttpError(400, "Properti selesai harus bernilai true atau false.");
      }
      tasks[taskIndex] = { ...tasks[taskIndex], selesai: body.selesai };
      sendJson(response, 200, { data: tasks[taskIndex] });
      return;
    }

    if (request.method === "DELETE") {
      tasks.splice(taskIndex, 1);
      sendJson(response, 204, null);
      return;
    }

    throw new HttpError(405, "Method tidak didukung untuk tugas ini.");
  }

  throw new HttpError(404, "Endpoint API tidak ditemukan.");
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);

  if (url.pathname.startsWith("/api/")) {
    try {
      await handleApi(request, response, url);
    } catch (error) {
      if (!response.headersSent) {
        sendJson(response, error.status || 500, {
          message: error.status ? error.message : "Terjadi kesalahan pada Mock API.",
        });
      }
    }
    return;
  }

  const file = publicFiles[url.pathname];
  if (!file || request.method !== "GET") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("File tidak ditemukan.");
    return;
  }

  fs.readFile(path.join(__dirname, file[0]), (error, content) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Gagal membaca file aplikasi.");
      return;
    }
    response.writeHead(200, { "Content-Type": file[1] });
    response.end(content);
  });
});

server.listen(port, host, () => {
  console.log(`Task Tracker v2 berjalan di http://${host}:${port}`);
  console.log("Mock API tersedia pada /api/tugas dan /api/matkul");
});
