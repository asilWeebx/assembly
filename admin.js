const STORAGE_KEYS = {
  services: "ea_services",
  news: "ea_news",
  requests: "ea_requests",
  auth: "ea_admin_auth"
};

const ADMIN_LOGIN = "assembly_admin123";
const ADMIN_PASSWORD = "assembly_admin123$$$";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function isAuth() {
  return localStorage.getItem(STORAGE_KEYS.auth) === "1";
}

function setAuth(v) {
  localStorage.setItem(STORAGE_KEYS.auth, v ? "1" : "0");
}

function ensureDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.services)) {
    writeJSON(STORAGE_KEYS.services, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.news)) {
    writeJSON(STORAGE_KEYS.news, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.requests)) {
    writeJSON(STORAGE_KEYS.requests, []);
  }
}

function mountAccess() {
  const loginSection = document.getElementById("loginSection");
  const panelSection = document.getElementById("panelSection");
  if (isAuth()) {
    loginSection.classList.add("hidden");
    panelSection.classList.remove("hidden");
    renderAll();
  } else {
    loginSection.classList.remove("hidden");
    panelSection.classList.add("hidden");
  }
}

function renderServicesAdmin() {
  const root = document.getElementById("adminServicesList");
  const services = readJSON(STORAGE_KEYS.services, []);
  root.innerHTML = services
    .map(
      (item) => `
      <div class="bg-surface rounded-xl p-3 flex items-start justify-between gap-3 border border-outline-variant/10">
        <div>
          <p class="text-[10px] uppercase tracking-widest text-primary font-bold">${item.tag || "Service"}</p>
          <p class="font-semibold">${item.title}</p>
          <p class="text-sm text-on-surface-variant line-clamp-2">${item.description}</p>
        </div>
        <div class="flex gap-2">
          <button data-edit-service="${item.id}" class="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-lg transition-colors"><span class="material-symbols-outlined text-sm">edit</span></button>
          <button data-del-service="${item.id}" class="text-red-400 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-lg transition-colors"><span class="material-symbols-outlined text-sm">delete</span></button>
        </div>
      </div>`
    )
    .join("");
}

function renderNewsAdmin() {
  const root = document.getElementById("adminNewsList");
  const news = readJSON(STORAGE_KEYS.news, []);
  if (!news.length) {
    root.innerHTML = '<p class="text-on-surface-variant p-4 text-center glass-card rounded-xl">Новостей пока нет.</p>';
    return;
  }
  root.innerHTML = news
    .map(
      (item) => `
      <div class="bg-surface rounded-xl p-3 flex items-start justify-between gap-3 border border-outline-variant/10 shadow-sm transition-all hover:bg-surface-variant/20">
        <div class="flex gap-4">
          ${item.image ? `<img src="${item.image}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" />` : `<div class="w-20 h-20 rounded-lg bg-surface-variant flex items-center justify-center text-outline flex-shrink-0"><span class="material-symbols-outlined">image</span></div>`}
          <div>
            <p class="text-[10px] uppercase tracking-widest text-tertiary font-bold">${item.date || ""}</p>
            <p class="font-bold text-lg leading-tight mb-1">${item.title}</p>
            <p class="text-sm text-on-surface-variant line-clamp-2">${item.content}</p>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button data-edit-news="${item.id}" class="text-primary bg-primary/10 hover:bg-primary/20 p-2 rounded-lg transition-colors border border-primary/20"><span class="material-symbols-outlined text-sm">edit</span></button>
          <button data-del-news="${item.id}" class="text-red-400 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-lg transition-colors border border-red-400/20"><span class="material-symbols-outlined text-sm">delete</span></button>
        </div>
      </div>`
    )
    .join("");
}

function renderRequestsAdmin() {
  const root = document.getElementById("adminRequestsList");
  const requests = readJSON(STORAGE_KEYS.requests, []);
  if (!requests.length) {
    root.innerHTML = '<p class="text-on-surface-variant p-4 text-center glass-card rounded-xl">Пока нет заявок.</p>';
    return;
  }
  root.innerHTML = requests
    .map(
      (item) => `
      <div class="bg-surface rounded-xl p-4 border border-outline-variant/10 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <p class="font-bold text-lg text-primary">${item.name || "Без имени"}</p>
            <p class="text-sm text-on-surface-variant flex flex-wrap items-center gap-x-2">
              ${item.org && item.org !== "undefined" ? `<span class="font-bold">${item.org}</span>` : ""} 
              ${(item.org && item.org !== "undefined") && (item.email || item.phone) ? `<span class="text-outline-variant">|</span>` : ""}
              ${item.email || ""} 
              ${item.email && item.phone ? `<span class="text-outline-variant">|</span>` : ""}
              ${item.phone || ""}
              ${!item.org && !item.email && !item.phone ? "Контактные данные не указаны" : ""}
            </p>
          </div>
          <span class="text-[10px] uppercase font-bold px-2 py-1 rounded ${item.status === "done" ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/20 text-primary"}">
            ${item.status === "done" ? "Обработано" : "Новая заявка"}
          </span>
        </div>
        <div class="bg-surface-variant/30 rounded-lg p-3 mb-3 border border-outline-variant/5">
          <p class="text-[10px] uppercase tracking-widest text-outline-variant font-bold mb-1">${item.subject || "Общий запрос"}</p>
          <p class="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">${item.message || "Без текста сообщения"}</p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-xs text-outline-variant">${item.createdAt ? new Date(item.createdAt).toLocaleString() : "Дата неизвестна"}</p>
          <div class="flex gap-2">
            <button data-done-request="${item.id}" class="text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 px-3 py-1 rounded-lg text-xs font-bold transition-all">Готово</button>
            <button data-del-request="${item.id}" class="text-red-400 bg-red-400/10 hover:bg-red-400/20 px-3 py-1 rounded-lg text-xs font-bold transition-all">Удалить</button>
          </div>
        </div>
      </div>`
    )
    .join("");
}

