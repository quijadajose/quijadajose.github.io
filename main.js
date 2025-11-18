let currentLanguage = localStorage.getItem('language') || 'es';
async function loadTranslations(lang) {
    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
        if (lang === 'es') {
            cvLink.href = 'https://docs.google.com/document/d/1fF-VH7AlA1MCnMFJ4XN9DSWjT2AGjMzX/edit?usp=sharing&ouid=117283505667745184554&rtpof=true&sd=true';
        } else {
            cvLink.href = 'https://docs.google.com/document/d/1FGrXWu8lO3BEIF0xofKLRwXo0A8osanH/edit?usp=sharing&ouid=117283505667745184554&rtpof=true&sd=true';
        }
    }
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        applyTranslations(translations);
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    document.querySelectorAll('img[data-i18n-alt]').forEach(img => {
        const altKey = img.getAttribute('data-i18n-alt');
        if (altKey && translations[altKey]) {
            img.alt = translations[altKey];
        }
    });

    document.querySelector('meta[name="description"]').content = translations.meta_description || '';
    document.querySelector('meta[name="keywords"]').content = translations.meta_keywords || '';
    document.querySelector('meta[property="og:title"]').content = translations.og_title || '';
    document.querySelector('meta[property="og:description"]').content = translations.og_description || '';
    document.querySelector('title').textContent = translations.page_title || '';
}

function initApp() {
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = currentLanguage;
        languageSelector.addEventListener('change', (event) => {
            loadTranslations(event.target.value);
        });
    }
    loadTranslations(currentLanguage);
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }

    function getPreferredTheme() {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; //Correct class
            }
        }
    }

    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);


    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            const newColorScheme = event.matches ? 'dark' : 'light';
            setTheme(newColorScheme);
        }
    });

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const rawHref = this.getAttribute('href') || '';
            if (rawHref.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(rawHref);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, '', rawHref);
                    targetSection.setAttribute('tabindex', '-1');
                    targetSection.focus({ preventScroll: true });
                }
                return;
            }
            try {
                const targetUrl = new URL(this.href);
                const here = new URL(location.href);
                const isIndexTarget = /(?:^|\/)index\.html$/i.test(targetUrl.pathname) || targetUrl.pathname === '/';
                const isHereIndex = /(?:^|\/)index\.html$/i.test(here.pathname) || here.pathname === '/';
                if (isIndexTarget && isHereIndex && targetUrl.hash) {
                    const targetSection = document.querySelector(targetUrl.hash);
                    if (targetSection) {
                        e.preventDefault();
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                        history.pushState(null, '', targetUrl.hash);
                        targetSection.setAttribute('tabindex', '-1');
                        targetSection.focus({ preventScroll: true });
                    }
                }
            } catch (_) {
                console.log('Error processing link:', this.href);
            }
        });
    });

    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
const clarityScript = () => {
    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "pj3uwxd9a0");
};

const storageKey = "clarity-consent";

const showBannerIfNeeded = () => {
    const consent = localStorage.getItem(storageKey);
    if (consent === null) {
        document.getElementById("consent-banner").style.display = "block";
    } else if (consent === "accepted") {
        clarityScript();
    }
};

const acceptBtn = document.getElementById("accept-tracking");
const declineBtn = document.getElementById("decline-tracking");
if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
        localStorage.setItem(storageKey, "accepted");
        const banner = document.getElementById("consent-banner");
        if (banner) banner.style.display = "none";
        clarityScript();
    });
}
if (declineBtn) {
    declineBtn.addEventListener("click", () => {
        localStorage.setItem(storageKey, "declined");
        const banner = document.getElementById("consent-banner");
        if (banner) banner.style.display = "none";
    });
}


showBannerIfNeeded();