import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {products} from './products.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const stylesheet=await readFile(resolve(root,'assets/site.css'),'utf8');
const ink=stylesheet.match(/--ink:\s*(#[0-9a-f]{6})/i)[1];
assert(!/#07573c|#1766da|#0b4fab/i.test(stylesheet),'legacy green and vivid blue are not mixed into the new palette');
const files=(await readdir(root)).filter(f=>f.endsWith('.html'));
const documents=new Map(await Promise.all(files.map(async f=>[f,await readFile(resolve(root,f),'utf8')])));
assert.equal(files.length,36,'35 content pages and 404');
const ids=new Map();
const titles=new Set();
const destinations=new Map();
let checkedLinks=0;
for(const [file,html] of documents){
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${file}: exactly one h1`);
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title),`${file}: unique title`); titles.add(title);
  assert(/<meta name="description" content="[^"]+"/.test(html),`${file}: description`);
  assert(/<meta name="viewport"/.test(html),`${file}: viewport`);
  assert(/<link rel="canonical"/.test(html),`${file}: canonical`);
  assert(html.includes(`<meta name="theme-color" content="${ink}">`),`${file}: theme matches the shared palette`);
  assert(/href="assets\/site\.css\?v=[0-9a-f]+"/.test(html),`${file}: shared, versioned stylesheet`);
  const pageIds=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(pageIds.length,new Set(pageIds).size,`${file}: unique ids`); ids.set(file,new Set(pageIds));
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert(schema.some(s=>s['@type']==='Organization'),`${file}: organization schema`);
  for(const match of html.matchAll(/\bsrc="([^"]+)"/g)) await access(resolve(root,match[1].split('?')[0]));
  destinations.set(file,[]);
}
for(const [file,html] of documents){
  for(const match of html.matchAll(/\bhref="([^"]+)"/g)){
    const url=new URL(match[1],`https://cdm-lifesupport.com/${file}`);
    if(url.origin!=='https://cdm-lifesupport.com') continue;
    const target=decodeURIComponent(url.pathname).slice(1)||'index.html';
    await access(resolve(root,target)); checkedLinks++;
    if(target.endsWith('.html')){
      destinations.get(file).push(target);
      if(url.hash) assert(ids.get(target).has(decodeURIComponent(url.hash.slice(1))),`${file}: ${match[1]} anchor exists`);
    }
  }
}
const reached=new Set();
const queue=['index.html'];
while(queue.length){const f=queue.shift();if(reached.has(f))continue;reached.add(f);queue.push(...destinations.get(f));}
for(const file of files) if(file!=='404.html') assert(reached.has(file),`${file}: reachable from TOP`);
const sitemap=await readFile(resolve(root,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,files.length-1,'all public pages in sitemap');
assert(!sitemap.includes('404.html'),'404 excluded from sitemap');
assert(documents.get('404.html').includes('<base href="/">'),'404 links and assets resolve from root, even for an unknown nested URL');
assert(!documents.get('index.html').includes('cdm-operations-hero'),'TOP uses supplied logo, not generated hero');
assert.equal((documents.get('index.html').match(/class="service-number"/g)||[]).length,3,'all business numbers use the same structure');
assert(documents.get('index.html').includes('href="products.html"'),'product catalog is reachable from TOP');
assert.equal((documents.get('products.html').match(/class="product-row"/g)||[]).length,5,'all five offers appear in the catalog');
assert.equal(products.length,5,'five confirmed products');
for(const product of products){
  const detail=documents.get(product.url);
  assert(detail?.includes(product.name),`${product.key}: detail page`);
  assert(documents.get('products.html').includes(`href="${product.url}"`),`${product.key}: catalog detail link`);
  assert(detail.includes(`service=${encodeURIComponent(product.name)}`),`${product.key}: preselected on-site consultation`);
  if(product.key!=='crm'){
    assert(detail.includes(product.price) && detail.includes(product.tax),`${product.key}: official ex-tax and tax-inclusive prices`);
  }
}
for(const [file,html] of documents) assert(!/coconala\.com|lancers\.jp|ココナラ|ランサーズ/.test(html),`${file}: no marketplace referral`);
const crm=documents.get('systems.html');
for(const amount of ['50,000円','5,000円','2,000円','150,000円','3,000円','165,000円']) assert(crm.includes(amount),`CRM preserved pricing: ${amount}`);
assert(crm.includes('外販環境の受入検証を進めています') && crm.includes('購入前のご相談が必須'),'CRM validation and consultation caveat');
assert(documents.get('contact.html').includes('このフォームから直接送信はされません'),'form explains mail workflow');
assert(/<fieldset class="form-fields" disabled/.test(documents.get('contact.html')),'form remains disabled if its preventing-submit handler cannot initialize');
for(const product of products) assert(documents.get('contact.html').includes(`<option>${product.name}</option>`),`${product.key}: optional consultation service`);
assert((await readFile(resolve(root,'assets/site.js'),'utf8')).includes('ご相談サービス：${chosenService'), 'email draft identifies the selected service');
console.log(`PASS: ${files.length} pages, ${checkedLinks} local links/assets, unique titles/H1/IDs, JSON-LD, full reachability, sitemap, TOP/logo and mail-form copy.`);
