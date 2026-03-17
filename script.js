/* Lucide Icons */
if (window.lucide) lucide.createIcons();

/* ============================
   CUSTOM CURSOR
   ============================ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

const hoverTargets = 'a, button, .project-card, .world-card, .hero-facets span, .photo-placeholder';

document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================
   NAV — SCROLL EFFECT
   ============================ */
const navbar = document.getElementById('navbar');

/* ── Nav 深色背景模式（进入 About / AI / Tools 区域时文字变白） ── */
const darkBgIds = ['about', 'ai-world', 'tools-world'];
function updateNavTheme() {
  const y = window.scrollY + 100;
  const isDark = darkBgIds.some(id => {
    const el = document.getElementById(id);
    if (!el) return false;
    return y >= el.offsetTop && y < el.offsetTop + el.offsetHeight;
  });
  navbar.classList.toggle('nav-dark', isDark);
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateNavTheme();
}, { passive: true });

updateNavTheme();

/* ============================
   NAV — ACTIVE LINK
   ============================ */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const matches = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', matches);
      });
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px 0px 0px' });

sections.forEach(s => navObserver.observe(s));

/* ============================
   SCROLL REVEAL
   ============================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================
   HERO — LETTER SPLIT ANIMATION
   ============================ */
const heroName = document.getElementById('heroName');
if (heroName) {
  const text = heroName.textContent.trim();
  heroName.innerHTML = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    span.style.animationDelay = `${0.45 + i * 0.09}s`;
    heroName.appendChild(span);
  });
}

/* ============================
   SMOOTH SCROLL
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================
   HERO BG LETTER — PARALLAX
   ============================ */
