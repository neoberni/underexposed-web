
const translations = {
  ca: {
    warningMain: "AVARIADA",
    warningSub: "Disculpeu el portfolio",
    projectText: "Una col·lecció de fotografies de diferents ciutats unides per la bellesa dels vidres trencats. Ja sigui en espais públics o privats, les formes caleidoscòpiques ens recorden a una teranyina d'aranya, i com si fóssim nosaltres l'insecte, ens atrapen captivats per la seva forma i patrons."
  },
  en: {
    warningMain: "FAULTY",
    warningSub: "Sorry for the inconvenience",
    projectText: "A collection of photographs from different cities united by the beauty of broken glass. Whether in public or private spaces, the kaleidoscopic shapes recall a spider's web, and as if we were the insect, they trap us, captivated by their form and patterns."
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
