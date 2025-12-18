const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width, height, cols, ypos;

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    const fontSize = 16;
    cols = Math.floor(width / fontSize) + 1;
    ypos = Array(cols).fill(0).map(() => Math.random() * height); // Random start positions
}

init();

// Matrix characters (Katakana + Latin + Numbers)
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

let lastTime = 0;
const fps = 20;
const interval = 1000 / fps;

function matrix(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > interval) {
        // Draw a semi-transparent black rectangle on top of the previous frame to create the trail effect
        ctx.fillStyle = 'rgba(13, 2, 8, 0.1)'; // Matches --matrix-black
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#00FF41'; // Matches --matrix-green
        ctx.font = '16px monospace';

        ypos.forEach((y, index) => {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = index * 16;

            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.98) {
                ypos[index] = 0;
            } else {
                ypos[index] = y + 16;
            }
        });

        lastTime = timestamp;
    }

    requestAnimationFrame(matrix);
}

// Resize canvas on window resize with debounce or simple re-init
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        init();
    }, 200);
});

// Run the animation
requestAnimationFrame(matrix);
