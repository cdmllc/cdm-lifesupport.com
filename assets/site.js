document.documentElement.classList.add('js-ready');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const setMenu = open => {
  nav?.classList.toggle('is-open', open);
  menu?.setAttribute('aria-expanded', String(open));
  const label = menu?.querySelector('span');
  if (label) label.textContent = open ? '閉じる' : 'メニュー';
};
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {setMenu(false); menu.focus();}
});
window.matchMedia('(min-width: 961px)').addEventListener('change', () => setMenu(false));

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
  const category = new URLSearchParams(location.search).get('type');
  if (types.includes(category)) form.elements.category.value = category;
  document.querySelectorAll('[data-contact-type]').forEach(a => a.addEventListener('click', () => {
    form.elements.category.value = a.dataset.contactType;
    clearReview();
  }));
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
    const subject = `【CDMお問い合わせ】${clean('category')}／${name.replace(/[\r\n]/g,' ')}`;
    const body = `合同会社CDM ご担当者様\n\n以下の内容で問い合わせいたします。\n\nお問い合わせ種別：${clean('category')}\n会社名：${clean('company') || '未記入'}\nお名前：${name}\nメールアドレス：${email}\n電話番号：${clean('phone') || '未記入'}\n\nお問い合わせ内容：\n${message}\n\nプライバシーポリシーに同意しました。`;
    preview.textContent = `宛先：ceo@cdm-lifesupport.com\n件名：${subject}\n\n${body}`;
    mailLink.href = `mailto:ceo@cdm-lifesupport.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    review.hidden = false;
    review.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth', block:'start'});
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
