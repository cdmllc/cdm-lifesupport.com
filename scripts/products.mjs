import {arrow, btn, link, list, page, paras, related, rows, section} from './ui.mjs';

const consult = service => `contact.html?type=${encodeURIComponent('事業のご相談')}&service=${encodeURIComponent(service)}`;

// Official-site prices are before tax. All product leads stay on this site.
export const products = [
  {
    key:'crm', number:'01', label:'CUSTOMER MANAGEMENT', name:'顧客・案件管理CRM', url:'systems.html',
    summary:'顧客、案件、次回対応、入金予定を一つに整理。利用方法と環境を確認して導入を検討します。',
    price:'初期50,000円＋月額5,000円／買い切り150,000円', tax:'いずれも税別。詳細はシステム販売ページへ。'
  },
  {
    key:'website', number:'02', label:'WEBSITE', name:'ホームページ制作', url:'website.html',
    summary:'会社紹介とサービス案内を、スマートフォンでも読みやすい3ページまでのサイトに。',
    price:'50,000円', tax:'税別／税込55,000円',
    lead:'個人事業主・小規模法人向け。会社紹介とサービス案内を、スマートフォンでも見やすいホームページに整理します。',
    intro:'「事業を説明できるサイトがほしい」「名刺に載せるページがほしい」という方へ。いただいた原稿と素材をもとに、訪問した人が内容と問い合わせ先を理解しやすい構成にします。',
    scope:['トップ・サービス紹介・会社概要など、日本語で合計3ページまで','1デザイン案、パソコン・スマートフォン対応','ご提供原稿の見出し整理と簡単な文章調整','ページタイトル・説明文・見出し・画像代替文の基本設定','メールや既存の予約・問い合わせ先への導線','合意した構成内の修正2回'],
    deliverables:['HTML/CSS/JavaScriptによる静的サイト一式と使用素材','簡易更新手順書','事前に合意した、対応可能な公開先1か所への設置支援'],
    exclusions:['追加ページ、全面的な構成変更、長文原稿の新規作成','独自フォーム、会員登録、決済・予約機能、CMS・WordPress、翻訳','ドメイン・サーバー・有料素材の実費、納品後の継続保守'],
    prep:['業種・屋号とサイトの目的','希望するページと掲載内容、参考イメージ','使用権のある原稿・ロゴ・写真の有無','公開先の有無と希望時期'],
    caution:'掲載する会社情報・料金などの事実は、お客様に最終確認をお願いします。検索順位や問い合わせ件数を保証するものではありません。'
  },
  {
    key:'lp', number:'03', label:'LANDING PAGE', name:'LP制作', url:'lp.html',
    summary:'商品・サービスの説明から問い合わせ先まで、1ページにまとめたLPを制作します。',
    price:'30,000円', tax:'税別／税込33,000円',
    lead:'商品やサービスの魅力と、問い合わせ・申込みまでの流れを、スマートフォン対応の1ページにまとめます。',
    intro:'新サービスの紹介、資料請求、イベント案内などに。誰に何を伝え、次に何をしてほしいかを整理してから制作します。',
    scope:['日本語のLP1ページ・8セクションまで','1デザイン案、パソコン・スマートフォン対応','ご提供情報をもとにした見出し・短い説明文の調整','既存の申込み先・問い合わせ先へのボタン設置','ページタイトル・説明文・見出しの基本設定','合意した構成内の修正2回'],
    deliverables:['HTML/CSS/JavaScriptによる静的LP一式と使用素材','簡単な編集手順','事前に合意した、対応可能な公開先1か所への設置支援'],
    exclusions:['9セクション目以降、追加ページ、長文セールスコピーの新規作成','撮影・取材、広告運用、アクセス解析運用、A/Bテスト','独自フォーム、決済・予約機能、CMS、サーバー・ドメイン等の実費'],
    prep:['商品・サービスと想定するお客様','LPの目的、掲載したい情報と申込み先','参考イメージ、原稿・画像の有無','公開先の有無と希望時期'],
    caution:'効果・実績・比較表現は確認できる資料に基づいて掲載します。売上・成約率などの成果を保証するものではありません。'
  },
  {
    key:'excel', number:'04', label:'EXCEL WORKFLOW', name:'Excel管理表作成', url:'excel.html',
    summary:'顧客・案件・タスクなど、今の業務に合わせた入力表と集計表を作成します。',
    price:'10,000円', tax:'税別／税込11,000円',
    lead:'顧客・案件・タスクなどを見える化。入力する人と確認する人の双方が使いやすいExcel管理表を作成します。',
    intro:'既存のテンプレートが業務に合わない、担当者ごとに入力方法が違う、件数や金額を集計しづらい。そんな日々の管理を、一つのファイルに整理します。',
    scope:['1業務を対象としたExcelファイル1点','入力表・集計表・使い方など、合計3シートまで','管理項目15項目まで','選択リスト・入力ルール・条件付き書式と基本集計','グラフ2点まで、架空データでの入力・集計確認','合意した要件内の修正2回'],
    deliverables:['編集可能なxlsxファイル','ファイル内の簡易操作説明','合意した計算例での動作確認'],
    exclusions:['VBA・マクロ、外部APIや複数ファイルとの連携','大量データの手作業移行、自動メール送信、継続的な入力代行','会計・税務判断、リアルタイムの複数人同時編集'],
    prep:['管理したい業務と入力項目','確認したい件数・金額などの集計','利用するExcelのバージョンとOS','個人情報を除いたサンプルの有無と希望時期'],
    caution:'実在顧客の個人情報は初回相談に不要です。Googleスプレッドシートや古いExcelでは動作差があるため、利用環境を確認してから仕様を決めます。'
  },
  {
    key:'manual', number:'05', label:'OPERATIONS GUIDE', name:'業務マニュアル作成', url:'manual.html',
    summary:'メモや既存資料を、引き継ぎや新人説明に使える手順書へ整理します。',
    price:'10,000円', tax:'税別／税込11,000円',
    lead:'散らばった業務メモや既存資料を、担当者が順番に読んで使える業務マニュアルへ整理します。',
    intro:'「説明が担当者任せになっている」「同じ質問が繰り返される」。そんな業務を、目的・準備物・手順・確認事項が分かる形にまとめます。',
    scope:['1業務を対象としたA4換算10ページまでの手順書','元資料は合計5,000字または10ページ程度まで','目次、目的、担当、準備物、手順、確認事項の整理','ご提供画像10点までの配置とチェックリスト1点','合意した内容の修正2回'],
    deliverables:['編集可能なWordファイル（docx）','確認・配布用のPDF','本文に含むチェックリスト'],
    exclusions:['現地取材や実作業の代行、動画撮影、長時間音声の文字起こし','外国語翻訳、法務・医療・安全に関する専門監修','新しい業務の追加、元資料やページ数の大幅な増加'],
    prep:['対象業務と読む人、利用目的','元資料の種類と分量、必要ページ数','掲載する画像の利用権限','機密情報を除いた資料と希望時期'],
    caution:'資料から確認できない手順は推測で補いません。実際の業務との整合は、お客様の確認を経て仕上げます。'
  }
];

