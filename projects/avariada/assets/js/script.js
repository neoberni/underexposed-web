const translations = {
  ca: {
    brand: "###2026",
    navHome: "Inici",
    navWork: "Hub",
    navContact: "Contacte",
    warningMain: "AVARIADA",
    warningSub: "Disculpeu el portfolio",
    heroText: "Hub principal de la marca personal. Fotografia i videografia, disseny gràfic, interiors, arquitectura i altres línies de treball que conviuen dins d’un mateix arxiu.",
    hub1: "Photography / Videography",
    hub1Type: "Image",
    hub2: "Graphic Design",
    hub2Type: "Print / Identity",
    hub3: "Interior / Architecture",
    hub3Type: "Space",
    hub4: "Archive / Ongoing",
    hub4Type: "Research",
    disciplinesTitle: "One site, several ways of working.",
    disciplinesCopy: "La web funciona com a entrada principal. Des d’aquí podem després obrir categories, projectes concrets o pàgines específiques segons a qui l’ensenyes.",
    discList1a: "Mode",
    discList1b: "Single hub / multiple outputs",
    discList2a: "Structure",
    discList2b: "Selected work / categories / archive",
    contactTitle: "Col·laboracions, encàrrecs i converses seleccionades.",
    contactCopy: "Aquesta és una estructura inicial. Després hi podem afegir més seccions i més fotografies al carrusel de fons a mesura que vagis publicant material.",
    contactLink1: "Instagram",
    contactLink2: "Email",
    contactLink3: "GitHub"
  },
  en: {
    brand: "###2026",
    navHome: "Home",
    navWork: "Hub",
    navContact: "Contact",
    warningMain: "FAULTY",
    warningSub: "Sorry for the portfolio",
    heroText: "Main hub for the personal brand. Photography and videography, graphic design, interiors, architecture and other lines of work coexisting inside one archive.",
    hub1: "Photography / Videography",
    hub1Type: "Image",
    hub2: "Graphic Design",
    hub2Type: "Print / Identity",
    hub3: "Interior / Architecture",
    hub3Type: "Space",
    hub4: "Archive / Ongoing",
    hub4Type: "Research",
    disciplinesTitle: "One site, several ways of working.",
    disciplinesCopy: "The site works as the main entry point. From here we can later open categories, specific projects or dedicated pages depending on who you show it to.",
    discList1a: "Mode",
    discList1b: "Single hub / multiple outputs",
    discList2a: "Structure",
    discList2b: "Selected work / categories / archive",
    contactTitle: "Selected collaborations, commissions and conversations.",
    contactCopy: "This is an initial structure. Later we can add more sections and more photographs to the background carousel as you publish more material.",
    contactLink1: "Instagram",
    contactLink2: "Email",
    contactLink3: "GitHub"
  }
};

const langButtons = document.querySelectorAll(".lang-btn");
const i18nNodes = document.querySelectorAll("[data-i18n]");
const bgLayers = document.querySelectorAll(".bg-layer");
const fades = document.querySelectorAll(".fade-in");
const warningBanner = document.querySelector(".warning-banner");
const laterSections = [...document.querySelectorAll(".section[data-bg]")];

let currentBg = 1;

function setLanguage(lang) {
  i18nNodes.forEach(node => {
    const key = node.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      node.textContent = translations[lang][key];
    }
  });

  langButtons.forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  document.documentElement.lang = lang;
}

function activateBg(index) {
  if (index === currentBg) return;
  currentBg = index;

  bgLayers.forEach((layer, i) => {
    layer.classList.toggle("is-active", i === index - 1);
  });
}

function updateBackgroundByScroll() {
  const bannerRect = warningBanner.getBoundingClientRect();

  if (bannerRect.bottom > 0) {
    activateBg(1);
    return;
  }

  const vh = window.innerHeight;
  const triggerLine = vh * 0.58;
  let nextBg = 1;

  laterSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const bg = Number(section.dataset.bg || 1);

    if (rect.top <= triggerLine && rect.bottom > triggerLine) {
      nextBg = bg;
    }
  });

  activateBg(nextBg);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fades.forEach(item => revealObserver.observe(item));

langButtons.forEach(btn => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateBackgroundByScroll();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateBackgroundByScroll);

setLanguage("ca");
activateBg(1);
updateBackgroundByScroll();