// IMPORTANT: a Settings > JS > Add External Scripts, afegeix:
// https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js

const root = document.documentElement;
const canvas = document.getElementById("asciiField");
const ctx = canvas.getContext("2d");

let dpr = 1;
let cell = 18;
let cols = 0;
let rows = 0;
let pageWidth = 0;
let pageHeight = 0;
let traces = [];
let dust = [];
let serpents = [];
let lastTime = 0;
let phase = 0;
let lastMeasuredHeight = 0;

const pointer = {
  x: window.innerWidth * 0.5,
  y: window.innerHeight * 0.5,
  active: false
};

function rand(a, b, c = 0) {
  const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return v - Math.floor(v);
}

function getDocumentHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function getDocumentWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.scrollWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth,
    window.innerWidth
  );
}

function resizeCanvas(force = false) {
  dpr = window.devicePixelRatio || 1;

  const nextWidth = getDocumentWidth();
  const nextHeight = getDocumentHeight();

  if (!force && nextWidth === pageWidth && nextHeight === pageHeight) return;

  pageWidth = nextWidth;
  pageHeight = nextHeight;
  lastMeasuredHeight = nextHeight;

  canvas.width = Math.max(1, Math.floor(pageWidth * dpr));
  canvas.height = Math.max(1, Math.floor(pageHeight * dpr));
  canvas.style.width = `${pageWidth}px`;
  canvas.style.height = `${pageHeight}px`;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  cell = window.innerWidth < 768 ? 15 : 18;
  cols = Math.ceil(pageWidth / cell);
  rows = Math.ceil(pageHeight / cell);

  buildSystem();
}

function buildSystem() {
  traces = [];
  dust = [];
  serpents = [];

  const columnCount = window.innerWidth < 768
    ? Math.max(18, Math.floor(cols * 0.42))
    : Math.max(28, Math.floor(cols * 0.38));

  for (let i = 0; i < columnCount; i++) {
    let x = Math.floor(((i + 0.5) / columnCount) * cols + (rand(i, 1, 1) - 0.5) * 5);
    let y = Math.floor(rand(i, 2, 2) * 3);
    let dir = "down";
    const path = [];
    const maxSteps = Math.floor(rows * (1.15 + rand(i, 3, 3) * 0.55));

    for (let s = 0; s < maxSteps; s++) {
      path.push({
        x,
        y,
        dir,
        accent: rand(i, s, 4) > 0.84,
        weight: 0.8 + rand(i, s, 5) * 0.52,
        seed: rand(i, s, 6)
      });

      const r = rand(i, s, 7);

      if (dir === "down") {
        if (r < 0.56) dir = "down";
        else if (r < 0.7) dir = "diagDownRight";
        else if (r < 0.84) dir = "diagDownLeft";
        else if (r < 0.92) dir = "right";
        else dir = "left";
      } else if (dir === "diagDownRight") {
        if (r < 0.5) dir = "diagDownRight";
        else if (r < 0.82) dir = "down";
        else dir = "right";
      } else if (dir === "diagDownLeft") {
        if (r < 0.5) dir = "diagDownLeft";
        else if (r < 0.82) dir = "down";
        else dir = "left";
      } else if (dir === "right") {
        if (r < 0.38) dir = "right";
        else if (r < 0.72) dir = "diagDownRight";
        else dir = "down";
      } else if (dir === "left") {
        if (r < 0.38) dir = "left";
        else if (r < 0.72) dir = "diagDownLeft";
        else dir = "down";
      }

      if (dir === "down") y += 1;
      else if (dir === "right") x += 1;
      else if (dir === "left") x -= 1;
      else if (dir === "diagDownRight") {
        x += 1;
        y += 1;
      } else if (dir === "diagDownLeft") {
        x -= 1;
        y += 1;
      }

      if (x < 1) x = 1;
      if (x > cols - 2) x = cols - 2;
      if (y >= rows - 1) break;
    }

    traces.push(path);
  }

  const serpentCount = window.innerWidth < 768
    ? Math.max(5, Math.floor(cols * 0.09))
    : Math.max(8, Math.floor(cols * 0.075));

  for (let i = 0; i < serpentCount; i++) {
    let x = Math.floor(((i + 0.5) / serpentCount) * cols + (rand(i, 40, 1) - 0.5) * 8);
    let y = 0;
    const path = [];
    const maxSteps = Math.floor(rows * 1.45);
    let drift = rand(i, 41, 2) > 0.5 ? 1 : -1;

    for (let s = 0; s < maxSteps; s++) {
      const r = rand(i, s, 42);
      let dir = "down";

      if (r < 0.62) dir = "down";
      else if (r < 0.76) dir = drift > 0 ? "diagDownRight" : "diagDownLeft";
      else if (r < 0.88) dir = drift > 0 ? "right" : "left";
      else dir = "down";

      path.push({
        x,
        y,
        dir,
        seed: rand(i, s, 44)
      });

      if (dir === "down") y += 1;
      else if (dir === "right") x += 1;
      else if (dir === "left") x -= 1;
      else if (dir === "diagDownRight") {
        x += 1;
        y += 1;
      } else if (dir === "diagDownLeft") {
        x -= 1;
        y += 1;
      }

      if (rand(i, s, 43) > 0.9) drift *= -1;

      if (x < 2) {
        x = 2;
        drift = 1;
      }
      if (x > cols - 3) {
        x = cols - 3;
        drift = -1;
      }
      if (y >= rows - 1) break;
    }

    serpents.push(path);
  }

  for (let y = 0; y < rows; y++) {
    const verticalBias = y / Math.max(1, rows - 1);

    for (let x = 0; x < cols; x++) {
      const r = rand(x, y, 9);

      if (r > 0.87 - verticalBias * 0.08) {
        dust.push({
          x,
          y,
          seed: rand(x, y, 11),
          bias: rand(x, y, 12),
          speed: 0.28 + rand(x, y, 13) * 0.65
        });
      }
    }
  }
}

