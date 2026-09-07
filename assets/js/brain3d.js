/* ═══════════════════════════════════════════════════════════
   Brain · hero — interactive WebGL brain (Three.js)
   Point-cloud brain + synapse lines + traveling pulses.
   Spring-eased pointer rotation. Degrades to a CSS glow.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const canvas = document.getElementById("brain3d");
  const fallback = document.getElementById("brainFallback");
  if (!canvas) return;

  // Respect reduced motion → keep the static CSS glow.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Quick WebGL capability probe before pulling the library.
  try {
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) return;
  } catch (_) { return; }

  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

  import(THREE_URL).then((THREE) => boot(THREE)).catch(() => {
    /* CDN blocked / offline → CSS fallback already on screen. */
  });

  function boot(THREE) {
    const isMobile = window.innerWidth < 760;
    const COUNT = isMobile ? 1100 : 2000;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 3.65);

    const group = new THREE.Group();
    scene.add(group);

    // ── soft circular sprite (no external asset) ──────────────
    const sprite = (() => {
      const s = 64, c = document.createElement("canvas");
      c.width = c.height = s;
      const g = c.getContext("2d");
      const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.75)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad; g.fillRect(0, 0, s, s);
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    })();

    // ── brain-shaped point cloud (site palette) ───────────────
    const cBlue = new THREE.Color(0x0098ff);   // --blue
    const cRoyal = new THREE.Color(0x225dc6);  // --royal
    const cSky = new THREE.Color(0x8fd0ff);    // --link-hover

    const pts = new Float32Array(COUNT * 3);
    const cols = new Float32Array(COUNT * 3);
    const nodes = [];

    for (let i = 0; i < COUNT; i++) {
      // fibonacci sphere → even shell distribution
      const t = i / COUNT;
      const inc = Math.acos(1 - 2 * t);
      const az = Math.PI * (1 + Math.sqrt(5)) * i;
      let x = Math.sin(inc) * Math.cos(az);
      let y = Math.cos(inc);
      let z = Math.sin(inc) * Math.sin(az);

      // ellipsoid → brain proportions (wider than tall)
      x *= 1.28; y *= 0.9; z *= 1.06;
      // organic surface lumps
      const n = 1 + 0.13 * Math.sin(x * 4.0 + y * 3.0) * Math.cos(z * 3.4);
      x *= n; y *= n; z *= n;
      // saggital fissure: nudge hemispheres apart along x
      x += (x >= 0 ? 1 : -1) * 0.1;
      // give the shell a little thickness
      const r = 0.84 + Math.random() * 0.16;
      x *= r; y *= r; z *= r;

      pts[i * 3] = x; pts[i * 3 + 1] = y; pts[i * 3 + 2] = z;
      const mix = (y + 1) / 2 * 0.72 + Math.random() * 0.28;
      const c = cBlue.clone().lerp(cRoyal, mix);
      if (Math.random() > 0.9) c.lerp(cSky, 0.6); // sparse bright nodes
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.055 : 0.045, map: sprite, vertexColors: true,
      transparent: true, opacity: 0.95, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    group.add(new THREE.Points(geo, mat));

    // ── synapses: connect nearby nodes ────────────────────────
    const edges = [];
    const linePos = [];
    const sampleN = isMobile ? 520 : 900;
    for (let i = 0; i < sampleN; i++) {
      const a = (Math.random() * COUNT) | 0;
      const A = nodes[a];
      let best = -1, bestD = Infinity, second = -1, secondD = Infinity;
      for (let k = 0; k < 26; k++) {
        const b = (Math.random() * COUNT) | 0;
        if (b === a) continue;
        const d = A.distanceToSquared(nodes[b]);
        if (d < bestD) { second = best; secondD = bestD; best = b; bestD = d; }
        else if (d < secondD) { second = b; secondD = d; }
      }
      if (best >= 0 && bestD < 0.18) { edges.push([a, best]); linePos.push(A.x, A.y, A.z, nodes[best].x, nodes[best].y, nodes[best].z); }
      if (second >= 0 && secondD < 0.16 && Math.random() > 0.5) { edges.push([a, second]); linePos.push(A.x, A.y, A.z, nodes[second].x, nodes[second].y, nodes[second].z); }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0098ff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // ── traveling pulses (synapses firing) ────────────────────
    const PULSES = isMobile ? 16 : 32;
    const pulsePos = new Float32Array(PULSES * 3);
    const pulseState = [];
    for (let i = 0; i < PULSES; i++) {
      pulseState.push({ e: (Math.random() * edges.length) | 0, t: Math.random(), s: 0.006 + Math.random() * 0.012 });
    }
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.16, map: sprite, color: 0xbfe4ff, transparent: true,
      opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    if (edges.length) group.add(pulsePoints);

    // ── interaction: spring-eased pointer rotation ────────────
    let pointerX = 0, pointerY = 0;       // target (-0.5..0.5)
    let rotX = 0, rotY = 0, spin = 0;     // eased pointer tilt + auto spin
    if (window.matchMedia("(pointer:fine)").matches) {
      window.addEventListener("pointermove", (e) => {
        pointerX = e.clientX / window.innerWidth - 0.5;
        pointerY = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }

    function layout() {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // keep the brain fully framed no matter the container ratio
      group.scale.setScalar(camera.aspect < 1 ? Math.max(camera.aspect, 0.62) : 1);
    }
    layout();
    window.addEventListener("resize", layout, { passive: true });

    // reveal: swap the CSS fallback for the live canvas
    canvas.classList.add("ready");
    if (fallback) fallback.classList.add("hidden");

    // ── render loop (paused when offscreen / tab hidden) ──────
    let running = true, raf = 0, inView = true;
    const ev = pulseGeo.attributes.position.array;

    function tick() {
      if (!running) return;
      raf = requestAnimationFrame(tick);

      spin += 0.0016;                             // slow auto-spin
      rotY += (pointerX * 0.5 - rotY) * 0.05;     // spring toward pointer
      rotX += (pointerY * 0.35 - rotX) * 0.05;
      group.rotation.y = spin + rotY;
      group.rotation.x = rotX;
      group.rotation.z = rotY * 0.12;

      // advance pulses
      if (edges.length) {
        for (let i = 0; i < PULSES; i++) {
          const p = pulseState[i];
          p.t += p.s;
          if (p.t >= 1) { p.t = 0; p.e = (Math.random() * edges.length) | 0; p.s = 0.006 + Math.random() * 0.012; }
          const edge = edges[p.e];
          const A = nodes[edge[0]], B = nodes[edge[1]];
          ev[i * 3] = A.x + (B.x - A.x) * p.t;
          ev[i * 3 + 1] = A.y + (B.y - A.y) * p.t;
          ev[i * 3 + 2] = A.z + (B.z - A.z) * p.t;
        }
        pulseGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    tick();

    // pause when the hero scrolls away
    const hero = document.getElementById("hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView && !document.hidden) { if (!running) { running = true; tick(); } }
          else { running = false; cancelAnimationFrame(raf); }
        });
      }, { threshold: 0.01 }).observe(hero);
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (inView && !running) { running = true; tick(); }
    });

    // recover from a lost WebGL context → show the CSS glow again
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault(); running = false; cancelAnimationFrame(raf);
      canvas.classList.remove("ready");
      if (fallback) fallback.classList.remove("hidden");
    });
  }
})();