function renderStats() {
  const services = readJSON(STORAGE_KEYS.services, []);
  const news = readJSON(STORAGE_KEYS.news, []);
  const requests = readJSON(STORAGE_KEYS.requests, []);
  const newRequests = requests.filter((r) => r.status !== "done").length;
  document.getElementById("statsServices").textContent = String(services.length);
  document.getElementById("statsNews").textContent = String(news.length);
  document.getElementById("statsRequests").textContent = String(newRequests);
}

function renderAll() {
  renderServicesAdmin();
  renderNewsAdmin();
  renderRequestsAdmin();
  renderStats();
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  if (fd.get("login") === ADMIN_LOGIN && fd.get("password") === ADMIN_PASSWORD) {
    setAuth(true);
    mountAccess();
  } else {
    alert("Неверный логин или пароль.");
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  setAuth(false);
  mountAccess();
});

document.getElementById("serviceForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const list = readJSON(STORAGE_KEYS.services, []);
  list.unshift({
    id: crypto.randomUUID(),
    title: fd.get("title"),
    tag: fd.get("tag"),
    description: fd.get("description")
  });
  writeJSON(STORAGE_KEYS.services, list);
  e.currentTarget.reset();
  renderServicesAdmin();
});

document.getElementById("newsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const fd = new FormData(form);
  const fileInput = document.getElementById("newsImage");
  let imageBase64 = "";

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    imageBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const max = 1000;
          if (width > height) {
            if (width > max) { height *= max / width; width = max; }
          } else {
            if (height > max) { width *= max / height; height = max; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  const list = readJSON(STORAGE_KEYS.news, []);
  list.unshift({
    id: crypto.randomUUID(),
    title: fd.get("title"),
    content: fd.get("content"),
    image: imageBase64,
    date: new Date().toISOString().slice(0, 10)
  });
  try {
    writeJSON(STORAGE_KEYS.news, list);
    form.reset();
    renderNewsAdmin();
  } catch (err) {
    alert("Ошибка: файл слишком большой или в браузере закончилось место. Попробуйте фото меньшего размера.");
    console.error(err);
  }
});

document.body.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.delService) {
    const list = readJSON(STORAGE_KEYS.services, []).filter((x) => x.id !== btn.dataset.delService);
    writeJSON(STORAGE_KEYS.services, list);
    renderAll();
  }

  if (btn.dataset.editService) {
    const list = readJSON(STORAGE_KEYS.services, []);
    const current = list.find((x) => x.id === btn.dataset.editService);
    if (!current) return;
    const title = prompt("Название сервиса", current.title);
    if (!title) return;
    const tag = prompt("Тег", current.tag || "");
    const description = prompt("Описание", current.description);
    if (!description) return;
    const next = list.map((x) => (x.id === current.id ? { ...x, title, tag, description } : x));
    writeJSON(STORAGE_KEYS.services, next);
    renderAll();
  }

  if (btn.dataset.delNews) {
    const list = readJSON(STORAGE_KEYS.news, []).filter((x) => x.id !== btn.dataset.delNews);
    writeJSON(STORAGE_KEYS.news, list);
    renderAll();
  }

  if (btn.dataset.editNews) {
    const list = readJSON(STORAGE_KEYS.news, []);
    const current = list.find((x) => x.id === btn.dataset.editNews);
    if (!current) return;
    const title = prompt("Заголовок новости", current.title);
    if (!title) return;
    const content = prompt("Текст новости", current.content);
    if (!content) return;
    const next = list.map((x) => (x.id === current.id ? { ...x, title, content } : x));
    writeJSON(STORAGE_KEYS.news, next);
    renderAll();
  }

  if (btn.dataset.doneRequest) {
    const list = readJSON(STORAGE_KEYS.requests, []).map((x) =>
      x.id === btn.dataset.doneRequest ? { ...x, status: "done" } : x
    );
    writeJSON(STORAGE_KEYS.requests, list);
    renderAll();
  }

  if (btn.dataset.delRequest) {
    const list = readJSON(STORAGE_KEYS.requests, []).filter((x) => x.id !== btn.dataset.delRequest);
    writeJSON(STORAGE_KEYS.requests, list);
    renderAll();
  }
});

document.getElementById("exportDataBtn").addEventListener("click", () => {
  const dump = {
    services: readJSON(STORAGE_KEYS.services, []),
    news: readJSON(STORAGE_KEYS.news, []),
    requests: readJSON(STORAGE_KEYS.requests, [])
  };
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ea-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("resetDataBtn").addEventListener("click", () => {
  if (!confirm("Сбросить сервисы, новости и заявки?")) return;
  writeJSON(STORAGE_KEYS.services, []);
  writeJSON(STORAGE_KEYS.news, []);
  writeJSON(STORAGE_KEYS.requests, []);
  renderAll();
});

ensureDefaults();
mountAccess();
