const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const toggleBtn = document.getElementById("toggleSimBtn");
const resetBtn = document.getElementById("resetBtn");
const chargeSlider = document.getElementById("chargeSlider");
const chargeValDisplay = document.getElementById("charge-value");
const speedSlider = document.getElementById("speedSlider");
const speedValDisplay = document.getElementById("speed-value");

let isRunning = false;
let chargeMagnitude = 20000; 
let simSpeed = 1.0;
let charges = [];
let gridVectors = [];

const GRID_COLS = 53;
const GRID_ROWS = 30;
const K_CONST = 50.0;
const PHYS_K = 2.0;  
const DAMPING = 0.96;
const MIN_DIST = 35.0;
const MAX_FORCE = 15.0;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ElectricCharge {
    constructor(x, y, q) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.q = q;
        this.radius = 12;
    }

    update() {
        if (!isRunning) return;

        this.pos.x += this.vel.x * simSpeed;
        this.pos.y += this.vel.y * simSpeed;

        if (this.pos.x < this.radius) { this.pos.x = this.radius; this.vel.x *= -1; }
        if (this.pos.x > canvas.width - this.radius) { this.pos.x = canvas.width - this.radius; this.vel.x *= -1; }
        if (this.pos.y < this.radius) { this.pos.y = this.radius; this.vel.y *= -1; }
        if (this.pos.y > canvas.height - this.radius) { this.pos.y = canvas.height - this.radius; this.vel.y *= -1; }

        this.vel.x *= DAMPING;
        this.vel.y *= DAMPING;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        
        if (this.q > 0) {
            ctx.fillStyle = "#ff2a6d"; 
            ctx.shadowColor = "#ff2a6d";
        } else {
            ctx.fillStyle = "#0040ff"; 
            ctx.shadowColor = "#0040ff";
        }
        
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius/3, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }
}

class FieldVector {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.e = new Vector2(0, 0);
    }

    calculateField(charges) {
        this.e.x = 0;
        this.e.y = 0;

        for (let charge of charges) {
            let dx = this.pos.x - charge.pos.x;
            let dy = this.pos.y - charge.pos.y;
            let r2 = dx*dx + dy*dy;
            
            r2 += 50*50;
            
            let eMag = (K_CONST * charge.q) / r2;
            let r = Math.sqrt(r2);
            
            this.e.x += (dx / r) * eMag; 
            this.e.y += (dy / r) * eMag;
        }
    }

    draw(ctx) {
        const mag = Math.sqrt(this.e.x * this.e.x + this.e.y * this.e.y);
        if (mag < 0.5) return;

        let drawEx = this.e.x;
        let drawEy = this.e.y;
        
        const maxLen = 40;
        const currentLen = Math.sqrt(drawEx*drawEx + drawEy*drawEy);
        if(currentLen > maxLen) {
            drawEx = (drawEx / currentLen) * maxLen;
            drawEy = (drawEy / currentLen) * maxLen;
        }

        const endX = this.pos.x + drawEx;
        const endY = this.pos.y + drawEy;

        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(mag/10, 0.6)})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        const alpha = Math.atan2(drawEy, drawEx);
        const l = 5;
        const phi = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - l * Math.cos(alpha - phi), endY - l * Math.sin(alpha - phi));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - l * Math.cos(alpha + phi), endY - l * Math.sin(alpha + phi));
        ctx.stroke();
    }
}

function updatePhysics() {
    if(!isRunning) return;

    for (let i = 0; i < charges.length; i++) {
        for (let j = i + 1; j < charges.length; j++) {
            let p1 = charges[i];
            let p2 = charges[j];

            let dx = p1.pos.x - p2.pos.x;
            let dy = p1.pos.y - p2.pos.y;
            let distSq = dx*dx + dy*dy;
            let dist = Math.sqrt(distSq);

            let effectiveDist = Math.max(dist, MIN_DIST);
            let effectiveDistSq = effectiveDist * effectiveDist;

            let q1_norm = p1.q / 10000;
            let q2_norm = p2.q / 10000;

            let forceMag = (PHYS_K * q1_norm * q2_norm) / effectiveDistSq * 1000; 

            if (forceMag > MAX_FORCE) forceMag = MAX_FORCE;
            if (forceMag < -MAX_FORCE) forceMag = -MAX_FORCE;

            let nx = dx / dist; 
            let ny = dy / dist;

            let fx = nx * forceMag;
            let fy = ny * forceMag;

            p1.vel.x += fx;
            p1.vel.y += fy;
            p2.vel.x -= fx;
            p2.vel.y -= fy;
        }
        charges[i].update();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gridVectors.forEach(v => {
        v.calculateField(charges);
        v.draw(ctx);
    });

    updatePhysics();
    charges.forEach(c => c.draw(ctx));

    requestAnimationFrame(animate);
}

function initGrid() {
    gridVectors = [];
    const stepX = canvas.width / (GRID_COLS - 1);
    const stepY = canvas.height / (GRID_ROWS - 1);
    for(let i=0; i<GRID_COLS; i++) {
        for(let j=0; j<GRID_ROWS; j++) {
            gridVectors.push(new FieldVector(i * stepX, j * stepY));
        }
    }
}

function resizeCanvas() {
    const simArea = document.getElementById("simulation-area");
    canvas.width = simArea.offsetWidth;
    canvas.height = simArea.offsetHeight;
    initGrid();
}


toggleBtn.addEventListener("click", () => {
    isRunning = !isRunning;
    if(isRunning) {
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        toggleBtn.classList.replace("btn-success", "btn-primary");
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start';
        toggleBtn.classList.replace("btn-primary", "btn-success");
    }
});

resetBtn.addEventListener("click", () => {
    charges = [];
});

chargeSlider.addEventListener("input", (e) => {
    chargeMagnitude = parseInt(e.target.value);
    chargeValDisplay.textContent = chargeMagnitude;
});

speedSlider.addEventListener("input", (e) => {
    simSpeed = parseFloat(e.target.value);
    speedValDisplay.textContent = simSpeed + "x";
});

canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let q = 0;
    if (e.button === 0) { 
        q = -chargeMagnitude;
    } else if (e.button === 2) {
        q = chargeMagnitude;
    } else {
        return;
    }
    charges.push(new ElectricCharge(x, y, q));
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("resize", resizeCanvas);

window.onload = () => {
    resizeCanvas();
    animate();
};