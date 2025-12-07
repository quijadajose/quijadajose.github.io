import { loadTranslations, setLanguage, translatePage } from './components/i18n.js';

export async function initApp() {
    await loadTranslations();

    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = userLang.startsWith('es') ? 'es' : 'en';
    setLanguage(defaultLang);

    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = defaultLang;
        languageSelector.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Matrix theme is dark by default, so we prioritize dark mode logic
    // But we keep the toggle for user preference if they really want "light" mode (which is just inverted matrix)

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Modal Logic for Videos
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video-player');
    const closeModalBtn = document.querySelector('.close-modal');
    const mediaContainers = document.querySelectorAll('.media-container[data-video-src]');

    mediaContainers.forEach(container => {
        container.addEventListener('click', () => {
            const videoSrc = container.getAttribute('data-video-src');
            if (videoSrc && modal && modalVideo) {
                modal.style.display = 'block';
                modalVideo.src = videoSrc;
                modalVideo.play();
            }
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = ''; // Clear source to stop buffering
            }
        }
    }
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}