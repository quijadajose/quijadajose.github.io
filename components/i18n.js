let translations = {};

/**
 * Loads translations for a specific language
 * @param {string} lang 
 */
export async function loadTranslations(lang) {
    if (!lang) return;

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

/**
 * Translates all elements with data-i18n attribute
 */
export function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);

        if (translation) {
            updateElementContent(element, translation);
        }
    });
}

function updateElementContent(element, translation) {
    const tagName = element.tagName;

    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
        element.placeholder = translation;
    } else if (tagName === 'IMG') {
        element.alt = translation;
    } else if (element.hasAttribute('title')) {
        element.title = translation;
        element.setAttribute('aria-label', translation);
    } else if (tagName === 'META') {
        element.content = translation;
    } else {
        element.textContent = translation;
    }
}

function getNestedTranslation(obj, key) {
    return key.split('.').reduce((o, i) => (o ? o[i] : null), obj);
}

/**
 * Sets the application language and updates the UI
 * @param {string} lang 
 */
export async function setLanguage(lang) {
    if (!lang) return;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    await loadTranslations(lang);
}
