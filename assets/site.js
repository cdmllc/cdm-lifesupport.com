document.documentElement.classList.add('js-ready');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Full-screen menu (all screen sizes)
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const header = document.querySelector('.site-header');
const setMenu = open => {
  if (!menu || !nav) return;
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  menu.querySelector('.menu-label').textContent = open ? 'CLOSE' : 'MENU';
  if (open) setTimeout(() => nav.querySelector('a')?.focus({preventScroll:true}), 350);
};
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (menu?.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') {setMenu(false); menu.focus(); return;}
  if (event.key !== 'Tab') return;
  // Keep keyboard focus inside the open menu and its toggle.
  const items = [menu, ...nav.querySelectorAll('a')];
  const index = items.indexOf(document.activeElement);
  if (event.shiftKey && index <= 0) {event.preventDefault(); items[items.length - 1].focus();}
  else if (!event.shiftKey && index === items.length - 1) {event.preventDefault(); items[0].focus();}
});

// Kinetic headings: split text into characters, keeping the readable text for assistive tech.
const splitChars = (el, start = 0) => {
  let i = start;
  const walk = node => [...node.childNodes].forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of child.textContent) {
        if (!ch.trim()) {frag.append(ch); continue;}
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--ci', i++);
        span.textContent = ch;
        frag.append(span);
      }
      child.replaceWith(frag);
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
      // Gradient text must stay one box so its background clips across all characters.
      if (child.classList.contains('grad')) {
        const wrap = document.createElement('span');
        wrap.className = 'char';
        wrap.style.setProperty('--ci', i);
        i += child.textContent.length;
        child.replaceWith(wrap);
        wrap.append(child);
      } else walk(child);
    }
  });
  walk(el);
  return i;
};
document.querySelectorAll('[data-split]').forEach(el => {
  el.setAttribute('aria-label', el.textContent.trim());
  const inner = document.createElement('span');
  inner.setAttribute('aria-hidden', 'true');
  inner.append(...el.childNodes);
  el.append(inner);
  splitChars(inner);
});
document.querySelectorAll('[data-scrub]').forEach(el => {
  el.setAttribute('aria-label', el.textContent.trim());
  const inner = document.createElement('span');
  inner.setAttribute('aria-hidden', 'true');
  inner.append(...el.childNodes);
  el.append(inner);
  splitChars(inner);
});

