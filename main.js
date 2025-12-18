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

    // Modal Logic for Media (Video and Image)
    const modal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video-player');
    const modalImage = document.getElementById('modal-image-player');
    const closeModalBtn = document.querySelector('.close-modal');

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = '';
                modalVideo.style.display = 'none';
            }
            if (modalImage) {
                modalImage.src = '';
                modalImage.style.display = 'none';
            }
        }
    }

    // This function can be called after dynamic content is loaded (like in blog.html)
    window.initModals = function () {
        const mediaContainers = document.querySelectorAll('.media-container[data-video-src], .media-container[data-img-src]');

        mediaContainers.forEach(container => {
            // Remove old listeners to avoid duplicates
            const newContainer = container.cloneNode(true);
            container.parentNode.replaceChild(newContainer, container);

            newContainer.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click in blog
                const videoSrc = newContainer.getAttribute('data-video-src');
                const imgSrc = newContainer.getAttribute('data-img-src');

                if (modal) {
                    modal.style.display = 'block';
                    if (videoSrc && modalVideo) {
                        modalVideo.style.display = 'block';
                        modalVideo.src = videoSrc;
                        modalVideo.play();
                    } else if (imgSrc && modalImage) {
                        modalImage.style.display = 'block';
                        modalImage.src = imgSrc;
                    }
                }
            });
        });
    };

    // Initial run
    window.initModals();

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cleanup for ESC key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
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