const heroBgLetter = document.querySelector('.hero-bg-letter');
if (heroBgLetter) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBgLetter.style.transform = `translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
}

/* ============================
   PROJECT CARDS — STAGGER ON ENTER
   ============================ */
const gridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.project-card');
      cards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(28px)';
        card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
      gridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.projects-grid').forEach(grid => gridObserver.observe(grid));

/* ============================
   ABOUT — CHAT TYPEWRITER SEQUENCE
   ============================ */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function typeText(spanEl, text, speed = 38) {
  return new Promise(resolve => {
    spanEl.classList.add('typing');
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        spanEl.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        spanEl.classList.remove('typing');
        resolve();
      }
    };
    tick();
  });
}

function showTypingIndicator(parentRow) {
  const indicator = document.createElement('div');
  indicator.className = 'bubble bubble-a';
  indicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  parentRow.querySelector('.bubble-avatar').insertAdjacentElement('afterend', indicator);
  return indicator;
}

async function runChatSequence() {
  const rows = document.querySelectorAll('#chatStream .chat-bubble-row');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const text = row.dataset.text;
    const isAnswer = row.classList.contains('row-answer');
    const spanEl = row.querySelector('.bubble-text');

    // Slide row in
    row.classList.add('visible');

    if (isAnswer) {
      // Show typing dots briefly before answer
      const indicator = showTypingIndicator(row);
      await sleep(900);
      indicator.remove();
    }

    // Type the text
    await typeText(spanEl, text, isAnswer ? 30 : 42);

    // Pause between messages
    await sleep(isAnswer ? 480 : 300);
  }
}

// Trigger sequence when About section enters view (only once)
const chatStream = document.getElementById('chatStream');
if (chatStream) {
  let chatPlayed = false;
  const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !chatPlayed) {
        chatPlayed = true;
        chatObserver.disconnect();
        runChatSequence();
      }
    });
  }, { threshold: 0.25 });
  chatObserver.observe(chatStream);
}

/* ============================
   ABOUT — EXPANDABLE Q&A
   ============================ */
/* ============================
   WORLD 01 — CHAR MOUNTAIN CANVAS
   ============================ */
(function initAiCanvas() {
  const canvas = document.getElementById('aiCharCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── 字符集：偏向数字/符号，减少字母占比，更「数据」 ── */
  const CHARS = '01010110100111001111000110101001010110110100110100110101';
  const CHARS2 = '{}[]<>|/\\;:.,?!@#$%^&*+-=~`';
  const ALL_CHARS = CHARS + CHARS2;

  /* ── 布局参数 ── */
  const CELL_W   = 10;   // 字符格宽
  const CELL_H   = 15;   // 字符格高
  const FONT_SZ  = 10;

  /* ── 整体亮度上限（字符更明显）── */
  const MAX_ALPHA_EDGE  = 0.82;  // 山脊边缘
  const MAX_ALPHA_BODY  = 0.48;  // 山体内部
  const MAX_ALPHA_FAR   = 0.28;  // 远景

  /* ── 平滑噪声 ── */
  function hash(n) { const x = Math.sin(n + 1.0) * 43758.5453; return x - Math.floor(x); }
  function smoothNoise(x) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(i) + (hash(i + 1) - hash(i)) * u;
  }
  function fbm(x, oct) {
    let v = 0, a = 1, s = 0;
    for (let o = 0; o < oct; o++) {
      v += smoothNoise(x * Math.pow(2, o)) * a;
      s += a; a *= 0.55;
    }
    return v / s;
  }

  let W, H, cols, rows, t = 0;
  /* 每格存：字符 + 各自独立的闪烁相位 */
  let cells = [];  // cells[c][r] = { ch, phase, freq }

  let rafId = null, isVisible = false;

  function resize() {
    W = canvas.parentElement.offsetWidth;
    H = canvas.parentElement.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
    cols = Math.ceil(W / CELL_W) + 1;
    rows = Math.ceil(H / CELL_H) + 1;
    cells = [];
    for (let c = 0; c < cols; c++) {
      cells[c] = [];
      for (let r = 0; r < rows; r++) {
        cells[c][r] = {
          ch:    ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)],
          phase: Math.random() * Math.PI * 2,   // 独立闪烁起始相位
          freq:  0.6 + Math.random() * 1.4,     // 闪烁快慢（Hz 感）
          flip:  Math.random() < 0.003           // 极少数格子会高频翻转
        };
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.font = `${FONT_SZ}px "Courier New", monospace`;

    /* 全局呼吸：用 sin 缓慢抬高/压低整条山脊 */
    const breath = Math.sin(t * 0.28) * 0.06;   // ±6% 高度缓动

    for (let c = 0; c < cols; c++) {
      const nx = c / (cols - 1);

      /* 三层山脊，通过 noise 偏移量 + 时间速度差异形成视差 */
      const r1 = fbm(nx * 2.8 + t * 0.04,  4);  // 前景：最突出
      const r2 = fbm(nx * 1.8 + t * 0.022 + 30, 3);  // 中景
      const r3 = fbm(nx * 1.1 + t * 0.01  + 70, 2);  // 远景

      /* 山峰高度（归一化 0~1，越大越高，整体抬升）+ 全局呼吸 */
      const h1 = Math.min(1, r1 * 0.55 + 0.40 + breath);
      const h2 = Math.min(1, r2 * 0.38 + 0.28 + breath * 0.6);
      const h3 = Math.min(1, r3 * 0.24 + 0.14 + breath * 0.3);

      /* 对应屏幕 y 坐标（从底部算起）*/
      const y1 = Math.round((1 - h1) * H);
      const y2 = Math.round((1 - h2) * H);
      const y3 = Math.round((1 - h3) * H);

      const x = c * CELL_W;

      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H;
        const cellY = y + CELL_H;  // 基线

        const cell = cells[c][r];

        /* 偶尔换字符（越靠近山脊边缘换得越慢，远处山体反而频繁——更有流动感） */
        const changeProb = (r * CELL_H < y1) ? 0.002 : 0.006;
        if (Math.random() < changeProb || cell.flip) {
          cell.ch = ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)];
        }

        /* 独立闪烁：每格有自己的 sin 相位 */
        const flicker = (Math.sin(t * cell.freq + cell.phase) + 1) * 0.5;  // 0~1

        /* 判断层级，计算基础 alpha */
        let baseAlpha = 0;
        const py = r * CELL_H;

        if (py >= y1) {
          /* 前景山体内部：越往下越暗 */
          const depth = (py - y1) / Math.max(1, H - y1);
          baseAlpha = MAX_ALPHA_BODY * (1 - depth * 0.7);
        } else if (py >= y2) {
          /* 中景 */
          const depth = (py - y2) / Math.max(1, y1 - y2);
          baseAlpha = MAX_ALPHA_FAR * (1 - depth * 0.5) * 0.7;
        } else if (py >= y3) {
          /* 远景 */
          const depth = (py - y3) / Math.max(1, y2 - y3);
          baseAlpha = MAX_ALPHA_FAR * (1 - depth) * 0.4;
        }

        /* 山脊边缘行：额外高亮 */
        const onEdge1 = Math.abs(py - y1) < CELL_H;
        const onEdge2 = Math.abs(py - y2) < CELL_H;
        const onEdge3 = Math.abs(py - y3) < CELL_H;

        let edgeBoost = 0;
        if (onEdge1) edgeBoost = MAX_ALPHA_EDGE;
        else if (onEdge2) edgeBoost = MAX_ALPHA_EDGE * 0.35;
        else if (onEdge3) edgeBoost = MAX_ALPHA_EDGE * 0.15;

        /* 最终 alpha = 基础 + 边缘高亮 + 闪烁调制 */
        let alpha = (baseAlpha + edgeBoost) * (0.55 + flicker * 0.45);

        if (alpha < 0.012) continue;
        const alphaClamped = Math.min(alpha, onEdge1 ? MAX_ALPHA_EDGE : 0.50);

        /* 颜色：带淡绿调，与网站 sage 主色呼应（R偏暗，G偏亮，B偏暗） */
        const lum = onEdge1 ? 100 : onEdge2 ? 75 : 55;
        ctx.fillStyle = `rgba(${lum-8},${lum+8},${lum-12},${alphaClamped.toFixed(3)})`;
        ctx.fillText(cell.ch, x, cellY);
      }
    }
  }

  function loop() {
    if (!isVisible) return;
    t += 0.016;   // ~60fps 时约等于真实秒数，让动画速度与帧率解耦
    draw();
    rafId = requestAnimationFrame(loop);
  }

  const aiSection = document.getElementById('ai-world');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      isVisible = e.isIntersecting;
      if (isVisible && !rafId) loop();
      if (!isVisible) { cancelAnimationFrame(rafId); rafId = null; }
    });
  }, { threshold: 0.05 });
  if (aiSection) obs.observe(aiSection);

  resize();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rafId); rafId = null;
    resize();
    if (isVisible) loop();
  });
})();

/* ============================
   ABOUT — EXPANDABLE Q&A
   ============================ */
document.querySelectorAll('.qa-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.qa-q').forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.nextElementSibling.classList.remove('open');
      }
    });

    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      answer.classList.remove('open');
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => answer.classList.add('open'));
      });
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
