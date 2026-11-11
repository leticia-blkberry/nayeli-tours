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
