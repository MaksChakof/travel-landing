// Travlog: меню, листание направлений и отзывов, списки в подвале, учебная форма рассылки

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ===== Меню-бургер =====
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");

function setMenu(open) {
  header.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuButton.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
}

menuButton.addEventListener("click", () => setMenu(!header.classList.contains("is-open")));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header.classList.contains("is-open")) {
    setMenu(false);
    menuButton.focus();
  }
});

header.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// ===== Направления: стрелки листают ряд карточек =====
const track = document.querySelector(".destinations__track");
const scrollButtons = document.querySelectorAll("[data-scroll]");

function cardStep() {
  const card = track.querySelector(".dest-card");
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;
}

function updateScrollButtons() {
  const maxScroll = track.scrollWidth - track.clientWidth - 1;
  scrollButtons.forEach((button) => {
    const dir = Number(button.dataset.scroll);
    button.disabled = dir < 0 ? track.scrollLeft <= 0 : track.scrollLeft >= maxScroll;
  });
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    track.scrollBy({
      left: Number(button.dataset.scroll) * cardStep(),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
});

track.addEventListener("scroll", updateScrollButtons, { passive: true });
window.addEventListener("resize", updateScrollButtons);
updateScrollButtons();

// ===== Отзывы: стрелки и точки =====
const slides = document.querySelectorAll(".testimonial");
const dots = document.querySelectorAll(".dot");
let current = 0;

function showSlide(index) {
  current = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== current; });
  dots.forEach((dot, i) => {
    if (i === current) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

document.querySelectorAll("[data-slide]").forEach((button) => {
  button.addEventListener("click", () => showSlide(current + Number(button.dataset.slide)));
});
dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

// ===== Подвал: на телефоне раскрывающиеся списки, шире — всегда открыты =====
const footerCols = document.querySelectorAll(".footer-col");
const wide = window.matchMedia("(min-width: 768px)");

function syncFooter() {
  footerCols.forEach((col) => { col.open = wide.matches; });
}

footerCols.forEach((col) => {
  col.querySelector("summary").addEventListener("click", (e) => {
    if (wide.matches) e.preventDefault();   // на широком экране списки не сворачиваются
  });
});

wide.addEventListener("change", syncFooter);
syncFooter();

// ===== Рассылка: учебная форма, никуда не отправляется =====
const form = document.querySelector(".newsletter__form");
const status = form.querySelector(".newsletter__status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = form.elements.email;
  if (!email.checkValidity()) {
    status.textContent = "Please enter a valid email, for example name@mail.com.";
    email.focus();
    return;
  }
  status.textContent = "Thanks! This is a demo form, so nothing was sent.";
  form.reset();
});
