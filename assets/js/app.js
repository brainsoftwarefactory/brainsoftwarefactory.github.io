/**
 * App — interacciones de la landing
 * Menú mobile · reveals on-scroll (respetando prefers-reduced-motion)
 */
(function () {
  "use strict";

  /* ─── menú mobile ─── */
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (nav && toggle && links) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ─── chat launcher (Chatwoot) ─── */
  const launcher = document.getElementById("chatLauncher");
  if (launcher) {
    launcher.addEventListener("click", function () {
      if (window.$chatwoot) window.$chatwoot.toggle();
    });
    window.addEventListener("chatwoot:ready", function () {
      launcher.classList.add("is-ready");
    });
    // el estado abierto/cerrado se lee del holder que inyecta Chatwoot
    // (cubre también el cierre desde adentro del widget en mobile)
    const chatState = new MutationObserver(function () {
      const holder = document.querySelector(".woot-widget-holder");
      if (!holder) return;
      const open = !holder.classList.contains("woot--hide");
      launcher.classList.toggle("is-open", open);
      launcher.setAttribute("aria-expanded", open ? "true" : "false");
      launcher.setAttribute("aria-label", open ? "Cerrar el chat" : "Abrir el chat");
    });
    chatState.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
  }

  /* ─── reveals ─── */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  reveals.forEach(function (el) { io.observe(el); });
})();