function charForDir(dir, accent, pulse) {
  if (dir === "down") return pulse > 0.82 ? "!" : (accent ? "!" : "|");
  if (dir === "right" || dir === "left") return pulse > 0.78 ? "=" : (accent ? "=" : "-");
  if (dir === "diagDownRight") return pulse > 0.82 ? ":" : "\\\\";
  if (dir === "diagDownLeft") return pulse > 0.82 ? ":" : "/";
  return ".";
}

function serpentChar(dir, pulse) {
  if (dir === "down") return pulse > 0.84 ? "#" : "!";
  if (dir === "right" || dir === "left") return pulse > 0.84 ? "#" : "=";
  if (dir === "diagDownRight") return "\\\\";
  if (dir === "diagDownLeft") return "/";
  return "|";
}

function dustChar(value) {
  if (value < 0.18) return ".";
  if (value < 0.36) return ",";
  if (value < 0.58) return ":";
  if (value < 0.78) return "'";
  return ";";
}

function drawTrace(seg) {
  const px = seg.x * cell + cell * 0.5;
  const py = seg.y * cell + cell * 0.5;

  const dx = pointer.x - px;
  const dy = (pointer.y + window.scrollY) - py;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const influence = pointer.active ? Math.max(0, 1 - dist / 135) : 0;
  const safeDist = Math.max(dist, 0.0001);

  const pulse = (Math.sin(phase * 0.85 + seg.seed * 14) + 1) * 0.5;
  const offsetX = influence > 0 ? -(dx / safeDist) * 2.6 * influence : 0;
  const offsetY = influence > 0 ? -(dy / safeDist) * 4.1 * influence : 0;

  let alpha = 0.08 * seg.weight;
  if (seg.dir === "down") alpha = 0.17 * seg.weight;
  if (seg.dir === "right" || seg.dir === "left") alpha = 0.09 * seg.weight;
  if (seg.dir === "diagDownRight" || seg.dir === "diagDownLeft") alpha = 0.13 * seg.weight;

  alpha += pulse * 0.03;
  alpha += influence * 0.3;

  ctx.font = `${window.innerWidth < 768 ? "normal 12.5px monospace" : "normal 13.5px monospace"}`;
  ctx.fillStyle = `rgba(243, 238, 230, ${alpha})`;
  ctx.fillText(charForDir(seg.dir, seg.accent, pulse), px + offsetX, py + offsetY);
}

function drawSerpent(seg) {
  const px = seg.x * cell + cell * 0.5;
  const py = seg.y * cell + cell * 0.5;

  const dx = pointer.x - px;
  const dy = (pointer.y + window.scrollY) - py;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const influence = pointer.active ? Math.max(0, 1 - dist / 165) : 0;
  const safeDist = Math.max(dist, 0.0001);

  const pulse = (Math.sin(phase * 0.7 + seg.seed * 10) + 1) * 0.5;
  const offsetX = influence > 0 ? -(dx / safeDist) * 3.1 * influence : 0;
  const offsetY = influence > 0 ? -(dy / safeDist) * 4.8 * influence : 0;

  const alpha = 0.21 + pulse * 0.04 + influence * 0.35;

  ctx.font = `${window.innerWidth < 768 ? "normal 700 13px monospace" : "normal 700 15px monospace"}`;
  ctx.fillStyle = `rgba(243, 238, 230, ${alpha})`;
  ctx.fillText(serpentChar(seg.dir, pulse), px + offsetX, py + offsetY);
}

