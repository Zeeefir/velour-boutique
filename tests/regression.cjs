const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const prefix=fs.readFileSync('dist/cart.js','utf8').split("$('#cartButton').onclick")[0];
function run(seed,promo=""){const ctx=vm.createContext({read:key=>key==='velour-promo'?promo:seed,products:[{id:'a',sizes:'40, 42',price:1000}],$:()=>({textContent:''}),localStorage:{setItem(){}},toast(){}});vm.runInContext(prefix,ctx);return code=>vm.runInContext(code,ctx)}
let check=run([{id:'a',size:'42',qty:2}]);assert.equal(check('cartTotal()'),2000);assert.equal(check("products[0].price=1500;cartTotal()"),3000);
check=run([{id:'missing',size:'42',qty:1},{id:'a',size:'99',qty:1},{id:'a',size:'40',qty:0},{id:'a',size:'40',qty:21},{id:'a',size:'40',qty:1.5},{id:'a',size:'42',qty:3}]);assert.equal(check('validCart().length'),1);assert.equal(check('cartTotal()'),3000);
check=run({bad:true});assert.equal(check('cartTotal()'),0);
check=run([{id:'a',size:'42',qty:2}],'WELCOME10');assert.equal(check('cartSubtotal()'),2000);assert.equal(check('cartTotal()'),1800);check=run([{id:'a',size:'42',qty:1}],'INVALID');assert.equal(check('cartTotal()'),1000);
const html=fs.readFileSync('dist/index.html','utf8'),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');for(const src of [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]).filter(s=>!s.startsWith('http')))assert.ok(fs.existsSync('dist/'+src),'Missing asset '+src);
console.log('PASS: cart totals, price changes, invalid entries, storage shape, HTML IDs and assets');
