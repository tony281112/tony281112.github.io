// ======= Botones (sí/no) =======
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const modal  = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

yesBtn.addEventListener("click", () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  burst(18);
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});

noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("click", dodgeNo);

function dodgeNo(){
  // se mueve para que sea difícil decir que no 😈💗
  const card = document.querySelector(".card");
  const rect = card.getBoundingClientRect();
  const maxX = rect.width - noBtn.offsetWidth - 10;
  const maxY = rect.height - noBtn.offsetHeight - 10;

  const x = Math.max(10, Math.random() * maxX);
  const y = Math.max(10, Math.random() * maxY);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;

  burst(8);
}

// ======= Fondo de corazones (canvas) =======
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

let W, H;
function resize(){
  W = canvas.width  = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
}
window.addEventListener("resize", resize);
resize();

const hearts = [];
const rand = (a,b)=> a + Math.random()*(b-a);

function addHeart(x, y){
  hearts.push({
    x: x * devicePixelRatio,
    y: y * devicePixelRatio,
    r: rand(8, 16) * devicePixelRatio,
    vy: rand(-1.4, -0.6) * devicePixelRatio,
    vx: rand(-0.6, 0.6) * devicePixelRatio,
    a: 1,
    spin: rand(-0.05, 0.05),
    rot: rand(0, Math.PI*2),
  });
}

function burst(n){
  const x = window.innerWidth/2;
  const y = window.innerHeight/2;
  for(let i=0;i<n;i++){
    addHeart(x + rand(-80,80), y + rand(-40,40));
  }
}

// Interacción: mouse y touch
window.addEventListener("mousemove", (e) => {
  if (Math.random() < 0.25) addHeart(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t && Math.random() < 0.45) addHeart(t.clientX, t.clientY);
}, {passive:true});

// Dibuja un corazón simple
function drawHeart(x, y, size, rot, alpha){
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;

  // color rosado sin especificar en CSS; aquí sí porque es canvas
  ctx.fillStyle = "rgba(255, 77, 135, 1)";

  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s*0.35);
  ctx.bezierCurveTo(0, -s*0.25, -s, -s*0.05, -s, s*0.45);
  ctx.bezierCurveTo(-s, s*0.95, 0, s*1.15, 0, s*1.45);
  ctx.bezierCurveTo(0, s*1.15, s, s*0.95, s, s*0.45);
  ctx.bezierCurveTo(s, -s*0.05, 0, -s*0.25, 0, s*0.35);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function tick(){
  ctx.clearRect(0,0,W,H);

  for(let i=hearts.length-1; i>=0; i--){
    const h = hearts[i];
    h.x += h.vx;
    h.y += h.vy;
    h.vy -= 0.0025 * devicePixelRatio;  // acelera hacia arriba suavemente
    h.a -= 0.006;
    h.rot += h.spin;

    drawHeart(h.x, h.y, h.r, h.rot, Math.max(h.a,0));

    if(h.a <= 0 || h.y < -60 * devicePixelRatio){
      hearts.splice(i,1);
    }
  }

  requestAnimationFrame(tick);
}

burst(20);
tick();
