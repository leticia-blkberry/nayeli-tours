// ===== Configuración =====
// Número de WhatsApp con código de país, solo dígitos (ej. México: "5219511234567").
// Mientras esté vacío, los botones de WhatsApp abren Messenger de la página de Facebook.
const WHATSAPP_NUMBER = "529511067780";
const MESSENGER_URL = "https://m.me/Nayetours";

// ===== Enlaces de WhatsApp =====
document.querySelectorAll(".js-whatsapp").forEach((el) => {
  const msg = el.dataset.msg || "¡Hola! Quiero información sobre Nadxheelii Tours.";
  el.href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    : MESSENGER_URL;
  el.target = "_blank";
  el.rel = "noopener";
});

// ===== Menú móvil =====
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  })
);

// ===== Encabezado al hacer scroll =====
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Galería: si falta una foto, se muestra una ilustración =====
document.querySelectorAll(".g-item img").forEach((img) => {
  const fail = () => img.closest(".g-item").classList.add("no-img");
  if (img.complete && img.naturalWidth === 0) fail();
  img.addEventListener("error", fail);
});

// ===== Animación al aparecer =====
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".section-head, .pillar, .journey, .tour, .g-item, .review, .event, .care-list li")
    .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Magia: estrellas, esporas brillantes y destellos del cursor =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Botón "Pausar animaciones": cada animación se registra aquí para detenerse/reanudarse
let motionPaused = false;
const motionHooks = [];

// Estrellas en el cielo del hero
const starsGroup = document.getElementById("stars");
if (starsGroup) {
  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 140; i++) {
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", (Math.random() * 1440).toFixed(1));
    c.setAttribute("cy", (Math.pow(Math.random(), 1.6) * 560).toFixed(1));
    c.setAttribute("r", (Math.random() * 1.3 + 0.3).toFixed(2));
    c.style.animationDelay = `${(-Math.random() * 3).toFixed(2)}s`;
    c.style.animationDuration = `${(2 + Math.random() * 4).toFixed(2)}s`;
    starsGroup.appendChild(c);
  }
}

const canvas = document.getElementById("magic");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  // Colores del logo: crema y tonos salvia
  const colors = ["243,238,225", "243,238,225", "208,209,195", "173,180,166"];
  let w, h, dpr, spores = [], sparks = [];

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    const count = innerWidth < 700 ? 22 : 45;
    while (spores.length < count) spores.push(newSpore(true));
    spores.length = count;
  };
  const newSpore = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 20,
    r: (Math.random() * 1.8 + 0.6) * dpr,
    vy: -(Math.random() * 0.25 + 0.08) * dpr,
    phase: Math.random() * Math.PI * 2,
    sway: Math.random() * 0.6 + 0.2,
    c: colors[(Math.random() * colors.length) | 0],
  });

  const glowDot = (x, y, r, c, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
    g.addColorStop(0, `rgba(${c},${a})`);
    g.addColorStop(0.25, `rgba(${c},${a * 0.45})`);
    g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 6, 0, Math.PI * 2);
    ctx.fill();
  };

  let t = 0, running = true;
  const tick = () => {
    if (!running || motionPaused) return;
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (const s of spores) {
      s.y += s.vy;
      s.x += Math.sin(t * s.sway + s.phase) * 0.25 * dpr;
      if (s.y < -20) Object.assign(s, newSpore(false));
      const a = 0.35 + 0.35 * Math.sin(t * 1.5 + s.phase);
      glowDot(s.x, s.y, s.r, s.c, a);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.02 * dpr; p.life -= 0.022;
      if (p.life <= 0) { sparks.splice(i, 1); continue; }
      glowDot(p.x, p.y, p.r, p.c, p.life * 0.9);
    }
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(tick);
  };

  // Destellos que siguen el cursor (solo con mouse)
  if (window.matchMedia("(pointer: fine)").matches) {
    let last = 0;
    window.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 28) return;
      last = now;
      sparks.push({
        x: e.clientX * dpr, y: e.clientY * dpr,
        vx: (Math.random() - 0.5) * 0.8 * dpr, vy: (Math.random() - 0.8) * 0.8 * dpr,
        r: (Math.random() * 1.2 + 0.6) * dpr, life: 1,
        c: colors[(Math.random() * colors.length) | 0],
      });
      if (sparks.length > 60) sparks.shift();
    }, { passive: true });
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !motionPaused) requestAnimationFrame(tick);
  });
  motionHooks.push((paused) => { if (paused) ctx.clearRect(0, 0, w, h); else if (running) requestAnimationFrame(tick); });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
}

// ===== Máquina de escribir: servicios del logo =====
const typed = document.querySelector(".typed");
if (typed && !reduceMotion) {
  const out = typed.querySelector(".typed-text");
  const words = typed.dataset.words.split("|");
  // Los lectores de pantalla leen la lista completa; el texto animado queda oculto para ellos
  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.textContent = words.join(" ");
  typed.prepend(sr);
  out.setAttribute("aria-hidden", "true");
  out.textContent = "";
  let w = 0, i = 0, deleting = false, timerId;
  const later = (fn, ms) => { timerId = setTimeout(fn, ms); };
  motionHooks.push((paused) => {
    clearTimeout(timerId);
    if (paused) { out.textContent = words[w]; i = words[w].length; deleting = true; }
    else later(step, 1200);
  });
  const step = () => {
    const word = words[w];
    if (!deleting) {
      out.textContent = word.slice(0, ++i);
      if (i === word.length) { deleting = true; return later(step, 1800); }
      return later(step, 85);
    }
    out.textContent = word.slice(0, --i);
    if (i === 0) { deleting = false; w = (w + 1) % words.length; return later(step, 350); }
    later(step, 40);
  };
  later(step, 2000);
}