function drawDust(item) {
  const px = item.x * cell + cell * 0.5;
  const py = item.y * cell + cell * 0.5;

  const dx = pointer.x - px;
  const dy = (pointer.y + window.scrollY) - py;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const influence = pointer.active ? Math.max(0, 1 - dist / 150) : 0;
  const safeDist = Math.max(dist, 0.0001);

  const wave = (Math.sin(phase * item.speed + item.seed * 12) + 1) * 0.5;
  const value = Math.min(1, item.bias * 0.18 + wave * 0.7 + influence * 0.95);
  const char = dustChar(value);

  const offsetX = influence > 0 ? -(dx / safeDist) * 1.2 * influence : 0;
  const offsetY = influence > 0 ? -(dy / safeDist) * 2.1 * influence : 0;

  let alpha = 0.008 + value * 0.06;
  alpha += influence * 0.11;

  ctx.font = `${window.innerWidth < 768 ? "normal 12px monospace" : "normal 13px monospace"}`;
  ctx.fillStyle = `rgba(243, 238, 230, ${alpha})`;
  ctx.fillText(char, px + offsetX, py + offsetY);
}

function maybeGrowCanvas() {
  const currentHeight = getDocumentHeight();
  if (currentHeight !== lastMeasuredHeight) {
    resizeCanvas(true);
  }
}

function render(now = 0) {
  const delta = Math.min(0.05, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  phase += delta * 1.45;

  maybeGrowCanvas();

  ctx.clearRect(0, 0, pageWidth, pageHeight);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < dust.length; i++) drawDust(dust[i]);
  for (let i = 0; i < traces.length; i++) {
    for (let j = 0; j < traces[i].length; j++) drawTrace(traces[i][j]);
  }
  for (let i = 0; i < serpents.length; i++) {
    for (let j = 0; j < serpents[i].length; j++) drawSerpent(serpents[i][j]);
  }

  requestAnimationFrame(render);
}

window.addEventListener("mousemove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;
});

window.addEventListener("mouseleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", () => resizeCanvas(true));
window.addEventListener("load", () => resizeCanvas(true));

resizeCanvas(true);
requestAnimationFrame(render);

const headerSymbol = document.getElementById("headerSymbol");

if (headerSymbol) {
  const symbols = ["#", "*", "^", "#", "*", "^", "+", "%", "/", "\\\\", "=", "~"];
  let symbolIndex = 0;

  const setNextSymbol = () => {
    symbolIndex = (symbolIndex + 1) % symbols.length;
    headerSymbol.style.opacity = "0.12";
    headerSymbol.style.transform = "translateY(-0.03rem) scale(0.82)";

    setTimeout(() => {
      headerSymbol.textContent = symbols[symbolIndex];
      headerSymbol.style.opacity = "1";
      headerSymbol.style.transform = "translateY(-0.03rem) scale(1)";
    }, 90);
  };

  setInterval(setNextSymbol, 820);
}

// Toggle d'idioma simple (només CA/EN visual del botó; el contingut d'aquesta pàgina és estàtic)
let currentLanguage = "ca";
const languageToggle = document.getElementById("languageToggle");
const languageIndicators = document.querySelectorAll("[data-lang-indicator]");

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "ca" ? "en" : "ca";
    languageIndicators.forEach((indicator) => {
      indicator.classList.toggle("is-active", indicator.dataset.langIndicator === currentLanguage);
    });
    const nextLang = currentLanguage === "ca" ? "English" : "català";
    languageToggle.setAttribute("aria-label", `Canviar idioma a ${nextLang}`);
  });
}

// ============================================================
// FLIPBOOKS — requereix l'script extern de jsDelivr (page-flip)
// ============================================================

const pageFlipSuperior = new St.PageFlip(document.getElementById('book-superior'), {
    width: 550,
    height: 780,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1100,
    minHeight: 420,
    maxHeight: 1560,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true
});
pageFlipSuperior.loadFromHTML(document.querySelectorAll('#book-superior .page'));

const pageFlipInferior = new St.PageFlip(document.getElementById('book-inferior'), {
    width: 550,
    height: 780,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1100,
    minHeight: 420,
    maxHeight: 1560,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: false,
    usePortrait: true
});
pageFlipInferior.loadFromHTML(document.querySelectorAll('#book-inferior .page'));
// ADDICIÓ MÒBIL — injecta el viewport si no existeix
(function ensureViewportMeta() {
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
    document.head.appendChild(meta);
  }
})();