import {createRequire} from 'node:module';
import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const req=createRequire(import.meta.url);
const {Miniflare}=await import(req.resolve('miniflare',{paths:[req.resolve('wrangler/package.json')]}));
const files=await readdir('dist/server',{recursive:true});
const entry='index.js';const modules=[entry,...files.filter(p=>p!==entry&&/\.(js|mjs)$/.test(p))].map(p=>({type:'ESModule',path:resolve('dist/server',p)}));
const mf=new Miniflare({name:'ember-bite',modules,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],bindings:{ADMIN_EMAILS:'admin@example.test',SITE_URL:'https://ember.test',ENABLE_INDEXING:'false'},assets:{directory:resolve('dist/client'),binding:'ASSETS',routerConfig:{has_user_worker:true,invoke_user_worker_ahead_of_assets:true}},cf:false,unsafeEvalBinding:'EVAL'});
try{const db=await mf.getD1Database('DB');const sql=await readFile('drizzle/0000_zippy_forge.sql','utf8');for(const stmt of sql.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean))await db.prepare(stmt).run();
let failed=0;for(const path of ['/','/menu','/menu/the-ember-smash','/deals','/cart','/checkout','/branches','/branches/lahore-gulberg','/about','/contact','/privacy','/terms','/track','/admin','/robots.txt','/sitemap.xml','/api/catalog','/missing-page']){const r=await mf.dispatchFetch(`https://ember.test${path}`);const body=await r.text();const expected=path==='/missing-page'?404:200;const ok=r.status===expected;console.log(`${ok?'PASS':'FAIL'} ${path} ${r.status} ${body.length} chars`);if(!ok){failed++;console.log(body.slice(0,800));}if(path==='/'&&ok){if(!body.includes('BIG FLAVOUR.'))throw Error('Home content missing from server HTML');if(!body.includes('noindex'))throw Error('Staging noindex missing');
const anchors=[...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(m=>({attributes:m[1],label:m[2].replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}));
for(const [label,target] of [['Our menu','/menu'],['Good deals','/deals'],['Our story','/about'],['Find a kitchen','/branches'],['Find your flavour','/menu']]){
 const anchor=anchors.find(a=>a.label===label&&a.attributes.includes(`href="${target}"`)&&a.attributes.includes('data-navigation="document"'));
 if(!anchor)throw Error(`Missing native document link: ${label}`);
 const destination=await mf.dispatchFetch(`https://ember.test${target}`);await destination.text();if(destination.status!==200)throw Error(`Navigation destination failed: ${target}`);
 console.log(`PASS native link: ${label} → ${target}`);
}
}}
if(failed)process.exitCode=1;
}finally{await mf.dispose();}
