const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.25;
const JUMP = -4.6;
const PIPE_WIDTH = 52;
const PIPE_SPACING = 200;
const PIPE_HEIGHT = 400;

// Bird object
const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    dy: 0,
    jump: function() {
        this.dy = JUMP;
    },
    update: function() {
        this.dy += GRAVITY;
        this.y += this.dy;
    },
    draw: function() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Pipe object
function createPipe(x) {
    const gapY = Math.floor(Math.random() * (canvas.height - 150)) + 50;
    return {
        x: x,
        gapY: gapY,
        draw: function() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, 0, PIPE_WIDTH, this.gapY);
            ctx.fillRect(this.x, this.gapY + 100, PIPE_WIDTH, canvas.height);
        },
        update: function() {
            this.x -= 2;
            if (this.x + PIPE_WIDTH < 0) {
                this.x = canvas.width;
                this.gapY = Math.floor(Math.random() * (canvas.height - 150)) + 50;
            }
        }
    };
}

// Initialize pipes
const pipes = [];
for (let i = 0; i < 3; i++) {
    pipes.push(createPipe(i * PIPE_SPACING + canvas.width));
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw bird
    bird.update();
    bird.draw();

    // Update and draw pipes
    pipes.forEach(pipe => {
        pipe.update();
        pipe.draw();

        // Collision detection
        if (bird.x < pipe.x + PIPE_WIDTH && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.gapY || bird.y + bird.height > pipe.gapY + 100)) {
            resetGame();
        }
    });

    // Collision detection with ground
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }

    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    bird.y = 150;
    bird.dy = 0;
    pipes.forEach((pipe, i) => {
        pipe.x = i * PIPE_SPACING + canvas.width;
    });
}

// Event listener for jump
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        bird.jump();
    }
});

// Start game
gameLoop();
