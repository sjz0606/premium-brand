// Hero: a spiral tunnel of the brand's own Instagram photographs and reels.
// Scrolling flies the camera through it; the far end is the boutique interior.
import * as THREE from 'three';

const section = document.getElementById('tunnel');
const stage = section && section.querySelector('.tunnel__stage');
const canvas = section && section.querySelector('.tunnel__canvas');
const intro = document.querySelector('.intro');
const introFill = intro && intro.querySelector('.intro__fill');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function endIntro() {
  if (!intro || intro.classList.contains('is-done')) return;
  intro.classList.add('is-done');
  setTimeout(() => intro.classList.add('is-gone'), 900);
}

function cssColor(name, fallback) {
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    c.fillStyle = fallback; c.fillStyle = raw; c.fillRect(0, 0, 1, 1);
    const d = c.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(d[0] / 255, d[1] / 255, d[2] / 255, THREE.SRGBColorSpace);
  } catch (e) { return new THREE.Color(fallback); }
}

const MEDIA = [
  { src: 'media/hero-car.jpg', a: 1200 / 1600 },
  { src: 'media/v-lake.mp4', a: 9 / 16, video: true },
  { src: 'media/r-suit.jpg', a: 720 / 1280 },
  { src: 'media/campaign-walk.jpg', a: 1000 / 1333 },
  { src: 'media/r-knit.jpg', a: 720 / 1280 },
  { src: 'media/v-hero.mp4', a: 9 / 16, video: true },
  { src: 'media/r-loafers.jpg', a: 800 / 1067 },
  { src: 'media/campaign-knit.jpg', a: 1000 / 1333 },
  { src: 'media/r-overshirt.jpg', a: 800 / 1067 },
  { src: 'media/r-sneakers.jpg', a: 720 / 1280 },
  { src: 'media/v-duo.mp4', a: 9 / 16, video: true },
  { src: 'media/campaign-grille.jpg', a: 1200 / 1600 },
  { src: 'media/r-vest.jpg', a: 800 / 1067 },
  { src: 'media/r-corridor.jpg', a: 800 / 1067 },
  { src: 'media/r-denim.jpg', a: 720 / 1280 },
  { src: 'media/v-bomber.mp4', a: 9 / 16, video: true },
];
const END = { src: 'media/end-corridor.jpg', a: 1400 / 1867 };

function cover(tex, imgA, planeA, fy = 0.5) {
  tex.repeat.set(1, 1); tex.offset.set(0, 0);
  if (imgA > planeA) { tex.repeat.x = planeA / imgA; tex.offset.x = (1 - tex.repeat.x) / 2; }
  else { tex.repeat.y = imgA / planeA; tex.offset.y = (1 - tex.repeat.y) * fy; }
}

