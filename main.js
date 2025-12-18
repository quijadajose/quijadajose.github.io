import { loadTranslations, setLanguage } from './components/i18n.js';

export async function initApp() {
    // Detect language
    const storedLang = localStorage.getItem('language');
    const userLang = navigator.language || navigator.userLanguage;
    const defaultLang = storedLang || (userLang.startsWith('es') ? 'es' : (userLang.startsWith('ja') ? 'ja' : 'en'));

    // Initialize with the correct language
    await setLanguage(defaultLang);

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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Force dark theme
    document.documentElement.setAttribute('data-theme', 'dark');

    // Modal Logic for Videos
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video-player');
    const closeModalBtn = document.querySelector('.close-modal');
    const mediaContainers = document.querySelectorAll('.media-container[data-video-src]');

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = '';
            }
        }
    }

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
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}