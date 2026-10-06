// Corra — page interactions and the Three.js product choreography.

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Nav state
// ---------------------------------------------------------------------------
const nav = document.querySelector(".nav");
const updateNav = () => nav.classList.toggle("scrolled", window.scrollY > 24);
updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

// ---------------------------------------------------------------------------
// GSAP reveals
// ---------------------------------------------------------------------------
const { gsap, ScrollTrigger } = window;

if (gsap && ScrollTrigger && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, overwrite: true }),
  });
} else {
  root.classList.remove("js-anim");
}
window.__corraReady = true;

// ---------------------------------------------------------------------------
// Three.js stage
// ---------------------------------------------------------------------------
const canvas = document.getElementById("stage");

try {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
  initStage(THREE, RoomEnvironment);
} catch (err) {
  console.warn("[corra] 3D stage unavailable:", err);
  canvas.remove();
}

function initStage(THREE, RoomEnvironment) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.HemisphereLight(0xfff6ec, 0xd9c6b4, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd9c2, 1.2);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  // ---- Product jar ---------------------------------------------------------
  const products = [
    { name: "Cycle Balance", sub: "Inositol · Folate · B6", color: "#c9826b" },
    { name: "Calm Cortisol", sub: "Ashwagandha · Magnesium", color: "#8a9a7b" },
    { name: "Daily Foundation", sub: "Omega-3 · D3 + K2 · Zinc", color: "#d9a956" },
  ];

  const rig = new THREE.Group(); // positioned by scroll
  const jar = new THREE.Group(); // tilted/rotated by scroll + pointer
  rig.add(jar);
  scene.add(rig);

  const profile = [
    [0, -1], [0.6, -1], [0.68, -0.97], [0.72, -0.9], [0.72, 0.55], [0.69, 0.62], [0.57, 0.66], [0.57, 0.76],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: products[0].color, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.18, sheen: 0.4,
  });
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), bodyMat);
  jar.add(body);

  const lidMat = new THREE.MeshPhysicalMaterial({ color: "#f3ebe1", roughness: 0.55, clearcoat: 0.4 });
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.63, 0.63, 0.4, 96), lidMat);
  lid.position.y = 0.95;
  jar.add(lid);
  const lidCap = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.035, 16, 96), lidMat);
  lidCap.rotation.x = Math.PI / 2;
  lidCap.position.y = 1.15;
  jar.add(lidCap);

  const labelTextures = products.map(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 448;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  });
  const drawLabels = () => {
    labelTextures.forEach((tex, i) => {
      const p = products[i];
      const c = tex.image;
      const g = c.getContext("2d");
      g.fillStyle = "#f7f1ea";
      g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = p.color;
      g.fillRect(0, 0, c.width, 18);
      g.fillRect(0, c.height - 18, c.width, 18);
      g.textAlign = "center";
      g.fillStyle = "#2a211c";
      g.font = "500 120px Fraunces, Georgia, serif";
      g.fillText("corra", c.width / 2, 170);
      g.font = "italic 300 64px Fraunces, Georgia, serif";
      g.fillStyle = p.color;
      g.fillText(p.name, c.width / 2, 270);
      g.font = "500 30px Inter, system-ui, sans-serif";
      g.fillStyle = "#6f6158";
      g.fillText(p.sub.toUpperCase(), c.width / 2, 340);
      g.fillText("60 VEGAN CAPSULES", c.width / 2, 390);
      tex.needsUpdate = true;
    });
  };
  drawLabels();
  document.fonts?.ready.then(drawLabels);

  const labelMat = new THREE.MeshStandardMaterial({ map: labelTextures[0], roughness: 0.7 });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.726, 0.726, 1.02, 128, 1, true), labelMat);
  label.position.y = -0.2;
  label.rotation.y = Math.PI; // center the artwork (u = 0.5) towards the camera
  jar.add(label);
  jar.position.y = -0.08;

  // Soft contact shadow
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 256;
  const sg = shadowCanvas.getContext("2d");
  const grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(60,40,30,0.35)");
  grad.addColorStop(1, "rgba(60,40,30,0)");
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 256, 256);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 2.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -1.25;
  rig.add(shadow);

  // ---- Floating capsules ----------------------------------------------------
  const capsuleGeo = new THREE.CapsuleGeometry(0.07, 0.17, 6, 16);
  const capsuleMats = ["#f3ebe1", "#c9826b", "#8a9a7b", "#d9a956"].map(
    (color) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1 })
  );
  const capsules = Array.from({ length: 22 }, (_, i) => {
    const m = new THREE.Mesh(capsuleGeo, capsuleMats[i % capsuleMats.length]);
    m.userData = {
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 10,
      z: -5 + Math.random() * 5,
      speed: 0.2 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.6),
    };
    m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    scene.add(m);
    return m;
  });

  // ---- Scroll choreography ------------------------------------------------
  // Each [data-scene] element is a keyframe. The jar sits on that section's spacer
  // element when one exists, otherwise at a normalised viewport position.
  const TAU = Math.PI * 2;
  const sceneDefs = {
    hero:        { spacer: ".hero-spacer", rotX: 0.12, rotY: -0.35, rotZ: -0.06, scale: 1, label: 0 },
    statement:   { nx: 0.72, ny: -0.35, mnx: 0.55, mny: -0.62, rotX: 0.35, rotY: 0.9, rotZ: 0.35, scale: 0.6, label: 0 },
    balance:     { spacer: ".formula-spacer", rotX: 0.1, rotY: TAU - 0.35, rotZ: 0.04, scale: 1, label: 0 },
    calm:        { spacer: ".formula-spacer", rotX: 0.1, rotY: TAU * 2 + 0.35, rotZ: -0.04, scale: 1, label: 1 },
    foundation:  { spacer: ".formula-spacer", rotX: 0.1, rotY: TAU * 3 - 0.35, rotZ: 0.04, scale: 1, label: 2 },
    ingredients: { nx: 0.78, ny: 0.5, mnx: 0.6, mny: 0.7, rotX: 0.6, rotY: TAU * 3 + 0.8, rotZ: 0.5, scale: 0.55, label: 2 },
    ritual:      { nx: 0.74, ny: 0.4, mnx: 0.62, mny: 0.75, rotX: -0.2, rotY: TAU * 3 + 1.6, rotZ: -0.4, scale: 0.55, label: 2 },
    cta:         { nx: 0.62, ny: 0, mnx: 0, mny: -0.55, rotX: 0.1, rotY: TAU * 4 - 0.35, rotZ: 0, scale: 0.9, label: 0 },
  };
  const sceneEls = [...document.querySelectorAll("[data-scene]")];
  let keyframes = [];
  const view = { w: 1, h: 1, halfW: 1, halfH: 1, mobile: false };

  const layout = () => {
    view.w = window.innerWidth;
    view.h = window.innerHeight;
    view.mobile = view.w < 900;
    renderer.setSize(view.w, view.h, false);
    camera.aspect = view.w / view.h;
    camera.updateProjectionMatrix();
    view.halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    view.halfW = view.halfH * camera.aspect;

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - view.h);
    const sy = window.scrollY;
    keyframes = sceneEls
      .map((el) => {
        const def = sceneDefs[el.dataset.scene];
        if (!def) return null;
        const rect = el.getBoundingClientRect();
        const top = rect.top + sy;
        const anchor = THREE.MathUtils.clamp(top + rect.height / 2 - view.h / 2, 0, maxScroll);
        let nx = view.mobile ? def.mnx ?? def.nx ?? 0 : def.nx ?? 0;
        let ny = view.mobile ? def.mny ?? def.ny ?? 0 : def.ny ?? 0;
        const spacer = def.spacer && el.querySelector(def.spacer);
        if (spacer) {
          const s = spacer.getBoundingClientRect();
          const cx = s.left + s.width / 2;
          const cy = s.top + sy + s.height / 2 - anchor;
          nx = (cx / view.w) * 2 - 1;
          ny = -((cy / view.h) * 2 - 1);
        }
        const fit = view.mobile ? Math.min(0.85, (view.w / view.h) * 1.55) : 1;
        const scale = def.scale * (def.spacer ? fit : Math.min(fit, 0.8) / 0.8);
        // Keep the lid clear of the fixed nav bar.
        const navWorld = ((nav.offsetHeight + 12) / view.h) * view.halfH * 2;
        const maxY = view.halfH - navWorld - 1.25 * scale;
        return {
          anchor,
          x: nx * view.halfW,
          y: Math.min(ny * view.halfH, maxY),
          scale,
          rotX: def.rotX,
          rotY: def.rotY,
          rotZ: def.rotZ,
          color: new THREE.Color(products[def.label].color),
          label: def.label,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.anchor - b.anchor);
  };
  layout();
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  document.fonts?.ready.then(layout);
  if (ScrollTrigger) ScrollTrigger.addEventListener("refresh", layout);

  const smooth = (t) => t * t * (3 - 2 * t);
  const state = { x: 0, y: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0, color: new THREE.Color(), label: 0 };
  const sample = (scroll) => {
    const k = keyframes;
    if (!k.length) return state;
    let a = k[0];
    let b = k[0];
    let t = 0;
    if (scroll >= k[k.length - 1].anchor) {
      a = b = k[k.length - 1];
    } else if (scroll > k[0].anchor) {
      for (let i = 0; i < k.length - 1; i++) {
        if (scroll <= k[i + 1].anchor) {
          a = k[i];
          b = k[i + 1];
          const span = b.anchor - a.anchor;
          t = span > 0 ? smooth((scroll - a.anchor) / span) : 1;
          break;
        }
      }
    }
    const lerp = THREE.MathUtils.lerp;
    state.x = lerp(a.x, b.x, t);
    state.y = lerp(a.y, b.y, t);
    state.scale = lerp(a.scale, b.scale, t);
    state.rotX = lerp(a.rotX, b.rotX, t);
    state.rotY = lerp(a.rotY, b.rotY, t);
    state.rotZ = lerp(a.rotZ, b.rotZ, t);
    state.color.copy(a.color).lerp(b.color, t);
    state.label = t < 0.5 ? a.label : b.label; // swaps while the label faces away
    return state;
  };

  // ---- Pointer parallax -----------------------------------------------------
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / view.w) * 2 - 1;
      pointer.y = (e.clientY / view.h) * 2 - 1;
    },
    { passive: true }
  );

  // ---- Loop -------------------------------------------------------------------
  let smoothScroll = window.scrollY;
  let intro = reduceMotion ? 1 : 0;
  if (gsap && !reduceMotion) {
    const introState = { v: 0 };
    gsap.to(introState, { v: 1, duration: 1.8, ease: "expo.out", delay: 0.15, onUpdate: () => (intro = introState.v) });
  } else {
    intro = 1;
  }

  const clock = new THREE.Clock();
  const tick = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    const ease = reduceMotion ? 1 : 1 - Math.pow(0.0008, dt);
    smoothScroll += (window.scrollY - smoothScroll) * ease;
    pointer.sx += (pointer.x - pointer.sx) * ease;
    pointer.sy += (pointer.y - pointer.sy) * ease;

    const s = sample(smoothScroll);
    const float = reduceMotion ? 0 : Math.sin(time * 0.9) * 0.06;
    rig.position.set(s.x, s.y + float - (1 - intro) * 1.2, 0);
    rig.scale.setScalar(s.scale * (0.6 + 0.4 * intro));
    jar.rotation.set(
      s.rotX + pointer.sy * 0.12,
      s.rotY + pointer.sx * 0.3 + (1 - intro) * -1.6,
      s.rotZ
    );
    bodyMat.color.copy(s.color);
    if (labelMat.map !== labelTextures[s.label]) {
      labelMat.map = labelTextures[s.label];
      labelMat.needsUpdate = true;
    }
    shadow.material.opacity = intro;

    const range = view.halfH * 2 + 4;
    capsules.forEach((m) => {
      const u = m.userData;
      const depth = 1 + (u.z + 5) * 0.25;
      let y = u.y + smoothScroll * 0.0016 * depth + Math.sin(time * u.speed + u.phase) * 0.25;
      y = ((((y + range / 2) % range) + range) % range) - range / 2;
      m.position.set(u.x * (view.halfW / 4.5) + pointer.sx * 0.15 * depth, y, u.z);
      if (!reduceMotion) {
        m.rotation.x += u.spin.x * dt;
        m.rotation.y += u.spin.y * dt;
      }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
