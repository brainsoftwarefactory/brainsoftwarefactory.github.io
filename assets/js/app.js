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

  /* ─── phone conversations ─── */
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }

  function clock(i) {
    const m = 12 + i * 2;
    return "10:" + (m < 10 ? "0" + m : m);
  }

  function buildMessage(msg, i) {
    if (msg.from === "sys") return el("div", "msg sys", msg.text);
    const node = el("div", "msg" + (msg.from === "out" ? " out" : "") + (msg.card ? " card" : ""));
    if (msg.card) {
      node.appendChild(el("div", "card-img", msg.card.title));
      const body = el("div", "card-body", msg.card.body);
      node.appendChild(body);
    } else {
      node.appendChild(document.createTextNode(msg.text));
    }
    if (msg.options) {
      const opts = el("div", "opts");
      msg.options.forEach(function (o) { opts.appendChild(el("span", "", o)); });
      node.appendChild(opts);
    }
    node.appendChild(el("small", "", clock(i)));
    return node;
  }

  function buildScreen(story) {
    const screen = el("div", "screen");
    screen.dataset.skin = story.skin;
    const status = el("div", "status");
    status.innerHTML = "<span>9:41</span><span class=\"sig\"><svg viewBox=\"0 0 16 11\" fill=\"currentColor\"><rect x=\"0\" y=\"7\" width=\"3\" height=\"4\" rx=\"1\"/><rect x=\"4.3\" y=\"5\" width=\"3\" height=\"6\" rx=\"1\"/><rect x=\"8.6\" y=\"2.5\" width=\"3\" height=\"8.5\" rx=\"1\"/><rect x=\"13\" y=\"0\" width=\"3\" height=\"11\" rx=\"1\"/></svg><span class=\"bat\"></span></span>";
    screen.appendChild(status);
    const bar = el("div", "screen-bar");
    if (!story.call && !story.video) {
      const back = el("span");
      back.innerHTML = "<svg class=\"back\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 5l-7 7 7 7\"/></svg>";
      bar.appendChild(back.firstChild);
    }
    const avatar = el("span", "avatar");
    const logo = document.createElement("img");
    logo.src = "assets/img/brain-isotipo-512.png";
    logo.alt = "";
    avatar.appendChild(logo);
    bar.appendChild(avatar);
    const who = el("div");
    who.appendChild(el("b", "", story.title));
    who.appendChild(el("small", "", story.subtitle));
    bar.appendChild(who);
    if (story.via) {
      const via = document.createElement("img");
      via.className = "via";
      via.src = story.via;
      via.alt = "";
      bar.appendChild(via);
    }
    screen.appendChild(bar);

    if (story.call) {
      const hero = el("div", "call-hero");
      const ring = el("div", "ring");
      ring.innerHTML = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 3.5h3.2l1.6 4.3-2.1 1.4a11.5 11.5 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.4 16.4 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z\"/></svg>";
      hero.appendChild(ring);
      hero.appendChild(el("b", "", story.call.name));
      hero.appendChild(el("small", "", story.call.status));
      screen.appendChild(hero);
    }
    if (story.video) {
      const tiles = el("div", "video-tiles");
      const them = el("div", "video-tile");
      them.appendChild(el("span", "rec", "Grabando"));
      them.appendChild(el("span", "face", "M"));
      const me = el("div", "video-tile me");
      me.appendChild(el("span", "face", "Vos"));
      tiles.appendChild(them);
      tiles.appendChild(me);
      screen.appendChild(tiles);
    }
    const chat = el("div", "chat");
    screen.appendChild(chat);
    if (story.call || story.video) {
      const controls = el("div", "call-controls");
      controls.innerHTML =
        "<span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><rect x=\"9\" y=\"3\" width=\"6\" height=\"11\" rx=\"3\"/><path d=\"M5 11a7 7 0 0 0 14 0M12 18v3\"/></svg></span>" +
        "<span class=\"end\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 9c-3.3 0-6.4 1-8.6 2.8-.5.4-.5 1.1-.1 1.6l1.6 1.9c.4.4 1 .5 1.5.2l2-1.2c.4-.2.6-.6.6-1v-1.6a12 12 0 0 1 6 0v1.6c0 .4.2.8.6 1l2 1.2c.5.3 1.1.2 1.5-.2l1.6-1.9c.4-.5.4-1.2-.1-1.6C18.4 10 15.3 9 12 9Z\"/></svg></span>" +
        "<span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M4 9v6h4l5 4V5L8 9H4Z\"/><path d=\"M16.5 8.5a5 5 0 0 1 0 7\"/></svg></span>";
      screen.appendChild(controls);
    } else {
      const composer = el("div", "composer");
      composer.innerHTML = "<span class=\"field-fake\">Mensaje</span><span class=\"send\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z\"/></svg></span>";
      screen.appendChild(composer);
    }
    return { screen: screen, chat: chat };
  }

  // Plays a story inside a .phone. Returns a stop function.
  function play(phone, key, loop) {
    const story = stories[key];
    if (!story) return function () {};
    phone.innerHTML = "";
    const built = buildScreen(story);
    phone.appendChild(built.screen);
    const chat = built.chat;

    if (reduced) {
      story.messages.forEach(function (m, i) { chat.appendChild(buildMessage(m, i)); });
      return function () {};
    }

    let timers = [];
    let stopped = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function run() {
      chat.innerHTML = "";
      let t = 350;
      story.messages.forEach(function (m, i) {
        if (m.from === "out") {
          later(function () {
            if (stopped) return;
            const typing = el("div", "typing");
            typing.innerHTML = "<i></i><i></i><i></i>";
            chat.appendChild(typing);
          }, t);
          t += 900;
          later(function () {
            if (stopped) return;
            const typing = chat.querySelector(".typing");
            if (typing) typing.remove();
            chat.appendChild(buildMessage(m, i));
          }, t);
        } else {
          later(function () { if (!stopped) chat.appendChild(buildMessage(m, i)); }, t);
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

  /* ─── tasks by industry ─── */
  const taskGrid = document.getElementById("taskGrid");
  if (taskGrid) {
    const filters = document.querySelectorAll(".task-filter");
    const tasks = taskGrid.querySelectorAll(".task");
    function applyRubro(rubro) {
      tasks.forEach(function (task) {
        const tags = (task.dataset.rubro || "").split(" ");
        // Tasks tagged "todos" fit any industry.
        task.hidden = rubro !== "todos" &&
          tags.indexOf(rubro) === -1 && tags.indexOf("todos") === -1;
      });
    }
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) {
          const on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        applyRubro(btn.dataset.rubro);
      });
    });
  }

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
