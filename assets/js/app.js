/**
 * App — landing interactions.
 * Mobile menu · nav state · rolling button labels · phone conversations ·
 * sticky showcase · industry filter · marquee · reveals.
 * Every animation respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stories = window.BRAIN_STORIES || {};

  /* ─── mobile menu ─── */
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
  if (nav) {
    const onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ─── rolling labels: the text slides up and a copy slides in on hover ─── */
  document.querySelectorAll(".btn").forEach(function (btn) {
    const textNode = Array.prototype.find.call(btn.childNodes, function (n) {
      return n.nodeType === 3 && n.textContent.trim();
    });
    if (!textNode) return;
    const label = textNode.textContent.trim();
    const roll = document.createElement("span");
    roll.className = "roll";
    roll.style.position = "relative";
    roll.innerHTML = "<span></span><span aria-hidden=\"true\"></span>";
    roll.children[0].textContent = label;
    roll.children[1].textContent = label;
    btn.replaceChild(roll, textNode);
  });

  /* ─── phone conversations (screens built by phone.js) ─── */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  const Phone = window.BrainPhone;

  // Plays a story inside a .phone. Returns a stop function.
  function play(phone, key, loop) {
    const story = stories[key];
    if (!story) return function () {};
    phone.innerHTML = "";
    const built = Phone.build(story);
    phone.appendChild(built.screen);
    const chat = built.chat;

    if (reduced) {
      story.messages.forEach(function (m, i) { chat.appendChild(Phone.message(m, i, story)); });
      return function () {};
    }

    let timers = [];
    let stopped = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    const fixed = Array.prototype.slice.call(chat.children);
    function run() {
      chat.innerHTML = "";
      fixed.forEach(function (n) { chat.appendChild(n); });
      let t = 350;
      story.messages.forEach(function (m, i) {
        if (m.from === "out") {
          later(function () {
            if (stopped) return;
            chat.appendChild(Phone.typing());
          }, t);
          t += 900;
          later(function () {
            if (stopped) return;
            const typing = chat.querySelector(".typing");
            if (typing) typing.remove();
            chat.appendChild(Phone.message(m, i, story));
          }, t);
        } else {
          later(function () { if (!stopped) chat.appendChild(Phone.message(m, i, story)); }, t);
        }
        t += m.from === "in" ? 1100 : 1300;
      });
      if (loop) later(function () { if (!stopped) run(); }, t + 3200);
    }
    run();

    return function () {
      stopped = true;
      timers.forEach(clearTimeout);
      timers = [];
    };
  }

  // Hero phone (loops).
  document.querySelectorAll(".phone[data-loop]").forEach(function (phone) {
    play(phone, phone.dataset.story, true);
  });

  /* ─── showcase: sticky phone follows the active step ─── */
  const steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  const stagePhone = document.getElementById("stagePhone");
  const caption = document.getElementById("stageCaption");
  const count = document.getElementById("stageCount");
  const dots = document.querySelectorAll("#stageDots i");
  const mobile = window.matchMedia("(max-width: 920px)");
  let stopStage = function () {};
  let current = -1;

  function activate(index) {
    if (index === current) return;
    current = index;
    const step = steps[index];
    steps.forEach(function (s, i) { s.classList.toggle("is-active", i === index); });
    dots.forEach(function (d, i) { d.classList.toggle("on", i === index); });
    if (caption) caption.textContent = step.dataset.caption || "";
    if (count) count.textContent = (index + 1) + "/" + steps.length;
    if (stagePhone && !mobile.matches) {
      stopStage();
      stopStage = play(stagePhone, step.dataset.story, false);
    }
  }

  // On small screens each step carries its own phone, played when it enters the view.
  const inlineStops = new Map();
  function setupInline() {
    steps.forEach(function (step) {
      const slot = step.querySelector(".phone-inline");
      if (!slot || slot.childElementCount) return;
      const phone = el("div", "phone short");
      const cap = el("div", "stage-caption");
      cap.appendChild(el("span", "", step.dataset.caption || ""));
      cap.appendChild(el("span", "", (steps.indexOf(step) + 1) + "/" + steps.length));
      slot.appendChild(phone);
      slot.appendChild(cap);
    });
  }

  if (steps.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const step = entry.target;
          const index = steps.indexOf(step);
          activate(index);
          if (mobile.matches) {
            const phone = step.querySelector(".phone-inline .phone");
            if (phone && !inlineStops.has(step)) inlineStops.set(step, play(phone, step.dataset.story, false));
          }
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      steps.forEach(function (s) { io.observe(s); });
    }
    if (mobile.matches) setupInline();
    mobile.addEventListener("change", function (e) { if (e.matches) setupInline(); });
    activate(0);
  }

  /* ─── marquee: duplicate the track so it loops seamlessly ─── */
  const track = document.getElementById("marqueeTrack");
  if (track && !reduced) track.innerHTML += track.innerHTML;

  /* ─── chat launcher (Chatwoot) ─── */
  const launcher = document.getElementById("chatLauncher");
  if (launcher) {
    launcher.addEventListener("click", function () {
      if (window.$chatwoot) window.$chatwoot.toggle();
    });
    window.addEventListener("chatwoot:ready", function () {
      launcher.classList.add("is-ready");
    });
    // Open/closed state is read from the holder Chatwoot injects
    // (also covers closing from inside the widget on mobile).
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

  /* ─── by industry: accessible tabs ─── */
  const rubroTabs = Array.prototype.slice.call(document.querySelectorAll(".rubro-tab"));
  function selectRubro(tab, focus) {
    rubroTabs.forEach(function (t) {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }
  rubroTabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectRubro(tab, false); });
    tab.addEventListener("keydown", function (e) {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        selectRubro(rubroTabs[(i + keys[e.key] + rubroTabs.length) % rubroTabs.length], true);
      } else if (e.key === "Home") { e.preventDefault(); selectRubro(rubroTabs[0], true); }
      else if (e.key === "End") { e.preventDefault(); selectRubro(rubroTabs[rubroTabs.length - 1], true); }
    });
  });

  /* ─── reveals ─── */
  const reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (r) { r.classList.add("in"); });
    return;
  }
  const revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  reveals.forEach(function (r) { revealer.observe(r); });
})();