// Scroll reveal
const revealTargets = '.section h2,.section-intro,.service-card,.case-card,.product-rail,.product-row,.numbered-row,.columns article,.crm-plans article,.job-grid article,.news-row,.message-grid figure,.message-grid>div,.recruit-banner,.split>div,.prose,.faq-list,.company-data,.timeline li,.flow-step,.numbers>div,.product-plan,.product-detail-grid>div,.product-contact,.contact-band .wrap,.type-grid,.form-layout,.no-sales-notice';
document.querySelectorAll(revealTargets).forEach(el => {
  if (el.closest('.hero') || el.classList.contains('rv')) return;
  el.classList.add('rv');
  const siblings = [...el.parentElement.children].filter(s => s.matches(revealTargets));
  const order = siblings.indexOf(el);
  if (order > 0 && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(order, 6) * 0.08}s`);
});
const counted = new WeakSet();
const countUp = el => {
  if (counted.has(el)) return;
  counted.add(el);
  const target = Number(el.dataset.count);
  if (reduceMotion) {el.textContent = target; return;}
  const from = target > 1000 ? target - 60 : 0;
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / 1600, 1);
    el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 4)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const io = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const el = entry.target;
  el.classList.add('in');
  if (el.matches('[data-split]')) el.classList.add('is-split-in');
  el.querySelectorAll('[data-count]').forEach(countUp);
  io.unobserve(el);
}), {rootMargin:'0px 0px -12% 0px', threshold:0.08});
document.querySelectorAll('.rv,[data-split],[data-io],.fact,.numbers').forEach(el => io.observe(el));
// Headings already on screen start right away (with a short pause for the hero).
document.querySelectorAll('.hero [data-split],.page-hero [data-split]').forEach(el => {
  el.style.setProperty('--split-delay', '150ms');
  requestAnimationFrame(() => el.classList.add('is-split-in'));
});

// Word rotator
document.querySelectorAll('[data-rotator]').forEach(rotator => {
  const words = [...rotator.children];
  rotator.setAttribute('aria-hidden', 'true');
  rotator.parentElement.setAttribute('aria-label', rotator.parentElement.textContent.replace(/。(?=.)/g, '。 '));
  if (reduceMotion || words.length < 2) return;
  let current = 0;
  setInterval(() => {
    const prev = words[current];
    current = (current + 1) % words.length;
    prev.classList.remove('is-in');
    prev.classList.add('is-out');
    words[current].classList.remove('is-out');
    words[current].classList.add('is-in');
    setTimeout(() => prev.classList.remove('is-out'), 900);
  }, 2600);
});

// Marquees: duplicate content for a seamless loop; scrolling speeds them up.
const marquees = [...document.querySelectorAll('[data-marquee]')].map(track => {
  const original = track.innerHTML;
  track.innerHTML = original + original;
  return {track, dir:Number(track.dataset.marquee) || 1, x:0};
});
let scrollVelocity = 0;
let lastY = window.scrollY;

// Scroll-linked effects
const progress = document.querySelector('.scroll-progress');
const backTop = document.querySelector('.back-top');
const scrubTexts = [...document.querySelectorAll('[data-scrub]')].map(el => ({el, chars:[...el.querySelectorAll('.char')]}));
const flows = [...document.querySelectorAll('[data-flow]')].map(el => ({el, steps:[...el.querySelectorAll('.flow-step')]}));
const heroGhost = document.querySelector('.hero-ghost');
const recruit = document.querySelector('.recruit-banner');
const portrait = document.querySelector('.message-grid figure img');
let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header?.classList.toggle('is-scrolled', y > 20);
  if (!document.body.classList.contains('menu-open')) header?.classList.toggle('is-hidden', y > lastY && y > 400);
  backTop?.classList.toggle('is-visible', y > vh);
  scrollVelocity += (y - lastY) * 0.08;
  lastY = y;
  scrubTexts.forEach(({el, chars}) => {
    const rect = el.getBoundingClientRect();
    const p = Math.min(Math.max((vh * 0.85 - rect.top) / (rect.height + vh * 0.45), 0), 1);
    const lit = Math.round(p * chars.length);
    chars.forEach((c, i) => c.classList.toggle('lit', i < lit));
  });
  flows.forEach(({el, steps}) => {
    const rect = el.getBoundingClientRect();
    const p = Math.min(Math.max((vh * 0.75 - rect.top) / (rect.height * 0.8), 0), 1);
    el.style.setProperty('--p', p.toFixed(3));
    steps.forEach((s, i) => s.classList.toggle('lit', p >= i / steps.length + 0.02 || (p === 1)));
  });
  if (!reduceMotion) {
    if (heroGhost) heroGhost.style.setProperty('--ghost-y', `${y * 0.25}px`);
    if (recruit) {
      const rect = recruit.getBoundingClientRect();
      recruit.style.setProperty('--join-x', `${(rect.top - vh / 2) * 0.15}px`);
    }
    if (portrait) {
      const rect = portrait.getBoundingClientRect();
      const p = Math.min(Math.max(1 - rect.top / vh, 0), 1.6);
      portrait.style.setProperty('--img-scale', (1.14 - p * 0.08).toFixed(3));
    }
  }
  ticking = false;
};
window.addEventListener('scroll', () => {if (!ticking) {ticking = true; requestAnimationFrame(onScroll);}}, {passive:true});
window.addEventListener('resize', onScroll);
onScroll();

if (!reduceMotion && marquees.length) {
  const loop = () => {
    scrollVelocity *= 0.92;
    marquees.forEach(m => {
      const half = m.track.scrollWidth / 2;
      m.x -= m.dir * (0.6 + Math.min(Math.abs(scrollVelocity), 14));
      if (m.x <= -half) m.x += half;
      if (m.x > 0) m.x -= half;
      m.track.style.transform = `translate3d(${m.x}px,0,0) skewX(${Math.max(Math.min(-scrollVelocity * m.dir, 8), -8)}deg)`;
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// Pointer effects (desktop only)
if (finePointer && !reduceMotion) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', event => {
    tx = event.clientX; ty = event.clientY;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-hover', Boolean(event.target.closest('a,button,summary,label,.cycle-node')));
  }, {passive:true});
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  const follow = () => {
    cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
    cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);

  const hero = document.querySelector('[data-hero]');
  hero?.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    hero.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  });

  document.querySelectorAll('.service-card,.case-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
    });
    card.addEventListener('pointerleave', () => {card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg');});
  });

  document.querySelectorAll('.btn,.nav-cta,.menu-toggle').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.translate = `${(event.clientX - rect.left - rect.width / 2) * 0.18}px ${(event.clientY - rect.top - rect.height / 2) * 0.3}px`;
    });
    button.addEventListener('pointerleave', () => {button.style.translate = '';});
  });
}

// Page transition on internal navigation
if (!reduceMotion) {
  const veil = document.createElement('div');
  veil.className = 'page-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.append(veil);
  document.addEventListener('click', event => {
    const a = event.target.closest('a[href]');
    if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
    event.preventDefault();
    veil.classList.add('is-leaving');
    setTimeout(() => {location.href = url.href;}, 420);
  });
  window.addEventListener('pageshow', event => {if (event.persisted) veil.classList.remove('is-leaving');});
}

const demo = document.querySelector('#crm-demo');
if (demo) {
  let opener;
  document.querySelectorAll('[data-open-demo]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    demo.showModal();
    demo.scrollTop = 0;
    document.body.classList.add('modal-open');
  }));
  demo.querySelector('[data-close-demo]').addEventListener('click', () => demo.close());
  demo.addEventListener('click', event => {
    const rect = demo.getBoundingClientRect();
    if (event.target === demo && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) demo.close();
  });
  demo.addEventListener('close', () => {document.body.classList.remove('modal-open'); opener?.focus();});
}

const filters = document.querySelectorAll('[data-news-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.newsFilter;
  filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let visible = 0;
  document.querySelectorAll('[data-category]').forEach(row => {
    row.hidden = category !== 'ALL' && row.dataset.category !== category;
    if (!row.hidden) visible++;
  });
  document.querySelector('#news-empty').hidden = visible > 0;
  document.querySelector('#news-status').textContent = `${visible}件のお知らせを表示しています。`;
}));

const form = document.querySelector('#contact-form');
if (form) {
  const types = ['事業のご相談','採用について','パートナー連携','その他'];
  const query = new URLSearchParams(location.search);
  const category = query.get('type');
  const service = query.get('service');
  if (types.includes(category)) form.elements.category.value = category;
  if ([...form.elements.service.options].some(option => option.value === service)) form.elements.service.value = service;
  document.querySelectorAll('[data-contact-type]').forEach(a => a.addEventListener('click', () => {
    form.elements.category.value = a.dataset.contactType;
    if (a.dataset.contactType !== '事業のご相談') form.elements.service.value = '';
    clearReview();
  }));
  form.elements.category.addEventListener('change', () => {
    if (form.elements.category.value !== '事業のご相談') form.elements.service.value = '';
  });
  const review = document.querySelector('#mail-review');
  const preview = document.querySelector('#mail-preview');
  const mailLink = document.querySelector('#mail-link');
  const status = document.querySelector('#copy-status');
  const clearReview = () => {review.hidden = true; status.textContent = ''; mailLink.removeAttribute('href');};
  form.addEventListener('input', clearReview);
  form.addEventListener('change', clearReview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const clean = key => String(data.get(key) || '').trim();
    const name = clean('name');
    const email = clean('email');
    const message = clean('message');
    if (!name || !email || !message) {
      const input = !name ? form.elements.name : !email ? form.elements.email : form.elements.message;
      input.setCustomValidity('空白だけではなく、内容を入力してください。');
      input.reportValidity();
      input.addEventListener('input', () => input.setCustomValidity(''), {once:true});
      return;
    }
    const chosenService = clean('service');
    const subject = `【CDMお問い合わせ】${clean('category')}${chosenService ? `／${chosenService}` : ''}／${name.replace(/[\r\n]/g,' ')}`;
    const body = `合同会社CDM ご担当者様\n\n以下の内容で問い合わせいたします。\n\nお問い合わせ種別：${clean('category')}\nご相談サービス：${chosenService || '未指定'}\n会社名：${clean('company') || '未記入'}\nお名前：${name}\nメールアドレス：${email}\n電話番号：${clean('phone') || '未記入'}\n\nお問い合わせ内容：\n${message}\n\nプライバシーポリシーに同意しました。`;
    preview.textContent = `宛先：ceo@cdm-lifesupport.com\n件名：${subject}\n\n${body}`;
    mailLink.href = `mailto:ceo@cdm-lifesupport.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    review.hidden = false;
    review.scrollIntoView({behavior:reduceMotion?'instant':'smooth', block:'start'});
    review.focus({preventScroll:true});
  });
  document.querySelector('#edit-mail').addEventListener('click', () => {clearReview(); form.elements.name.focus();});
  document.querySelector('#copy-mail').addEventListener('click', async () => {
    try {await navigator.clipboard.writeText(preview.textContent); status.textContent = '宛先・件名・本文をコピーしました。メールアプリに貼り付けて送信してください。';}
    catch {status.textContent = 'コピーできませんでした。上の宛先・件名・本文を選択して、ご利用のメールアプリに貼り付けてください。';}
  });
  // Only enable editing once the handler preventing a normal form submission is ready.
  form.querySelector('fieldset').disabled = false;
}
