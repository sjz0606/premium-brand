(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i18n ---------- */
  const RU = {
    'skip': 'Перейти к содержанию',
    'nav.stores': 'Бутики', 'nav.shelves': 'На полках', 'nav.new': 'Новая коллекция', 'nav.video': 'Видео', 'nav.call': 'Позвонить',
    'hero.h': 'Адрес вашего стиля',
    'hero.p': 'Итальянская обувь, шерстяные куртки и двойки в четырёх бутиках Ташкента.',
    'hero.cta': 'Выбрать бутик', 'hero.hint': 'Листайте вниз: заходим в бутик', 'hero.arrive': 'Добро пожаловать', 'hero.tg': 'Telegram-канал', 'hero.meta': 'General Uzoqov, Afsona, Next и Poytaxt',
    'stores.h': 'Четыре бутика, один стиль',
    'stores.p': 'Приходите примерить, подобрать размер и заказать, или позвоните в ближайший бутик.',
    's1.addr': 'улица Генерала Узакова', 's2.addr': 'улица Беруни, ТЦ «Афсона»',
    's3.addr': 'улица Бабура, 6, ТРК «Next», возле фонтана', 's4.addr': 'улица Сайилгох, ТЦ «Пойтахт», 2 этаж, A208',
    'hours.ask': 'Часы работы уточняйте по телефону', 'h.next': 'Ежедневно, с 10:00 до 22:00', 'h.poytaxt': 'Ежедневно, с 10:00 до 20:00',
    'map': 'На карте', 'open': 'сейчас открыто', 'closed': 'сейчас закрыто',
    'shelves.h': 'Сейчас на полках', 'shelves.p': 'Цену и размер спросите в Telegram или по телефону.',
    'r.knit': 'Трикотажная кофта на молнии', 'r.suit': 'Серый костюм', 'r.sneakers': 'Тёмно-синие кеды', 'r.vest': 'Жилет',
    'r.loafers': 'Кожаные лоферы', 'r.overshirt': 'Чёрная рубашка-куртка', 'r.denim': 'Джинсы', 'r.corridor': 'Жилет и классические брюки',
    'col.h': 'Новый сезон, три модели',
    'm.kind': 'Куртка, новая коллекция', 'l.top': 'Верх', 'm.top': '100% натуральная шерсть', 'l.cloth': 'Ткань', 'l.sizes': 'Размеры', 'm.sizes': 'от S до 3XL',
    'n.kind': 'Обувь, новый сезон', 'l.material': 'Материал', 'n.mat': 'Натуральная кожа и шерсть', 'l.sole': 'Подошва', 'n.sole': 'Италия, ExtraLight',
    'l.why': 'Преимущества', 'n.why': 'Лёгкая, мягкая, не промокает', 'n.sizes': 'от 39 до 44',
    'i.kind': 'Двойка', 'i.cloth': 'Натуральная шерсть', 'l.cut': 'Крой', 'i.cut': 'Удобная посадка, современный вид', 'l.where': 'Где купить', 'i.where': 'Next, Poytaxt, General Uzoqov',
    'camp.h': 'Горы, озеро и старый Mercedes', 'camp.cap': 'Из осенней кампании, полностью в нашем Instagram.',
    'reels.h': 'Короткие видео из бутика', 'reels.ig': 'Более 2 400 публикаций в Instagram',
    'v.laces': 'Кожаные туфли на шнурках', 'v.bomber': 'Тёмно-синий бомбер', 'v.lake': 'Жилет у озера', 'v.sneaker': 'Кожаные кроссовки', 'v.overshirt': 'Серая рубашка-куртка', 'v.duo': 'За кадром кампании',
    'foot.order': 'Заказ и консультация', 'foot.stores': 'Бутики', 'foot.follow': 'Подписывайтесь',
    'foot.afsona': 'Afsona, улица Беруни', 'foot.next': 'Next, улица Бабура, 6', 'foot.poytaxt': 'Poytaxt, 2 этаж, A208',
    'foot.legal': 'Концепт сайта, не официальный сайт Premium Brand. Фото и видео со страницы бренда в Instagram.',
    'bar.default': 'Четыре бутика по Ташкенту', 'bar.cta': 'Адреса',
    'bar.open': (n, t) => `Сейчас открыт <strong>${n}</strong>, до ${t}`,
    'bar.closed': (t) => `Бутики откроются в ${t}, звоните заранее`,
    'video.pause': 'Остановить видео', 'video.play': 'Включить видео',
  };
  const UZ = {
    'open': 'hozir ochiq', 'closed': 'hozir yopiq',
    'bar.open': (n, t) => `Hozir <strong>${n}</strong> ochiq, ${t} gacha`,
    'bar.closed': (t) => `Butiklar ${t} da ochiladi, oldindan qo‘ng‘iroq qiling`,
    'video.pause': "Videoni to‘xtatish", 'video.play': "Videoni qo‘yish",
  };
  // capture the Uzbek text already in the HTML
  document.querySelectorAll('[data-i18n]').forEach((el) => { if (!(el.dataset.i18n in UZ)) UZ[el.dataset.i18n] = el.textContent; });

  let lang = 'uz';
  try { lang = localStorage.getItem('pb-lang') || 'uz'; } catch (e) {}
  const t = (k) => (lang === 'ru' ? RU : UZ)[k];

  function applyLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    document.title = l === 'ru' ? 'Premium Brand: бутики мужской одежды, Ташкент' : "Premium Brand: erkaklar kiyimi butiklari, Toshkent";
    document.querySelectorAll('.vbtn:not(.tunnel__pause)').forEach(syncBtn);
    updateHours();
    try { localStorage.setItem('pb-lang', l); } catch (e) {}
  }
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ---------- videos ---------- */
  const videos = [...document.querySelectorAll('video.loop')];
  const userPaused = new WeakSet();
  function syncBtn(btn) {
    const v = btn.parentElement.querySelector('video');
    const paused = v.paused;
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', t(paused ? 'video.play' : 'video.pause'));
  }
  document.querySelectorAll('.vbtn:not(.tunnel__pause)').forEach((btn) => {
    const v = btn.parentElement.querySelector('video');
    btn.addEventListener('click', () => {
      if (v.paused) { userPaused.delete(v); v.play().catch(() => {}); } else { userPaused.add(v); v.pause(); }
    });
    v.addEventListener('play', () => syncBtn(btn));
    v.addEventListener('pause', () => syncBtn(btn));
    syncBtn(btn);
  });
  if (reduce) videos.forEach((v) => userPaused.add(v));
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting && !userPaused.has(v) && !v.closest('[hidden]')) { v.preload = 'auto'; v.play().catch(() => {}); }
      else if (!e.isIntersecting) v.pause();
    });
  }, { threshold: 0.35 });
  videos.forEach((v) => vio.observe(v));

  /* ---------- tabs ---------- */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab) {
    tabs.forEach((x) => {
      const on = x === tab;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute('aria-controls'));
      p.hidden = !on;
      const v = p.querySelector('video');
      if (v) { if (on && !userPaused.has(v)) v.play().catch(() => {}); else v.pause(); }
    });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); tabs[j].focus(); select(tabs[j]); }
    });
  });

  /* ---------- hours, Tashkent time (UTC+5) ---------- */
  function tashkentHour() {
    const now = new Date();
    const utc = now.getUTCHours() + now.getUTCMinutes() / 60;
    return (utc + 5) % 24;
  }
  function updateHours() {
    const h = tashkentHour();
    const open = [];
    document.querySelectorAll('.store[data-open]').forEach((s) => {
      const o = +s.dataset.open, c = +s.dataset.close;
      const isOpen = h >= o && h < c;
      const st = s.querySelector('[data-state]');
      st.dataset.open = String(isOpen);
      st.textContent = ', ' + t(isOpen ? 'open' : 'closed');
      if (isOpen) open.push({ name: s.querySelector('h3').textContent, close: c });
    });
    const bar = document.querySelector('[data-visit]');
    if (!bar) return;
    if (open.length) {
      const last = open.sort((a, b) => b.close - a.close)[0];
      bar.innerHTML = t('bar.open')(last.name, `${last.close}:00`);
    } else {
      bar.innerHTML = t('bar.closed')('10:00');
    }
  }
  setInterval(updateHours, 60000);

  /* ---------- visit bar appears after the hero ---------- */
  const vb = document.querySelector('.visitbar'), hero = document.getElementById('tunnel');
  if (vb && hero) {
    const upd = () => vb.classList.toggle('is-off', hero.getBoundingClientRect().bottom > innerHeight * 0.6);
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- 3D tilt on the shelf photographs and reels ---------- */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.item, .reel, .campaign__pair .frame').forEach((el) => {
      el.classList.add('tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- one reveal ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.store, .rail__track > li, .spec__rows > div');
    els.forEach((el) => {
      el.classList.add('reveal');
      const sib = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--i', Math.min(sib, 6));
    });
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => rio.observe(el));
  }

  applyLang(lang);
})();
