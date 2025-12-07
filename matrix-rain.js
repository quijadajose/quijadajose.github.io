const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const cols = Math.floor(width / 20) + 1;
const ypos = Array(cols).fill(0);

// Matrix characters (Katakana + Latin + Numbers)
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function matrix() {
    // Draw a semi-transparent black rectangle on top of the previous frame to create the trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0F0'; // Green text
    ctx.font = '15pt monospace';

    ypos.forEach((y, index) => {
        // Pick a random character
        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        // x coordinate of the column, y coordinate is the current drop position
        const x = index * 20;

        ctx.fillText(text, x, y);

        // Randomly reset the drop to the top if it has crossed the screen
        // Adding a randomness factor > 0.975 makes the drops fall at different times
        if (y > height && Math.random() > 0.975) {
            ypos[index] = 0;
        } else {
            ypos[index] = y + 20;
        }
    });
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Recalculate columns
    const newCols = Math.floor(width / 20) + 1;
    // Preserve existing drops if possible, or reset
    // For simplicity, we can just expand the array if needed, but resetting is cleaner visually
    if (newCols !== cols) {
        // We'd need to update 'cols' and 'ypos' but 'cols' is const in this scope if we followed strict patterns.
        // Let's reload the page or just accept the glitch for now, or better: make cols dynamic in the loop.
        // Actually, let's just reload the page on resize for a perfect reset or implement a proper resize handler.
        // For this simple script, a reload is often acceptable, but let's try to be dynamic.
        location.reload();
    }
});

// Run the animation
setInterval(matrix, 50);
