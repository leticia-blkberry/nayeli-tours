// ===== Configuración =====
// Número de WhatsApp con código de país, solo dígitos (ej. México: "5219511234567").
// Mientras esté vacío, los botones de WhatsApp abren Messenger de la página de Facebook.
const WHATSAPP_NUMBER = "529511067780";
const MESSENGER_URL = "https://m.me/Nayetours";

// ===== Enlaces de WhatsApp =====
document.querySelectorAll(".js-whatsapp").forEach((el) => {
  const msg = el.dataset.msg || "¡Hola! Quiero información sobre Nayeli Tours.";
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
  document.querySelectorAll(".section-head, .pillar, .steps li, .tour, .g-item, .review, .event, .care-list li")
    .forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

document.getElementById("year").textContent = new Date().getFullYear();

// ===== Magia: estrellas, esporas brillantes y destellos del cursor =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const colors = ["95,240,230", "122,162,255", "185,140,255", "255,201,120"];
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
    if (!running) return;
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
    if (running) requestAnimationFrame(tick);
  });
  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
}
