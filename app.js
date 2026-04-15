const STORAGE_KEYS = {
  services: "ea_services",
  news: "ea_news",
  requests: "ea_requests"
};

const defaultServices = [
  { id: "1", title: "Invest Hub", description: "Поиск и сопровождение инвестиционных проектов.", tag: "Invest", href: "./service-invest-hub.html" },
  { id: "2", title: "Reportaj GO", description: "Профессиональное видеопроизводство и медиа.", tag: "Media", href: "./service-reportaj-go.html" },
  { id: "3", title: "Smart City", description: "Цифровой город Ohangaron Smart City.", tag: "GovTech", href: "./service-smart-city.html" },
  { id: "4", title: "Bizness Darcha", description: "Единое окно для всех бизнес-услуг.", tag: "Business", href: "./service-bizness-darja.html" },
  { id: "5", title: "Edu & Job", description: "Обучение и трудоустройство специалистов.", tag: "Education", href: "./service-edu-jo.html" },
  { id: "6", title: "Networking", description: "Клуб Mashvarat и деловые связи.", tag: "Networking", href: "./service-networking.html" }
];

const defaultNews = [
  { id: crypto.randomUUID(), title: "Запуск новой программы поддержки МСБ", content: "Ассамблея представила пакет мер для малого и среднего бизнеса.", date: new Date().toISOString().slice(0, 10), href: "./news.html" },
  { id: crypto.randomUUID(), title: "Подписано международное соглашение", content: "Расширено сотрудничество с зарубежными инвесторами.", date: new Date().toISOString().slice(0, 10), href: "./associations.html" }
];

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

function ensureDefaults() {
  // Always set latest services to ensure links are correct after modernization
  writeJSON(STORAGE_KEYS.services, defaultServices);
  
  if (!localStorage.getItem(STORAGE_KEYS.news)) writeJSON(STORAGE_KEYS.news, defaultNews);
  if (!localStorage.getItem(STORAGE_KEYS.requests)) writeJSON(STORAGE_KEYS.requests, []);
}

function renderServices() {
  const services = readJSON(STORAGE_KEYS.services, []);
  const root = document.getElementById("servicesList");
  if (!root) return;
  
  root.innerHTML = services
    .map(
      (item) => `
      <article class="glass-card rounded-[2rem] p-8 flex flex-col h-full group">
        <div class="flex-1">
          <p class="text-xs uppercase tracking-[0.2em] text-primary/60 font-bold mb-3">${item.tag || "Service"}</p>
          <h3 class="font-headline text-2xl font-bold mb-4 group-hover:text-primary transition-colors">${item.title}</h3>
          <p class="text-on-surface-variant leading-relaxed">${item.description}</p>
        </div>
        <div class="mt-8">
          <a href="${item.href || "./services.html"}" 
             class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-variant text-on-surface font-bold hover:bg-primary hover:text-on-primary transition-all duration-300 group/btn"
             data-i18n="openPage">
            <span data-i18n="openPage">Открыть страницу</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover/btn:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>
      </article>`
    )
    .join("");
}

function renderNews() {
  const news = readJSON(STORAGE_KEYS.news, []);
  const root = document.getElementById("newsList");
  root.innerHTML = news
    .map(
      (item) => `
      <article class="glass-card rounded-[1.7rem] p-7">
        <p class="text-xs uppercase tracking-widest text-tertiary mb-2">${item.date || ""}</p>
        <h3 class="font-headline text-2xl font-bold mb-3">${item.title}</h3>
        <p class="text-on-surface-variant">${item.content}</p>
        <a href="${item.href || "./news.html"}" class="inline-block mt-4 text-sm text-tertiary">Читать подробнее</a>
      </article>`
    )
    .join("");
}

function initModal() {
  const modal = document.getElementById("requestModal");
  const openBtn = document.getElementById("openRequestModal");
  const closeBtn = document.getElementById("closeRequestModal");
  const form = document.getElementById("requestForm");

  openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  openBtn.addEventListener("click", () => modal.classList.add("flex"));
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const requests = readJSON(STORAGE_KEYS.requests, []);
    requests.unshift({
      id: crypto.randomUUID(),
      name: fd.get("name"),
      phone: fd.get("phone"),
      message: fd.get("message"),
      createdAt: new Date().toISOString()
    });
    writeJSON(STORAGE_KEYS.requests, requests);
    form.reset();
    alert("Заявка отправлена.");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });
}

ensureDefaults();
renderNews();
initModal();
