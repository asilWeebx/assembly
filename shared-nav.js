(() => {
  // Prevent duplicate injection if script is loaded more than once
  if (document.querySelector(".shared-nav-wrapper")) return;

  const THEME_KEY = "ea_theme";
  const LANG_KEY = "ea_lang";

  // Ensure I18N exists
  window.I18N = window.I18N || { common: {} };
  
  // Dynamic font and style injection
  if (!document.getElementById("shared-nav-assets")) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    
    const style = document.createElement("style");
    style.id = "shared-nav-styles";
    style.textContent = `
      .nav-desktop-only { display: none !important; }
      .nav-mobile-only { display: flex !important; }
      @media (min-width: 1024px) {
        .nav-desktop-only { display: flex !important; }
        .nav-mobile-only { display: none !important; }
      }
      .shared-nav-wrapper nav a { 
        font-size: 14px; 
        font-weight: 500; 
        white-space: nowrap;
      }
    `;
    
    document.head.append(font, style);
    const meta = document.createElement("meta");
    meta.id = "shared-nav-assets";
    document.head.appendChild(meta);
  }

  const navItems = [
    { href: "./index.html", key: "navHome" },
    { href: "./about.html", key: "navAbout" },
    { href: "./services.html", key: "navServices" },
    { href: "associations.html", key: "navAssociations" },
    { href: "projects.html", key: "navProjects" },
    { href: "news.html", key: "navNews" },
    { href: "contacts.html", key: "navContacts" }
  ];

  // Built-in translations — no dependency on i18n.js load order
  const NAV_LABELS = {
    ru: {
      navHome: "Главная", navAbout: "О нас", navServices: "Сервисы",
      navAssociations: "Ассоциации", navProjects: "Проекты",
      navNews: "Новости", navContacts: "Контакты", contactUsBtn: "Связаться"
    },
    uz: {
      navHome: "Bosh sahifa", navAbout: "Biz haqimizda", navServices: "Xizmatlar",
      navAssociations: "Assotsiatsiyalar", navProjects: "Loyihalar",
      navNews: "Yangiliklar", navContacts: "Kontaktlar", contactUsBtn: "Bog'lanish"
    },
    en: {
      navHome: "Home", navAbout: "About Us", navServices: "Services",
      navAssociations: "Associations", navProjects: "Projects",
      navNews: "News", navContacts: "Contacts", contactUsBtn: "Contact Us"
    }
  };

  const currentLang = localStorage.getItem(LANG_KEY) || "ru";
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  const pathParts = location.pathname.split("/").filter(Boolean);
  const isSubdir = pathParts.length > 1;
  const relPath = isSubdir ? "../" : "./";
  const t = (key) => (NAV_LABELS[currentLang] || NAV_LABELS.ru)[key] || key;

  const navLinks = navItems
    .map((item) => {
      const cleanHref = item.href.replace("./", "");
      const isHomeResult = cleanHref === "index.html";
      const targetPath = relPath + cleanHref;
      const active = location.pathname.endsWith(cleanHref) || (location.pathname.endsWith("/") && isHomeResult);
      
      const label = t(item.key);
      const cls = active
        ? "text-primary font-bold border-b-2 border-primary pb-1"
        : "text-on-surface-variant hover:text-primary transition-colors";
      return `<a href="${targetPath}" class="${cls}" data-i18n="${item.key}">${label}</a>`;
    })
    .join("");

  const mobileNavLinks = navItems
    .map((item) => {
      const cleanHref = item.href.replace("./", "");
      const targetPath = relPath + cleanHref;
      const active = location.pathname.endsWith(cleanHref);

      const label = t(item.key);
      
      const cls = active
        ? "block px-3 py-2 rounded-lg bg-[#93ccff]/15 text-[#93ccff] font-semibold"
        : "block px-3 py-2 rounded-lg text-slate-200 hover:bg-white/5";
      return `<a href="${targetPath}" class="${cls}" data-i18n="${item.key}">${label}</a>`;
    })
    .join("");

  // Remove old themeStyle injection and replace with cleaner logic
  const wrapper = document.createElement("header");
  wrapper.className =
    "shared-nav-wrapper fixed top-0 w-full z-[60] bg-background/80 backdrop-blur-xl border-b border-outline-variant/15 transition-colors duration-300";
  wrapper.innerHTML = `
    <div class="max-w-screen-2xl mx-auto px-4 md:px-12 py-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <button id="mobileMenuBtn" class="nav-mobile-only w-10 h-10 rounded-xl bg-surface-variant text-on-surface border border-outline-variant/30 flex items-center justify-center transition-all hover:scale-95" aria-label="Open menu">
          ☰
        </button>
        <a href="${relPath}index.html" class="flex items-center group">
          <img id="globalNavLogo" src="${relPath}img/assembly-logo-uz.png" alt="Economic Assembly" class="h-16 md:h-24 w-auto object-contain transition-all group-hover:scale-105">
        </a>
      </div>
      <nav class="nav-desktop-only items-center gap-6">${navLinks}</nav>
      <div class="flex items-center gap-3">
        <div data-lang-switcher class="flex items-center">
          <select id="globalLangSelect" data-shared-lang class="rounded-lg bg-surface text-on-surface border border-outline-variant/25 px-2 py-1 text-sm focus:ring-2 focus:ring-primary/40 outline-none">
            <option value="ru">RU</option>
            <option value="uz">UZ</option>
            <option value="en">EN</option>
          </select>
        </div>
        <button id="globalContactBtn" class="hidden md:flex bg-primary text-on-primary px-6 py-2 rounded-xl font-bold hover:scale-95 transition-all text-sm active:opacity-80" data-i18n="contactUsBtn">${t('contactUsBtn')}</button>
        <button id="globalThemeToggle" class="w-10 h-10 rounded-xl bg-surface-variant text-on-surface flex items-center justify-center border border-outline-variant/30 transition-all hover:scale-95 active:rotate-12" aria-label="Theme toggle">
          <span id="globalThemeIcon" aria-hidden="true" class="material-symbols-outlined transition-transform duration-500" style="font-size:20px;">dark_mode</span>
        </button>
      </div>
    </div>
    <div id="mobileMenuPanel" style="display:none" class="px-4 pb-4">
      <div class="rounded-2xl bg-surface border border-outline-variant/20 p-3 space-y-1 shadow-xl">
        ${mobileNavLinks}
      </div>
    </div>
  `;

  // Hide existing navs, headers or asides to prevent duplicates
  document.querySelectorAll("nav, header:not(.shared-nav-wrapper), aside").forEach(el => {
    if (el.id !== "mobileMenuPanel") el.style.display = "none";
  });

  document.body.prepend(wrapper);
  document.body.style.paddingTop = "80px";

  const icon = wrapper.querySelector("#globalThemeIcon");
  const btn = wrapper.querySelector("#globalThemeToggle");
  const langSelect = wrapper.querySelector("#globalLangSelect");
  const mobileBtn = wrapper.querySelector("#mobileMenuBtn");
  const mobilePanel = wrapper.querySelector("#mobileMenuPanel");
  const navLogo = wrapper.querySelector("#globalNavLogo");

  const applyTheme = (theme) => {
    const isLight = theme === "light";
    document.documentElement.classList.toggle("dark", !isLight);
    document.body.classList.toggle("light-mode", isLight);
    
    // Explicit logo visibility control
    if (navLogo) {
      // Light Mode: Black logo (brightness 0)
      // Dark Mode: White logo (brightness 0 + invert 1)
      navLogo.style.filter = isLight ? "brightness(0)" : "brightness(0) invert(1)";
    }

    if (icon) {
      icon.textContent = isLight ? "light_mode" : "dark_mode";
      icon.style.color = isLight ? "#f59e0b" : "#60a5fa";
      icon.style.transform = isLight ? "rotate(180deg)" : "rotate(0deg)";
    }
  };

  applyTheme(savedTheme);

  btn?.addEventListener("click", () => {
    const next = document.body.classList.contains("light-mode") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  if (langSelect) langSelect.value = currentLang;
  langSelect?.addEventListener("change", (e) => {
    localStorage.setItem(LANG_KEY, e.target.value);
    window.location.reload();
  });

  let menuOpen = false;
  mobileBtn?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    mobilePanel.style.display = menuOpen ? "block" : "none";
    mobileBtn.textContent = menuOpen ? "✕" : "☰";
  });
  // Close menu when a link is clicked
  mobilePanel?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menuOpen = false;
      mobilePanel.style.display = "none";
      mobileBtn.textContent = "☰";
    });
  });

  // Modal support
  const contactBtn = wrapper.querySelector("#globalContactBtn");
  contactBtn?.addEventListener("click", () => {
    const modal = document.getElementById("requestModal");
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    } else {
      window.location.href = relPath + "contacts.html";
    }
  });

  const closeBtn = document.getElementById("closeRequestModal");
  closeBtn?.addEventListener("click", () => {
    const modal = document.getElementById("requestModal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });

  // Robust translation trigger
  const triggerTranslation = (retries = 0) => {
    if (window.applyTranslations && window.I18N && window.I18N.common) {
      window.applyTranslations(currentLang);
    } else if (retries < 20) {
      // Incremental backoff for robustness
      setTimeout(() => triggerTranslation(retries + 1), 50 + (retries * 10));
    }
  };
  triggerTranslation();

  // Multi-tab synchronization
  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // Ensure theme sync on focus (in case storage event was missed)
  window.addEventListener("focus", () => {
    const freshTheme = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(freshTheme);
  });
})();