export const productRail = () => `<div class="product-rail">${products.map(item => `<a href="${item.url}"><span>${item.number}</span><strong>${item.name}</strong>${arrow}</a>`).join('')}</div>${link('products.html','商品・料金をすべて見る')}`;

export const productList = () => `<div class="product-list">${products.map(item => `<article class="product-row"><div class="product-row-id"><span>${item.number}</span><span>${item.label}</span></div><div class="product-row-main"><h3><a href="${item.url}">${item.name}</a></h3><p>${item.summary}</p></div><div class="product-row-price"><strong>${item.price}</strong><span>${item.tax}</span>${link(item.url,'詳しく見る')}</div></article>`).join('')}</div>`;

const detailPage = item => page(item.name,item.lead,
  section('このサービスで整えること',`<div class="prose">${paras([item.intro])}</div>`)+
  section('料金と基本範囲',`<div class="product-plan"><div class="product-plan-price"><span class="small-label">基本料金</span><strong>${item.price}</strong><span>${item.tax}</span></div><div><h3>基本プランに含む内容</h3>${list(item.scope)}</div></div><p class="note">作業範囲・素材・公開環境などを購入前に確認し、正式な費用と納期をご案内します。範囲外の作業は着手前に別途お見積もりします。</p>`,{tone:'soft'})+
  section('納品物と対象外',`<div class="product-detail-grid"><div><h3>納品物</h3>${list(item.deliverables)}</div><div><h3>基本料金に含まない内容</h3>${list(item.exclusions)}</div></div><p class="note">${item.caution}</p>`)+
  section('ご相談から納品まで',rows([['事前相談',`${item.prep.join('、')}を伺います。`],['範囲と条件の確認','仕様、作業範囲、費用、納期、納品方法をすり合わせます。'],['制作・確認','合意した内容に沿って制作し、表示・動作・記載内容を確認します。'],['修正・納品','合意した範囲内で修正し、最終確認後に納品します。']]),{tone:'soft'})+
  section('まずは、内容をお聞かせください。',`<div class="product-contact"><div><p>公式サイトのお問い合わせフォームから、${item.prep.join('、')}を分かる範囲でお知らせください。商品名を選んだ状態でフォームを開きます。</p><p>ご相談内容を確認し、対応範囲・費用・納期をご案内します。条件にご納得いただいてから制作を進めます。</p></div><div class="product-contact-actions">${btn(consult(item.name),`${item.name}を問い合わせる`)}</div></div><p class="note">制作にはAIを補助的に活用します。納品内容を確認し、掲載情報や業務上の事実はお客様にも最終確認をお願いします。</p>${related([['products.html','商品・料金一覧'],['flow.html','ご相談の流れ']])}`),
  'products');

export const productPages = Object.fromEntries(products.filter(item => item.key !== 'crm').map(item => [item.url,detailPage(item)]));
