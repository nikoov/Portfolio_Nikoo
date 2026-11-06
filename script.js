const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.getElementById('year').textContent = new Date().getFullYear();
const links = [...document.querySelectorAll('nav a')];
if ('IntersectionObserver' in window) {
  const sections = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-10% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach(section => sections.observe(section));
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveals.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .project, .experience-row, .about-intro, .toolbox, .contact').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.transitionDelay = `${index % 2 * 65}ms`;
    reveals.observe(element);
  });
}
let scrollPending = false;
function updateProgress() {
  const scrollRange = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.transform = `scaleX(${scrollRange > 0 ? scrollY / scrollRange : 0})`;
  scrollPending = false;
}
addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();
const finePointer = window.matchMedia('(pointer: fine)');
if (finePointer.matches) {
  document.addEventListener('pointermove', event => {
    if (reduceMotion.matches) return;
    document.body.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${event.clientY}px`);
  }, { passive: true });
  document.querySelectorAll('.project-visual').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (reduceMotion.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('.project').forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && !project.dataset.category.split(' ').includes(button.dataset.filter);
      if (!project.hidden) project.classList.add('visible');
    });
    updateProgress();
  });
});
let copyReset;
document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  clearTimeout(copyReset);
  try {
    await navigator.clipboard.writeText('nikvli382@gmail.com');
    status.textContent = 'Email copied. Let’s connect.';
  } catch {
    status.textContent = 'You can select the email address to copy it.';
  }
  copyReset = setTimeout(() => { status.textContent = ''; }, 4000);
});
// A deterministic Fibonacci sphere: each point is a connected data node.
const canvas = document.getElementById('data-orbit');
const ctx = canvas.getContext('2d');
if (ctx) {
  const points = Array.from({ length: 150 }, (_, i) => {
    const y = 1 - i / 149 * 2;
    const r = Math.sqrt(1 - y * y);
    const angle = Math.PI * (3 - Math.sqrt(5)) * i;
    return { x: Math.cos(angle) * r, y, z: Math.sin(angle) * r };
  });
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i], b = points[j];
      if (Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z) < .33) edges.push([i,j]);
    }
  }
  let width = 0, height = 0, angle = .25, visible = true, frame = null, lastTime = 0;
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const radius = Math.min(width, height) * .36;
    const cx = width * .54, cy = height * .48;
    const projected = points.map(p => {
      const x = p.x * Math.cos(angle) + p.z * Math.sin(angle);
      const z = -p.x * Math.sin(angle) + p.z * Math.cos(angle);
      const y = p.y * Math.cos(.32) - z * Math.sin(.32);
      const depth = p.y * Math.sin(.32) + z * Math.cos(.32);
      return { x: cx + x * radius, y: cy + y * radius, depth };
    });
    ctx.strokeStyle = '#61a4ec20'; ctx.lineWidth = .6;
    ctx.beginPath(); ctx.ellipse(cx, cy, radius * 1.29, radius * .39, -.4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, radius * 1.15, radius * .55, .65, 0, Math.PI * 2); ctx.stroke();
    for (const [i,j] of edges) {
      const a = projected[i], b = projected[j];
      const opacity = .06 + ((a.depth + b.depth + 2) / 4) * .25;
      ctx.strokeStyle = `rgba(125,181,239,${opacity})`;
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    }
    projected.forEach((p, i) => {
      const opacity = .15 + (p.depth + 1) / 2 * .7;
      ctx.fillStyle = `rgba(142,199,255,${opacity})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,i % 13 === 0 ? 2.8 : 1.2,0,Math.PI*2); ctx.fill();
      if (i % 29 === 0 && p.depth > 0) {
        ctx.strokeStyle = '#72aeee25';ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.stroke();
      }
    });
    ctx.font = '7px monospace'; ctx.fillStyle = '#677d94';
    ctx.fillText('INPUT / TRANSFORM / IMPACT', width * .44, height * .89);
  }
  function tick(time) {
    frame = null;
    if (!visible || document.hidden || reduceMotion.matches) { lastTime = 0; return; }
    if (lastTime) angle += Math.min(time - lastTime, 50) * .00011;
    lastTime = time;
    draw(); frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (frame === null && visible && !document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(tick);
    else if (reduceMotion.matches) draw();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      resume();
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange', resume);
  reduceMotion.addEventListener('change', resume);
  addEventListener('resize', resize);
  resize(); resume();
}
