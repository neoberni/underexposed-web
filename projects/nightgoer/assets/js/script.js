const translations = {
  ca: {
    projectText: "Projecte de fotografia enfocat a l'escena musical, tant a Barcelona com a altres països. Alguns dels seguents artistes són Harto Falion, The Cure, Rooster, Garett Caramel, siempresolo, una1ka, Pedro Ladroga i Moodymann, d'entre altres."
  },
  en: {
    projectText: "[Nightgoer project text — pending.]"
  }
};

const fades = document.querySelectorAll(".fade-in");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fades.forEach(item => revealObserver.observe(item));

/* Simbol animat del header (identic a la pagina principal) */
const headerSymbol = document.getElementById("headerSymbol");

if (headerSymbol) {
  const symbols = ["#", "*", "^", "#", "*", "^", "+", "%", "/", "\\", "=", "~"];
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

/* Toggle d'idioma d'un sol boto (identic a la pagina principal) */
let currentLanguage = "ca";
const languageToggle = document.getElementById("languageToggle");
const languageIndicators = document.querySelectorAll("[data-lang-indicator]");

function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  currentLanguage = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dict[key]) element.textContent = dict[key];
  });

  languageIndicators.forEach((indicator) => {
    indicator.classList.toggle("is-active", indicator.dataset.langIndicator === lang);
  });

  if (languageToggle) {
    const nextLang = lang === "ca" ? "English" : "català";
    languageToggle.setAttribute("aria-label", `Canviar idioma a ${nextLang}`);
  }
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    applyLanguage(currentLanguage === "ca" ? "en" : "ca");
  });
}

applyLanguage("ca");