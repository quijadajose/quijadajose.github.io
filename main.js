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
    // Funciones helper para obtener elementos del modal (por si se cargan dinámicamente)
    function getModalElements() {
        return {
            modal: document.getElementById('video-modal'),
            modalVideo: document.getElementById('modal-video-player'),
            modalImage: document.getElementById('modal-image-player'),
            closeModalBtn: document.querySelector('.close-modal')
        };
    }

    function openModal(videoSrc, imgSrc) {
        const { modal, modalVideo, modalImage } = getModalElements();
        if (!modal) return;

        const transition = document.startViewTransition ? document.startViewTransition(() => {
            modal.style.display = 'block';
            if (videoSrc && modalVideo) {
                modalVideo.style.display = 'block';
                modalVideo.src = videoSrc;
                modalVideo.play().catch(() => {
                    // Ignorar errores de autoplay
                });
            } else if (imgSrc && modalImage) {
                modalImage.style.display = 'block';
                modalImage.src = imgSrc;
            }
        }) : null;

        if (!transition) {
            // Fallback para navegadores sin soporte
            modal.style.display = 'block';
            if (videoSrc && modalVideo) {
                modalVideo.style.display = 'block';
                modalVideo.src = videoSrc;
                modalVideo.play().catch(() => {});
            } else if (imgSrc && modalImage) {
                modalImage.style.display = 'block';
                modalImage.src = imgSrc;
            }
        }
    }

    function closeModal() {
        const { modal, modalVideo, modalImage } = getModalElements();
        if (!modal) return;

        const transition = document.startViewTransition ? document.startViewTransition(() => {
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
        }) : null;

        if (!transition) {
            // Fallback para navegadores sin soporte
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

    // Hacer las funciones disponibles globalmente para uso en otros scripts
    window.openModal = openModal;
    window.closeModal = closeModal;

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

                openModal(videoSrc, imgSrc);
            });
        });
    };

    // Initial run
    window.initModals();

    // Configurar event listeners para cerrar el modal
    // Usar setTimeout para asegurar que el modal se haya cargado si es dinámico
    setTimeout(() => {
        const { modal, closeModalBtn } = getModalElements();
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (modal) {
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }
    }, 100);

    // Cleanup for ESC key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // View Transitions para navegación entre páginas
    if ('startViewTransition' in document) {
        // Interceptar clicks en enlaces internos
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            // Solo procesar enlaces internos (no externos, no anchors en la misma página)
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || anchor.hasAttribute('target')) {
                return;
            }

            // Verificar si es un enlace a otra página
            try {
                const url = new URL(href, window.location.href);
                if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
                    e.preventDefault();
                    document.startViewTransition(() => {
                        window.location.href = href;
                    });
                }
            } catch {
                // Si no es una URL válida, ignorar
            }
        });
    }

    // View Transitions para navegación por anchors (scroll suave con transición)
    if ('startViewTransition' in document) {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Usar view transition solo si estamos en la misma página
                if (window.location.pathname === anchor.pathname || !anchor.pathname || anchor.pathname === window.location.pathname) {
                    document.startViewTransition(() => {
                        // Calcular posición considerando el header fijo
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    });
                } else {
                    // Si es otra página, usar el comportamiento normal
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }
}

// Initialize the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}