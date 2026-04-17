/* main.js — Pranav A Portfolio */

// =====================
// CUSTOM CURSOR
// =====================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// =====================
// 3D PARTICLE CANVAS
// =====================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  initParticles();
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.z = Math.random() * 2 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.4 * this.z;
    this.vy = (Math.random() - 0.5) * 0.4 * this.z;
    this.radius = Math.random() * 1.5 * this.z;
    this.alpha = Math.random() * 0.5 + 0.1;
    const r = Math.random();
    if (r < 0.4) this.color = `rgba(0,229,255,${this.alpha})`;
    else if (r < 0.7) this.color = `rgba(124,58,237,${this.alpha})`;
    else this.color = `rgba(244,114,182,${this.alpha * 0.7})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let particles = [];
function initParticles() {
  const count = Math.floor((W * H) / 12000);
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        const alpha = (1 - dist / 130) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// =====================
// 3D HERO CARD TILT
// =====================
const heroCard = document.getElementById('heroCard');
if (heroCard) {
  heroCard.parentElement.addEventListener('mousemove', (e) => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -20;
    const ry = ((e.clientX - cx) / rect.width) * 20;
    heroCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;
  });
  heroCard.parentElement.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'rotateX(0) rotateY(0) scale3d(1,1,1)';
  });
}

// =====================
// PROJECT CARD TILT
// =====================
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.setProperty('--mx', (x / rect.width * 100) + '%');
    card.style.setProperty('--my', (y / rect.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// =====================
// SCROLL REVEAL
// =====================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up').forEach(el => {
  revealObserver.observe(el);
});

// =====================
// NAV SCROLL
// =====================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// =====================
// HERO TAG REVEAL
// =====================
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120 + 200);
  });
});

// =====================
// SMOOTH NAV ACTIVE
// =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// =====================
// FLOATING PARALLAX
// =====================
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.orb');
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 15;
    orb.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
  });
});

// Split letter reveal with staggered delay
document.querySelectorAll('.hero-title .char').forEach((char, i) => {
  char.style.animationDelay = `${0.1 + i * 0.07}s, ${0.1 + i * 0.07}s`;
});