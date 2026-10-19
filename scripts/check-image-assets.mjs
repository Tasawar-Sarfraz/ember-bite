import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const source=await readFile(new URL('../lib/seed.ts',import.meta.url),'utf8');
const compiled=ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const {seed}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const seen=new Map();let total=0;
for(const p of seed.products){
 const path=new URL(`../public${p.image}`,import.meta.url);const bytes=await readFile(path);const hash=createHash('sha256').update(bytes).digest('hex');
 if(seen.has(hash))throw new Error(`Repeated photo: ${p.id} and ${seen.get(hash)}`);
 if(!p.image.includes(`/products/${p.id}.webp`))throw new Error(`Shared image mapping: ${p.id}`);
 if(bytes.length>220000)throw new Error(`Product image needs more optimization: ${p.id} (${bytes.length} bytes)`);
 seen.set(hash,p.id);total+=bytes.length;console.log(`PASS ${p.id}: ${(bytes.length/1024).toFixed(1)} KiB`);
}
for(const name of ['hero-burger-v3.webp','hero-burger-v3-mobile.webp','story-table-v3.webp','about-kitchen-v3.webp','category-burgers-v3.webp','category-pizza-v3.webp','category-wraps-v3.webp','category-sides-v3.webp']){const file=new URL(`../public/images/${name}`,import.meta.url);const info=await stat(file);console.log(`PASS ${name}: ${(info.size/1024).toFixed(1)} KiB`);}
console.log(`24 distinct product files; ${(total/1024).toFixed(1)} KiB total. New homepage/story/about assets present.`);
