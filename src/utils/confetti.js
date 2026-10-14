// Lightweight Canvas Confetti Burst - 60fps cinematic burst
export function triggerConfetti(originX, originY) {
  let canvas = document.getElementById("tasknest-confetti-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "tasknest-confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    "#FF5E7E", "#FF9966", "#FFD166", "#06D6A0", 
    "#118AB2", "#8338EC", "#3A86FF", "#F72585"
  ];

  const count = 42;
  const particles = [];

  const startX = originX !== undefined ? originX : window.innerWidth / 2;
  const startY = originY !== undefined ? originY : window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2.5,
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: 0.016 + Math.random() * 0.02,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? "rect" : "circle"
    });
  }

  let animFrameId;
  function update() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = false;

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    if (alive) {
      animFrameId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      cancelAnimationFrame(animFrameId);
    }
  }

  update();
}
