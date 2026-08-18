// ---------- Cursor spark trail (desktop only) ----------
const isTouch = matchMedia('(hover: none)').matches;
if (!isTouch && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let last = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 45) return;
    last = now;
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = (e.clientX - 2.5) + 'px';
    spark.style.top = (e.clientY - 2.5) + 'px';
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1200);
  });
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ---------- Side nav active state ----------
const navLinks = document.querySelectorAll('.starnav a');
const sections = document.querySelectorAll('section[id], header[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector('.starnav a[href="#' + entry.target.id + '"]');
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObserver.observe(s));

// ---------- Job accordion ----------
document.querySelectorAll('.job-head').forEach(head => {
  head.addEventListener('click', () => {
    const job = head.closest('.job');
    job.classList.toggle('open');
    const toggle = head.querySelector('.job-toggle');
    toggle.textContent = job.classList.contains('open') ? 'Close ↑' : 'Read more ↓';
  });
});

document.querySelectorAll('.job').forEach(job => {
  if (job.dataset.open === 'true') {
    job.classList.add('open');
    job.querySelector('.job-toggle').textContent = 'Close ↑';
  }
});

// ---------- Skill constellations ----------
const skillData = {
  frontend: ['React', 'React Native', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3'],
  backend: ['Node.js', 'REST APIs', 'SQL', 'Firebase', 'Auth Systems', 'Database Fundamentals'],
  tools: ['Git', 'GitHub', 'Docker', 'VS Code', 'Agile', 'Remote Collaboration']
};

document.querySelectorAll('.star-field').forEach(field => {
  const group = field.dataset.group;
  const names = skillData[group];
  const svg = field.querySelector('svg');
  const lineGroup = svg.querySelector('.lines');
  const positions = [];

  names.forEach((name, i) => {
    const star = document.createElement('div');
    star.className = 'skill-star';
    star.dataset.name = name;
    const x = 10 + (i % 3) * 38 + Math.random() * 10;
    const y = 15 + Math.floor(i / 3) * 55 + Math.random() * 15;
    star.style.left = x + '%';
    star.style.top = y + '%';
    field.appendChild(star);
    positions.push({ x, y });
  });

  for (let i = 0; i < positions.length - 1; i++) {
    const a = positions[i], b = positions[i + 1];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x + '%');
    line.setAttribute('y1', a.y + '%');
    line.setAttribute('x2', b.x + '%');
    line.setAttribute('y2', b.y + '%');
    lineGroup.appendChild(line);
  }
});

// ---------- Constellation flip cards ----------
const isTouchDevice = matchMedia('(hover: none)').matches;

const flipTitles = {
  frontend: 'Frontend',
  backend: 'Backend & Full Stack',
  tools: 'Tools & Workflow'
};

if (isTouchDevice) {
  // On mobile: replace star fields with a plain skill list on the front
  document.querySelectorAll('.constellation-flip').forEach(card => {
    const front = card.querySelector('.flip-front');
    const group = card.querySelector('.star-field').dataset.group;

    front.querySelector('.star-field').remove();

    const list = document.createElement('div');
    list.className = 'mobile-skill-list';
    skillData[group].forEach(name => {
      const item = document.createElement('div');
      item.className = 'flip-skill';
      item.textContent = name;
      list.appendChild(item);
    });
    front.appendChild(list);

    card.style.cursor = 'default';
  });
} else {
  // On desktop: populate back faces and enable flip on click
  document.querySelectorAll('.flip-back').forEach(back => {
    const group = back.dataset.group;
    const title = document.createElement('div');
    title.className = 'flip-back-title';
    title.textContent = flipTitles[group];
    back.appendChild(title);

    skillData[group].forEach(name => {
      const item = document.createElement('div');
      item.className = 'flip-skill';
      item.textContent = name;
      back.appendChild(item);
    });

    const hint = document.createElement('div');
    hint.className = 'flip-hint';
    hint.textContent = 'click to flip back';
    back.appendChild(hint);
  });

  document.querySelectorAll('.constellation-flip').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}