// ===== Video de la portada: sin reproducción automática con movimiento reducido =====
const heroVideo = document.querySelector(".hero-video");
if (heroVideo && reduceMotion) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
  heroVideo.controls = true;
}

// ===== Recorrido interactivo: Llegada → Caminata → Experiencia → Integración =====
document.querySelectorAll("[data-journey]").forEach((root) => {
  const stops = [...root.querySelectorAll(".journey-stop")];
  const panels = [...root.querySelectorAll(".journey-panel")];
  const timer = root.querySelector(".journey-timer");
  const last = stops.length - 1;
  let current = 0;

  const show = (i, focus) => {
    current = (i + stops.length) % stops.length;
    stops.forEach((s, k) => {
      const on = k === current;
      s.classList.toggle("is-active", on);
      s.classList.toggle("is-done", k < current);
      s.setAttribute("aria-selected", String(on));
      s.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p, k) => p.classList.toggle("is-active", k === current));
    root.style.setProperty("--fill", `${(current / last) * 100}%`);
    if (focus) stops[current].focus();
    // restart the countdown bar
    if (timer) { timer.style.animation = "none"; void timer.offsetWidth; timer.style.animation = ""; }
  };

  // Autoplay (never with reduced motion); stops for good once the visitor takes over
  let autoplay = !reduceMotion;
  const stopAutoplay = () => { autoplay = false; root.classList.remove("is-playing"); };
  if (timer) timer.addEventListener("animationend", () => { if (autoplay) show(current + 1); });

  stops.forEach((s, k) => s.addEventListener("click", () => { stopAutoplay(); show(k); }));
  root.querySelectorAll(".journey-arrow").forEach((b) =>
    b.addEventListener("click", () => { stopAutoplay(); show(current + Number(b.dataset.dir)); }));
  root.querySelector(".journey-track").addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (e.key === "Home" || e.key === "End") { e.preventDefault(); stopAutoplay(); show(e.key === "Home" ? 0 : last, true); return; }
    if (!k) return;
    e.preventDefault(); stopAutoplay(); show(current + k, true);
  });

  // Pause while hovered or focused
  const pause = (on) => root.classList.toggle("is-paused", on);
  root.addEventListener("mouseenter", () => pause(true));
  root.addEventListener("mouseleave", () => pause(root.contains(document.activeElement)));
  root.addEventListener("focusin", () => pause(true));
  root.addEventListener("focusout", (e) => { if (!root.contains(e.relatedTarget)) pause(false); });

  // Only run while the section is on screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => root.classList.toggle("is-playing", autoplay && en.isIntersecting), { threshold: 0.4 }).observe(root);
  } else if (autoplay) root.classList.add("is-playing");

  root.classList.add("is-ready");
  show(0);
});

// ===== Video: también se detiene con el botón de pausa =====
if (heroVideo && !reduceMotion) {
  motionHooks.push((paused) => { if (paused) heroVideo.pause(); else heroVideo.play().catch(() => {}); });
}

// ===== Botón "Pausar animaciones" (WCAG 2.2.2): detiene video, partículas, texto y animaciones =====
const motionBtn = document.querySelector(".motion-toggle");
if (motionBtn && !reduceMotion) {
  const applyMotion = (paused) => {
    motionPaused = paused;
    document.documentElement.classList.toggle("motion-off", paused);
    motionBtn.setAttribute("aria-pressed", String(paused));
    const label = paused ? "Reanudar animaciones" : "Pausar animaciones";
    motionBtn.setAttribute("aria-label", label);
    motionBtn.title = label;
    motionHooks.forEach((fn) => fn(paused));
  };
  let saved = false;
  try { saved = localStorage.getItem("nt-motion-off") === "1"; } catch (e) {}
  if (saved) applyMotion(true);
  motionBtn.addEventListener("click", () => {
    const paused = !motionPaused;
    applyMotion(paused);
    try { localStorage.setItem("nt-motion-off", paused ? "1" : "0"); } catch (e) {}
  });
}

// ===== Enlaces que abren otra pestaña: avisar a los lectores de pantalla =====
document.querySelectorAll('a[target="_blank"]').forEach((a) => {
  if (a.querySelector(".sr-only")) return;
  const note = document.createElement("span");
  note.className = "sr-only";
  note.textContent = " (se abre en una pestaña nueva)";
  a.append(note);
  if (a.hasAttribute("aria-label")) a.setAttribute("aria-label", a.getAttribute("aria-label") + " (se abre en una pestaña nueva)");
});

// ===== Menú móvil: Escape para cerrar y foco ordenado =====
const closeNav = (returnFocus) => {
  if (!nav.classList.contains("open")) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
  toggle.setAttribute("aria-label", "Abrir menú");
  if (returnFocus) toggle.focus();
};
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(true); });
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle.setAttribute("aria-label", "Abrir menú")));
toggle.addEventListener("click", () => {
  toggle.setAttribute("aria-label", nav.classList.contains("open") ? "Cerrar menú" : "Abrir menú");
  if (nav.classList.contains("open")) setTimeout(() => nav.querySelector("a").focus(), 50);
});