function start() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { endIntro(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ink = cssColor('--color-ink', '#1f1b17');
  const paper = cssColor('--color-paper', '#f3eee4');
  const scene = new THREE.Scene();
  scene.background = ink;
  scene.fog = new THREE.Fog(ink, 7, 26);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
  const group = new THREE.Group();
  scene.add(group);

  // loading, with real progress into the intro bar
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_u, done, total) => { if (introFill) introFill.style.setProperty('--p', String(Math.max(0.05, done / total))); };
  let ready = false;
  manager.onLoad = () => { ready = true; document.documentElement.classList.add('is-3d'); endIntro(); };
  const loader = new THREE.TextureLoader(manager);
  const videos = [];

  function textureFor(m) {
    if (m.video) {
      const v = document.createElement('video');
      v.src = m.src; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('playsinline', ''); v.crossOrigin = 'anonymous';
      videos.push(v);
      const t = new THREE.VideoTexture(v);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const t = loader.load(m.src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  // frames along a helix
  const N = 30, DZ = 2.05, TURN = 0.52;
  const FW = 2.1, FH = 2.62;
  const planeA = FW / FH;
  const geo = new THREE.PlaneGeometry(FW, FH);
  const edgeGeo = new THREE.PlaneGeometry(FW + 0.06, FH + 0.06);
  const edgeMat = new THREE.MeshBasicMaterial({ color: paper, transparent: true, opacity: 0.22 });
  const textures = MEDIA.map((m) => { const t = textureFor(m); cover(t, m.a, planeA); return t; });
  const frames = [];
  for (let i = 0; i < N; i++) {
    const k = i % MEDIA.length;
    const holder = new THREE.Group();
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: textures[k], toneMapped: false }));
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.z = -0.01;
    holder.add(edge, mesh);
    group.add(holder);
    frames.push(holder);
  }

  // the far end: the boutique itself
  const endTex = loader.load(END.src); endTex.colorSpace = THREE.SRGBColorSpace;
  const endMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: endTex, toneMapped: false, fog: false }));
  scene.add(endMesh);
  const Z_END = -(N * DZ) - 4;
  const CAM_START = 4.2, CAM_END = Z_END + 5;

  function layout() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const narrow = camera.aspect < 0.85;
    const R = narrow ? 1.7 : 2.9;
    const squash = narrow ? 1.15 : 0.62;
    frames.forEach((f, i) => {
      const a = i * TURN;
      const z = -i * DZ;
      f.position.set(Math.cos(a) * R, Math.sin(a) * R * squash, z);
      f.scale.setScalar(narrow ? 0.82 : 1);
      f.lookAt(0, 0, z + (narrow ? 5 : 7));
    });
    // end plane covers the view at the final camera distance
    const dist = CAM_END - Z_END;
    const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist * 1.3;
    const vw = vh * camera.aspect;
    endMesh.scale.set(vw, vh, 1);
    endMesh.position.set(0, 0, Z_END);
    cover(endTex, END.a, vw / vh, 0.68);
  }
  layout();
  addEventListener('resize', layout);

  // scroll progress through the pinned hero
  const fly = [...section.querySelectorAll('[data-fly]')];
  const arrive = section.querySelector('[data-arrive]');
  let target = 0, p = 0;
  function readScroll() {
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - stage.offsetHeight;
    target = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }
  addEventListener('scroll', readScroll, { passive: true });
  readScroll(); p = target;

  // pause control for the ambient spin and the reels inside the tunnel
  const pauseBtn = section.querySelector('.tunnel__pause');
  let paused = reduce;
  const label = () => {
    const ru = document.documentElement.lang === 'ru';
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? (ru ? 'Включить движение' : 'Harakatni yoqish') : (ru ? 'Остановить движение' : 'Harakatni to‘xtatish'));
  };
  label();
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  pauseBtn.addEventListener('click', () => { paused = !paused; label(); syncVideos(); });

  let visible = true;
  function syncVideos() { videos.forEach((v) => { if (visible && !paused) v.play().catch(() => {}); else v.pause(); }); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; syncVideos(); if (visible) loop(); }, { threshold: 0 }).observe(section);
  syncVideos();

  const clock = new THREE.Clock();
  let spin = 0, raf = 0;
  const ease = (x) => x * x * (3 - 2 * x);
  function frame() {
    raf = 0;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!paused) spin += dt * 0.05;
    p += (target - p) * (reduce ? 1 : Math.min(1, dt * 6));
    const e = ease(p);
    const f = Math.sin(Math.min(e / 0.86, 1) * Math.PI);
    camera.position.set(f * 0.35, f * 0.18, CAM_START + (CAM_END - CAM_START) * e);
    camera.lookAt(0, 0, camera.position.z - 10);
    camera.rotation.z = f * 0.4;
    group.rotation.z = spin + e * 2.2;
    renderer.render(scene, camera);

    const out = Math.max(0, 1 - p * 5);
    fly.forEach((el) => { el.style.opacity = String(out); el.style.transform = `translateY(${(-p * 160).toFixed(1)}px)`; el.style.visibility = out < 0.02 ? 'hidden' : 'visible'; });
    if (arrive) arrive.style.opacity = String(Math.min(1, Math.max(0, (p - 0.84) / 0.12)));

    if (visible) raf = requestAnimationFrame(frame);
  }
  function loop() { if (!raf) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
  loop();

  // never hold the page behind the curtain
  setTimeout(() => { if (!ready) { document.documentElement.classList.add('is-3d'); endIntro(); } }, 4500);
}

if (section && canvas) start(); else endIntro();
