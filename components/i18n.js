let translations = {};

export async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Could not load translations for ${lang}`);
        }
        translations = await response.json();
        translatePage();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'IMG') {
                element.alt = translation;
            } else if (element.hasAttribute('title')) {
                element.title = translation;
                element.setAttribute('aria-label', translation);
            } else if (element.tagName === 'META') {
                element.content = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), obj);
}

export async function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    await loadTranslations(lang);
}
