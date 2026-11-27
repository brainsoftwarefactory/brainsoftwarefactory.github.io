/**
 * Phone — builds iPhone-style screens for the sample conversations.
 * Each skin imitates the real iOS app: WhatsApp, Instagram, a web chat in
 * Safari, the iOS call screen and a FaceTime-like video call.
 * Exposes window.BrainPhone.build(story) -> { screen, chat } and
 * window.BrainPhone.message(msg, i, story) -> element.
 */
(function () {
  "use strict";

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  }
  function html(tag, cls, markup) {
    const node = el(tag, cls);
    node.innerHTML = markup;
    return node;
  }

  const ICON = {
    back: '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>',
    video: '<svg viewBox="0 0 26 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="1" y="2" width="16" height="14" rx="3.5"/><path d="m17 7.5 7-4v11l-7-4"/></svg>',
    phone: '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4.6 1.8h3l1.6 4.2-2 1.4a11 11 0 0 0 7.4 7.4l1.4-2 4.2 1.6v3a2 2 0 0 1-2.1 2A17.5 17.5 0 0 1 2.6 3.9a2 2 0 0 1 2-2.1Z"/></svg>',
    plus: '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 3v16M3 11h16"/></svg>',
    camera: '<svg viewBox="0 0 26 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 6h4l2-3h8l2 3h4a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 23 20H3a1.5 1.5 0 0 1-1.5-1.5v-11A1.5 1.5 0 0 1 3 6Z"/><circle cx="13" cy="12.5" r="4.2"/></svg>',
    mic: '<svg viewBox="0 0 18 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="1.5" width="8" height="13" rx="4"/><path d="M1.5 11a7.5 7.5 0 0 0 15 0M9 18.5V22"/></svg>',
    sticker: '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20 11a9 9 0 1 1-9-9h4a5 5 0 0 1 5 5Z"/><path d="M7.5 13.5a4.5 4.5 0 0 0 7 0" stroke-linecap="round"/><circle cx="8" cy="9" r=".9" fill="currentColor"/><circle cx="14" cy="9" r=".9" fill="currentColor"/></svg>',
    gallery: '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="2" y="3" width="18" height="16" rx="3.5"/><circle cx="8" cy="8.5" r="1.8"/><path d="m2.5 16 5-4.5 4 3.5 3-2.5 5 4"/></svg>',
    ticks: '<svg viewBox="0 0 18 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m1 6 3.5 3.5L11 2M7 9.5 7.5 10 15 2"/></svg>',
    lock: '<svg viewBox="0 0 12 14" fill="currentColor"><path d="M3 6V4a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 11 7.5v5A1.5 1.5 0 0 1 9.5 14h-7A1.5 1.5 0 0 1 1 12.5v-5A1.5 1.5 0 0 1 2.5 6H3Zm1.5 0h3V4a1.5 1.5 0 0 0-3 0v2Z"/></svg>',
    tabs: '<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2" y="6" width="14" height="14" rx="3"/><path d="M6 2h11a3 3 0 0 1 3 3v11"/></svg>',
    share: '<svg viewBox="0 0 20 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15V2M5.5 6.5 10 2l4.5 4.5M6 10H3.5A1.5 1.5 0 0 0 2 11.5v9A1.5 1.5 0 0 0 3.5 22h13a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5H14"/></svg>',
    book: '<svg viewBox="0 0 24 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 4C9.5 2 5.5 1.5 2 2v15c3.5-.5 7.5 0 10 2 2.5-2 6.5-2.5 10-2V2c-3.5-.5-7.5 0-10 2Zm0 0v15"/></svg>',
    keypad: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="4" r="2.2"/><circle cx="12" cy="4" r="2.2"/><circle cx="19" cy="4" r="2.2"/><circle cx="5" cy="11" r="2.2"/><circle cx="12" cy="11" r="2.2"/><circle cx="19" cy="11" r="2.2"/><circle cx="5" cy="18" r="2.2"/><circle cx="12" cy="18" r="2.2"/><circle cx="19" cy="18" r="2.2"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9h4l6-5v16l-6-5H3Z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    muteMic: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="2" width="8" height="13" rx="4"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    addCall: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 4v16M4 12h16"/></svg>',
    facetime: '<svg viewBox="0 0 26 18" fill="currentColor"><rect x="1" y="2" width="16" height="14" rx="3.5"/><path d="m17 7.5 7-4v11l-7-4Z"/></svg>',
    contacts: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4.2"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0Z"/></svg>',
    end: '<svg viewBox="0 0 28 12" fill="currentColor"><path d="M14 1C8.6 1 4 2.6 1.5 5.2c-.7.7-.7 1.8 0 2.5l1.6 1.6c.6.6 1.6.7 2.3.2l2.4-1.8c.5-.4.8-1 .8-1.6V4.4c1.7-.5 3.5-.8 5.4-.8s3.7.3 5.4.8v1.7c0 .6.3 1.2.8 1.6l2.4 1.8c.7.5 1.7.4 2.3-.2l1.6-1.6c.7-.7.7-1.8 0-2.5C24 2.6 19.4 1 14 1Z"/></svg>',
    flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><path d="M9 13.5a3 3 0 0 0 5.6 1.4M15 12.5a3 3 0 0 0-5.6-1.4"/></svg>',
    shareScreen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="13" rx="2.5"/><path d="M8 21h8M12 14V8M9 10.5 12 7.5l3 3" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5a1 1 0 0 1 .7.3l6 6a1 1 0 1 1-1.4 1.4L13 6.9V19.5a1 1 0 1 1-2 0V6.9l-4.3 4.3a1 1 0 1 1-1.4-1.4l6-6a1 1 0 0 1 .7-.3Z"/></svg>'
  };

  // iOS status bar: time on the left, signal, wifi and battery on the right.
  function statusBar(dark) {
    return html("div", "ios-status" + (dark ? " dark" : ""),
      '<span class="t">9:41</span><span class="r">' +
      '<svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>' +
      '<svg viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.6c2.2 0 4.2.8 5.7 2.2l1.2-1.3A10 10 0 0 0 8 .8a10 10 0 0 0-6.9 2.7l1.2 1.3A8.3 8.3 0 0 1 8 2.6Zm0 3.4c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.6 6.6 0 0 0 8 4.2c-1.8 0-3.4.7-4.6 1.8l1.2 1.3A4.9 4.9 0 0 1 8 6Zm0 3.3c.5 0 1 .2 1.3.5L8 11.2 6.7 9.8c.3-.3.8-.5 1.3-.5Z"/></svg>' +
      '<span class="bat"><i></i></span></span>');
  }

  function avatar(story, cls) {
    const a = el("span", "ios-av " + (cls || ""));
    a.style.background = story.color || "linear-gradient(135deg,#225DC6,#0098FF)";
    a.textContent = story.initials || story.title.charAt(0);
    return a;
  }

  /* ─── skins ─── */
  function whatsapp(story, screen) {
    screen.appendChild(statusBar(false));
    const bar = el("div", "wa-bar");
    bar.appendChild(html("span", "wa-back", ICON.back + "<b>12</b>"));
    bar.appendChild(avatar(story));
    const who = el("div", "wa-who");
    who.appendChild(el("b", "", story.title));
    who.appendChild(el("small", "", story.subtitle));
    bar.appendChild(who);
    bar.appendChild(html("span", "wa-ico", ICON.video));
    bar.appendChild(html("span", "wa-ico", ICON.phone));
    screen.appendChild(bar);
    const chat = el("div", "ios-chat wa-chat");
    chat.appendChild(el("div", "wa-day", "Hoy"));
    screen.appendChild(chat);
    screen.appendChild(html("div", "wa-input",
      '<span class="ic">' + ICON.plus + '</span><span class="field">' + '<span class="st">' + ICON.sticker + '</span></span>' +
      '<span class="ic">' + ICON.camera + '</span><span class="ic">' + ICON.mic + '</span>'));
    return chat;
  }

  function instagram(story, screen) {
    screen.appendChild(statusBar(false));
    const bar = el("div", "ig-bar");
    bar.appendChild(html("span", "ig-back", ICON.back));
    const av = avatar(story, "ring");
    bar.appendChild(av);
    const who = el("div", "ig-who");
    who.appendChild(el("b", "", story.title));
    who.appendChild(el("small", "", story.subtitle));
    bar.appendChild(who);
    bar.appendChild(html("span", "ig-ico", ICON.phone));
    bar.appendChild(html("span", "ig-ico", ICON.video));
    screen.appendChild(bar);
    const chat = el("div", "ios-chat ig-chat");
    screen.appendChild(chat);
    screen.appendChild(html("div", "ig-input",
      '<span class="cam">' + ICON.camera + '</span><span class="ph">Mensaje…</span>' +
      '<span class="ic">' + ICON.mic + '</span><span class="ic">' + ICON.gallery + '</span><span class="ic">' + ICON.sticker + '</span>'));
    return chat;
  }

  function web(story, screen) {
    screen.appendChild(statusBar(false));
    const page = el("div", "sf-page");
    const head = el("div", "sf-widget-head");
    head.appendChild(avatar(story));
    const who = el("div");
    who.appendChild(el("b", "", story.title));
    who.appendChild(el("small", "", story.subtitle));
    head.appendChild(who);
    page.appendChild(head);
    const chat = el("div", "ios-chat sf-chat");
    page.appendChild(chat);
    page.appendChild(html("div", "sf-compose", '<span>Escribí tu mensaje…</span><i>' + ICON.send + "</i>"));
    screen.appendChild(page);
    screen.appendChild(html("div", "sf-bar",
      '<div class="sf-url">' + ICON.lock + "<span>" + (story.url || "tuempresa.com") + "</span></div>" +
      '<div class="sf-tools"><span>' + ICON.back + '</span><span class="off">' + ICON.back + "</span><span>" + ICON.share + "</span><span>" + ICON.book + "</span><span>" + ICON.tabs + "</span></div>"));
    return chat;
  }

  function call(story, screen) {
    screen.appendChild(statusBar(true));
    const top = el("div", "call-top");
    top.appendChild(el("small", "", story.call.label));
    top.appendChild(el("b", "", story.call.name));
    top.appendChild(el("span", "call-timer", story.call.status));
    screen.appendChild(top);
    const chat = el("div", "ios-chat call-captions");
    screen.appendChild(chat);
    const grid = el("div", "call-grid");
    [["muteMic", "silenciar"], ["keypad", "teclado"], ["speaker", "altavoz", true], ["addCall", "agregar"], ["facetime", "FaceTime"], ["contacts", "contactos"]]
      .forEach(function (b) {
        const cell = el("div", "call-btn" + (b[2] ? " on" : ""));
        cell.appendChild(html("span", "", ICON[b[0]]));
        cell.appendChild(el("small", "", b[1]));
        grid.appendChild(cell);
      });
    screen.appendChild(grid);
    screen.appendChild(html("div", "call-end", "<span>" + ICON.end + "</span>"));
    return chat;
  }

  function video(story, screen) {
    const remote = el("div", "ft-remote");
    remote.appendChild(html("div", "ft-person",
      '<svg viewBox="0 0 200 240"><defs><linearGradient id="ftg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0C9A5"/><stop offset="1" stop-color="#D9A47C"/></linearGradient></defs>' +
      '<path d="M20 240c6-52 40-80 80-80s74 28 80 80Z" fill="#225DC6"/><rect x="86" y="128" width="28" height="34" rx="12" fill="url(#ftg)"/>' +
      '<ellipse cx="100" cy="92" rx="44" ry="52" fill="url(#ftg)"/><path d="M56 86c0-34 20-52 44-52s46 16 44 52c-8-16-20-24-44-24s-34 8-44 24Z" fill="#3A2A22"/>' +
      '<circle cx="84" cy="96" r="4" fill="#2B2B2B"/><circle cx="116" cy="96" r="4" fill="#2B2B2B"/><path d="M86 118q14 10 28 0" stroke="#9A5B45" stroke-width="4" fill="none" stroke-linecap="round"/></svg>'));
    screen.appendChild(remote);
    screen.appendChild(statusBar(true));
    const head = el("div", "ft-head");
    head.appendChild(el("b", "", story.title));
    head.appendChild(el("small", "", story.subtitle));
    screen.appendChild(head);
    screen.appendChild(html("div", "ft-self", "<span>Vos</span>"));
    const chat = el("div", "ios-chat ft-captions");
    screen.appendChild(chat);
    screen.appendChild(html("div", "ft-controls",
      "<span>" + ICON.muteMic + "</span><span>" + ICON.flip + "</span><span>" + ICON.shareScreen + '</span><span class="end">' + ICON.end + "</span>"));
    return chat;
  }

  const SKINS = { whatsapp: whatsapp, instagram: instagram, web: web, call: call, video: video };

  function build(story) {
    const screen = el("div", "screen ios");
    screen.dataset.skin = story.skin;
    const chat = (SKINS[story.skin] || whatsapp)(story, screen);
    screen.appendChild(el("span", "home-ind"));
    return { screen: screen, chat: chat };
  }

  function time(i) {
    const m = 12 + i * 2;
    return "10:" + (m < 10 ? "0" + m : m);
  }

  function message(msg, i, story) {
    if (msg.from === "sys") return el("div", "ios-sys", msg.text);
    const out = msg.from === "out";
    const node = el("div", "ios-msg " + (out ? "out" : "in") + (msg.card ? " card" : ""));
    if (msg.card) {
      node.appendChild(html("div", "card-img", "<span>" + msg.card.title + "</span>"));
      node.appendChild(el("div", "card-body", msg.card.body));
    } else {
      node.appendChild(el("span", "txt", msg.text));
    }
    if (msg.options) {
      const opts = el("div", "opts");
      msg.options.forEach(function (o) { opts.appendChild(el("span", "", o)); });
      node.appendChild(opts);
    }
    if (story.skin === "whatsapp") {
      const meta = el("span", "meta", time(i));
      if (out) meta.insertAdjacentHTML("beforeend", ICON.ticks);
      node.appendChild(meta);
    }
    return node;
  }

  function typing() {
    return html("div", "ios-msg in typing", "<i></i><i></i><i></i>");
  }

  window.BrainPhone = { build: build, message: message, typing: typing };
})();
