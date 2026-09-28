export const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>';
export const link = (href, text, style = 'text-link') => `<a class="${style}" href="${href}">${text}${arrow}</a>`;
export const btn = (href, text, secondary = false) => link(href, text, `btn${secondary ? ' secondary' : ''}`);
export const paras = items => items.map(s => `<p>${s}</p>`).join('\n');
export const list = items => `<ul class="content-list">${items.map(s => `<li>${s}</li>`).join('')}</ul>`;
export const section = (title, body, {id = '', tone = '', intro = ''} = {}) => `<section${id ? ` id="${id}"` : ''} class="section ${tone}"><div class="wrap"><h2>${title}</h2>${intro ? `<p class="section-intro">${intro}</p>` : ''}${body}</div></section>`;
export const split = (title, body, side) => `<div class="split"><div><h3>${title}</h3>${body}</div><div>${side}</div></div>`;
export const rows = items => `<div class="numbered-rows">${items.map(([title, text], i) => `<article class="numbered-row"><span class="row-number">${String(i + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`;
export const columns = items => `<div class="columns">${items.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`;
export const related = items => `<nav class="related" aria-label="関連ページ">${items.map(([url, title]) => link(url, title)).join('')}</nav>`;
export const page = (title, lead, body, group = 'about', extra = {}) => ({title, lead, body, group, ...extra});

export const services = [
  {url:'sales.html', number:'01', label:'SALES OUTSOURCING', title:'営業代行', text:'新規顧客開拓からアポイント獲得、商談、クロージングまで。企業の営業活動を実行と改善の両面から支援します。', tags:['新規開拓','アポイント獲得','商談・クロージング']},
  {url:'promotion.html', number:'02', label:'SALES PROMOTION', title:'販促支援', text:'量販店や催事会場で、商品・サービスの魅力を届けます。接客、商談、スタッフ育成、現場運営まで支援します。', tags:['量販店','催事会場','販売・現場運営']},
  {url:'systems.html', number:'03', label:'BUSINESS SYSTEMS', title:'システム販売', text:'CRMなど、現場で使える業務管理システムを提案・販売。顧客、案件、売上・入金、タスクを整理します。', tags:['顧客・案件管理','入金管理','業務の見える化']}
];
export const serviceCards = () => `<div class="service-grid">${services.map(s => `<article class="service-card"><div class="service-meta"><span class="service-number">${s.number}</span><span class="service-label">${s.label}</span></div><h3>${s.title}</h3><p>${s.text}</p><ul class="tags">${s.tags.map(t => `<li>${t}</li>`).join('')}</ul>${link(s.url, '詳しく見る')}${s.number === '03' ? '<button class="text-link demo-open" type="button" data-open-demo>CRMの画面イメージを見る'+arrow+'</button>' : ''}</article>`).join('')}</div>`;
export const strengths = [
  ['現場経験','実際の営業・販売で得た知見をもとに、お客様と担当者の双方にとって動きやすい現場を考えます。'],
  ['実行力','方針や提案をまとめるだけでなく、実際の営業活動や現場運営に入り、行動につなげます。'],
  ['スピード','小さく始め、結果を確認しながら改善。状況の変化に合わせて、次の行動を早く決めます。'],
  ['人と仕組み','担当者の力を活かしながら、業務フローや情報共有を整え、続けやすい体制をつくります。'],
  ['数字','活動量と成果を分けて確認し、どこを改善すればよいかを具体的に考えます。']
];
export const values = [
  ['現場から考える','実際の顧客、営業担当者、販売現場から得られる情報を大切にする。'],
  ['まず動く','完璧な計画を待つより、小さく実行し、結果から改善する。'],
  ['数字で向き合う','感覚ではなく、行動と成果を数字で確認する。'],
  ['誠実に積み上げる','短期的な利益より、長期的な信頼を重視する。'],
  ['仕組みにする','個人の能力だけに依存せず、再現できる方法へ変える。']
];
export const cases = [
  {url:'case-promotion.html', label:'販促支援', title:'量販店・催事会場での販売活動を支える', text:'接客から商談、クロージング、現場の振り返りまで。販売現場を動かす支援内容をご紹介します。'},
  {url:'case-sales.html', label:'営業代行', title:'新規顧客獲得に向けた営業活動を整える', text:'ターゲット整理、アプローチ、商談化、進捗共有。新規開拓に必要な実行と改善の流れをご紹介します。'},
  {url:'case-crm.html', label:'システム販売', title:'不動産賃貸仲介の顧客・案件・入金を一元管理', text:'次の対応と入金予定を把握しやすくする、CRMの設計・活用イメージをご紹介します。'}
];
export const caseCards = () => `<div class="case-grid">${cases.map((c, i) => `<article class="case-card"><span class="small-label">${c.label}</span><span class="case-index">${String(i+1).padStart(2,'0')}</span><h3>${c.title}</h3><p>${c.text}</p>${link(c.url, '支援内容を見る')}</article>`).join('')}</div>`;
export const news = [
  {url:'news-renewal.html', date:'2026.09.28', category:'CORPORATE', title:'コーポレートサイトをリニューアルしました'},
  {url:'news-services.html', date:'2026.09.28', category:'SERVICE', title:'営業代行・販促支援・システム販売の詳細ページを公開しました'},
  {url:'news-recruit.html', date:'2026.09.28', category:'RECRUIT', title:'採用情報・募集要項を更新しました'}
];
export const newsRows = () => `<div class="news-list">${news.map(n => `<article class="news-row" data-category="${n.category}"><time datetime="2026-09-28">${n.date}</time><span class="news-category">${n.category}</span>${link(n.url, n.title, 'news-link')}</article>`).join('')}</div>`;
export const faq = [
  ['営業代行はどの工程から依頼できますか？','新規開拓、アポイント獲得、商談、クロージングなどから、必要な工程をご相談いただけます。商材や対象顧客、現在の体制を伺い、支援範囲をご提案します。'],
  ['営業戦略が決まっていなくても相談できますか？','ご相談いただけます。対象顧客、商品の特徴、現在の課題を整理し、実行する業務と確認する指標を一緒に考えます。'],
  ['販促支援はどのような場所に対応しますか？','量販店、商業施設、催事会場などの販売現場を想定しています。会場の所在地、開催日、商材、必要人数を添えてご相談ください。対応可否は案件ごとに確認します。'],
  ['通信以外の商材も相談できますか？','はい。通信関連の販売現場での経験を活かしながら、商材や販売条件に合わせた支援を検討します。専門知識や資格が必要な場合は、要件を確認して対応可否をご案内します。'],
  ['販促スタッフの育成や現場運営も依頼できますか？','接客・提案の進め方、スタッフへの共有、進捗の確認などもご相談いただけます。役割分担と管理範囲は開始前にすり合わせます。'],
  ['CRMでは何を管理できますか？','顧客情報、案件の進捗、次回アクション、担当者、売上・入金予定、必要書類、タスクなどを管理する設計です。提供範囲や機能は、ご提案するシステム・契約によって異なります。'],
  ['CRMの画面を見られますか？','システム販売ページの「CRMの画面イメージを見る」ボタンから、ダッシュボードと商材・ステータス設定の画像をご覧いただけます。操作できるデモではなく、画面イメージです。'],
  ['現在使っている管理方法に合わせて導入できますか？','現在の表計算シート、案件の流れ、管理項目を伺い、導入方法を検討します。データ移行、外部連携、追加開発の可否と費用は個別に確認します。'],
  ['費用や契約期間を教えてください。','業務範囲、稼働人数、期間、システムの要件などによって異なります。ヒアリング後に条件をご提示し、合意のうえで開始します。掲載のない一律料金や最低契約期間は設けて表示していません。'],
  ['成果報酬で依頼できますか？','案件によって検討できます。成果の定義、対象業務、報告方法、報酬発生条件を確認します。すべての案件が完全成果報酬になるわけではありません。'],
  ['対応エリアはどこですか？','神奈川県平塚市を拠点としています。現地での販促支援は場所や日程、営業代行は実施方法によって対応可否が変わりますので、個別にご相談ください。'],
  ['未経験でも採用に応募できますか？','営業の基礎を学びたい方も歓迎しています。商材理解、顧客対応、提案などを実務で身につけ、習熟度に合わせて役割を広げます。'],
  ['業務委託はリモートで働けますか？','完全成果報酬の営業案件ではフルリモートが可能です。日給制の販促案件などは量販店・催事会場での稼働が中心で、すべての案件がリモート対応ではありません。'],
  ['パートナーとして連携できますか？','営業会社、販促会社、個人事業主、システム会社、案件をお持ちの企業などからのご相談を受け付けています。対応できる業務、地域、体制をお知らせください。'],
  ['問い合わせフォームから直接送信されますか？','入力内容を確認後、「メールアプリを開く」を押すと、ceo@cdm-lifesupport.com 宛てのメールを作成します。最後にメールアプリで送信してください。公式LINEからのご相談も可能です。']
];
export const faqItems = (items = faq) => `<div class="faq-list">${items.map(([q,a]) => `<details><summary>${q}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l7 7 7-7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></summary><p>${a}</p></details>`).join('')}</div>`;
export const numbers = () => `<div class="numbers"><div><strong>2025<span>年</span></strong><p>2月設立</p></div><div><strong>3<span>領域</span></strong><p>営業代行・販促支援・システム販売</p></div></div>`;
export const messageExcerpt = `<div class="message-grid"><figure><img src="assets/ceo-iwao.jpg" width="800" height="1200" loading="lazy" alt="合同会社CDM 代表社員 岩男大輝"><figcaption>合同会社CDM 代表社員<br><strong>岩男 大輝</strong></figcaption></figure><div><h3>小さな積み重ねが、<br>大きな成果をつくる。</h3>${paras(['一件電話すること。一人のお客様と向き合うこと。昨日より一つ改善すること。営業の成果は、こうした丁寧な積み重ねから生まれます。','私たちはまだ若い会社です。だからこそ、速く動き、一つひとつの仕事に責任を持つ。いただいた仕事に、誠実に結果で応える会社であり続けます。'])}${link('message.html','代表メッセージを読む')}</div></div>`;
export const flow = [
  ['お問い合わせ','相談したい業務や課題を、フォーム・メール・公式LINEでお知らせください。'],
  ['ヒアリング','商材、対象顧客、現在の体制、希望する時期、目標を確認します。'],
  ['ご提案・お見積もり','実施範囲、進め方、体制、費用、確認する指標をご提案します。'],
  ['条件確認・ご契約','業務範囲、報酬条件、情報の取り扱い、報告方法などをすり合わせます。'],
  ['支援開始','必要な準備を整え、合意した業務を開始します。実施状況を共有します。'],
  ['振り返り・改善','活動と結果を確認し、課題を整理。次の行動や運用を改善します。']
];
