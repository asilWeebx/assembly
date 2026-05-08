/**
 * admin.js
 * Talab: admin.html da <script src="./api.js"></script> bu fayldan OLDIN bo'lishi kerak
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('loginSection');
  const panelSection = document.getElementById('panelSection');

  // ── Mavjud token bo'lsa panelni ko'rsat ──────────────────────
  if (Api.getToken()) {
    showPanel();
  }

  // ══════════════════════════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════════════════════════
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd  = new FormData(e.target);
    const btn = e.target.querySelector('button');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';

    try {
      await Api.login(fd.get('login'), fd.get('password'));
      await showPanel();
    } catch {
      alert('Неверный логин или пароль');
    } finally {
      btn.disabled = false;
      btn.textContent = orig;
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  LOGOUT
  // ══════════════════════════════════════════════════════════════
  document.getElementById('logoutBtn').addEventListener('click', () => {
    Api.logout();
    panelSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });

  // ══════════════════════════════════════════════════════════════
  //  EXPORT JSON
  // ══════════════════════════════════════════════════════════════
  document.getElementById('exportDataBtn')?.addEventListener('click', async () => {
    try {
      const [news, requests] = await Promise.all([Api.getNews(), Api.getRequests()]);
      const blob = new Blob([JSON.stringify({ news, requests }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ea_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    } catch (err) {
      alert('Экспорт не удался: ' + err.message);
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  RESET (faqat services — localStorage)
  // ══════════════════════════════════════════════════════════════
  document.getElementById('resetDataBtn')?.addEventListener('click', () => {
    if (confirm('Локальные данные сервисов будут удалены. Продолжить?')) {
      localStorage.removeItem('ea_services');
      renderServices();
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  SHOW PANEL
  // ══════════════════════════════════════════════════════════════
  async function showPanel() {
    loginSection.classList.add('hidden');
    panelSection.classList.remove('hidden');
    await Promise.all([loadNews(), loadRequests()]);
    renderServices();
  }

  // ── 401 bo'lsa avtomatik logout ──────────────────────────────
  function handleUnauthorized() {
    alert('Сессия истекла. Войдите снова.');
    Api.logout();
    panelSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  }

  // ══════════════════════════════════════════════════════════════
  //  NEWS — LANGUAGE TABS
  // ══════════════════════════════════════════════════════════════
  document.querySelectorAll('[data-lang-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langTab;

      // Update tab styles
      document.querySelectorAll('[data-lang-tab]').forEach(t => {
        t.classList.remove('bg-primary', 'text-on-primary');
        t.classList.add('text-on-surface-variant', 'hover:text-on-surface');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface');

      // Show/hide panels
      document.querySelectorAll('.news-lang-panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById(`newsLang${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
      if (panel) panel.classList.remove('hidden');
    });
  });

  // ══════════════════════════════════════════════════════════════
  //  NEWS — FORM
  // ══════════════════════════════════════════════════════════════
  document.getElementById('newsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd        = new FormData(e.target);
    const imageFile = document.getElementById('newsImage')?.files[0];
    const btn       = e.target.querySelector('button[type="submit"], button:not([type="button"])');
    const origHTML  = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="opacity-60">Публикация...</span>';

    const payload = new FormData();
    payload.append('title',      fd.get('title')      || '');
    payload.append('content',    fd.get('content')    || '');
    payload.append('title_uz',   fd.get('title_uz')   || '');
    payload.append('content_uz', fd.get('content_uz') || '');
    payload.append('title_en',   fd.get('title_en')   || '');
    payload.append('content_en', fd.get('content_en') || '');
    if (imageFile) payload.append('image', imageFile);

    try {
      await Api.createNews(payload);
      e.target.reset();
      // Reset tabs back to RU
      document.querySelector('[data-lang-tab="ru"]')?.click();
      await loadNews();
    } catch (err) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        handleUnauthorized();
        return;
      }
      alert('Ошибка публикации: ' + err.message);
    } finally {
      btn.disabled  = false;
      btn.innerHTML = origHTML;
    }
  });

  // ── NEWS — load & render ─────────────────────────────────────
  async function loadNews() {
    const container = document.getElementById('adminNewsList');
    container.innerHTML = '<p class="text-on-surface-variant text-sm opacity-50">Загрузка...</p>';

    try {
      const news = await Api.getNews();
      document.getElementById('statsNews').textContent = news.length;

      if (!news.length) {
        container.innerHTML = '<p class="text-on-surface-variant text-sm">Новостей нет.</p>';
        return;
      }

      container.innerHTML = news.map(item => `
        <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-variant/10 border border-outline-variant/20">
          ${item.image_url
            ? `<img src="${item.image_url}" class="w-14 h-14 rounded-lg object-cover shrink-0" alt="" />`
            : `<div class="w-14 h-14 rounded-lg bg-surface-variant/30 shrink-0 flex items-center justify-center">
                 <span class="material-symbols-outlined text-xl text-outline">image</span>
               </div>`
          }
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm truncate">${item.title}</p>
            <p class="text-xs text-on-surface-variant mt-0.5">${item.date || ''}</p>
            <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${item.content}</p>
          </div>
          <button
            onclick="adminDeleteNews(${item.id})"
            class="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs font-bold transition-all"
            title="Удалить"
          >✕</button>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = '<p class="text-red-400 text-sm">Ошибка загрузки новостей.</p>';
      console.error(err);
    }
  }

  window.adminDeleteNews = async (id) => {
    if (!confirm('Удалить эту новость?')) return;
    try {
      await Api.deleteNews(id);
      await loadNews();
    } catch (err) {
      if (err.message.includes('401')) { handleUnauthorized(); return; }
      alert('Ошибка удаления: ' + err.message);
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  REQUESTS — load & render
  // ══════════════════════════════════════════════════════════════
  async function loadRequests() {
    const container = document.getElementById('adminRequestsList');
    container.innerHTML = '<p class="text-on-surface-variant text-sm opacity-50">Загрузка...</p>';

    try {
      const requests = await Api.getRequests();
      const newCount  = requests.filter(r => r.status === 'new').length;
      document.getElementById('statsRequests').textContent = newCount;

      if (!requests.length) {
        container.innerHTML = '<p class="text-on-surface-variant text-sm">Заявок пока нет.</p>';
        return;
      }

      const statusLabel = { new: '🆕 Новый', read: '👁 Прочитан', replied: '✅ Отвечен' };
      const statusColor = { new: 'text-amber-400', read: 'text-blue-400', replied: 'text-green-400' };

      container.innerHTML = requests.map(r => `
        <div class="p-4 rounded-xl bg-surface-variant/10 border border-outline-variant/20 space-y-2">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p class="font-semibold">
                ${r.name}
                ${r.org ? `<span class="text-on-surface-variant font-normal text-xs">· ${r.org}</span>` : ''}
              </p>
              <p class="text-xs text-on-surface-variant">${r.email}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs ${statusColor[r.status] || 'text-on-surface-variant'}">
                ${statusLabel[r.status] || r.status}
              </span>
              <select
                onchange="adminUpdateStatus(${r.id}, this.value)"
                class="text-xs rounded-lg bg-surface border-outline-variant px-2 py-1"
              >
                <option value="new"     ${r.status === 'new'     ? 'selected' : ''}>Новый</option>
                <option value="read"    ${r.status === 'read'    ? 'selected' : ''}>Прочитан</option>
                <option value="replied" ${r.status === 'replied' ? 'selected' : ''}>Отвечен</option>
              </select>
              <button
                onclick="adminDeleteRequest(${r.id})"
                class="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
              >✕</button>
            </div>
          </div>
          <p class="text-xs text-primary font-semibold">${r.subject}</p>
          <p class="text-sm text-on-surface-variant leading-relaxed">${r.message}</p>
          <p class="text-[10px] text-outline-variant">${new Date(r.created_at).toLocaleString('ru')}</p>
        </div>
      `).join('');
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleUnauthorized(); return;
      }
      container.innerHTML = '<p class="text-red-400 text-sm">Ошибка загрузки заявок.</p>';
      console.error(err);
    }
  }

  window.adminUpdateStatus = async (id, newStatus) => {
    try {
      await Api.updateRequestStatus(id, newStatus);
      await loadRequests();
    } catch (err) {
      if (err.message.includes('401')) { handleUnauthorized(); return; }
      alert('Ошибка обновления статуса');
    }
  };

  window.adminDeleteRequest = async (id) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      await Api.deleteRequest(id);
      await loadRequests();
    } catch (err) {
      if (err.message.includes('401')) { handleUnauthorized(); return; }
      alert('Ошибка удаления: ' + err.message);
    }
  };

  // ══════════════════════════════════════════════════════════════
  //  SERVICES (localStorage — backend yo'q)
  // ══════════════════════════════════════════════════════════════
  document.getElementById('serviceForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const services = JSON.parse(localStorage.getItem('ea_services') || '[]');
    services.unshift({
      id:          crypto.randomUUID(),
      title:       fd.get('title'),
      tag:         fd.get('tag'),
      description: fd.get('description'),
    });
    localStorage.setItem('ea_services', JSON.stringify(services));
    e.target.reset();
    renderServices();
  });

  function renderServices() {
    const services  = JSON.parse(localStorage.getItem('ea_services') || '[]');
    const container = document.getElementById('adminServicesList');
    document.getElementById('statsServices').textContent = services.length;

    if (!services.length) {
      container.innerHTML = '<p class="text-on-surface-variant text-sm">Сервисов нет.</p>';
      return;
    }

    container.innerHTML = services.map(s => `
      <div class="flex items-start gap-3 p-3 rounded-xl bg-surface-variant/10 border border-outline-variant/20">
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm">${s.title}</p>
          ${s.tag ? `<span class="text-xs text-primary">#${s.tag}</span>` : ''}
          <p class="text-xs text-on-surface-variant mt-1">${s.description}</p>
        </div>
        <button
          onclick="adminDeleteService('${s.id}')"
          class="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center text-xs font-bold shrink-0"
        >✕</button>
      </div>
    `).join('');
  }

  window.adminDeleteService = (id) => {
    if (!confirm('Удалить сервис?')) return;
    const services = JSON.parse(localStorage.getItem('ea_services') || '[]').filter(s => s.id !== id);
    localStorage.setItem('ea_services', JSON.stringify(services));
    renderServices();
  };
});