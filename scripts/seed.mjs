import {readFile,mkdir,writeFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../lib/seed.ts',import.meta.url),'utf8');
const compiled=ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const {seed}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
await mkdir(new URL('../work/',import.meta.url),{recursive:true});
const sql=`INSERT INTO settings (key,value,version) VALUES ('catalog','${JSON.stringify(seed).replaceAll("'","''")}',1) ON CONFLICT(key) DO NOTHING;\n`;
await writeFile(new URL('../work/seed.sql',import.meta.url),sql);
console.log('Generated work/seed.sql. Apply using the README local D1 command after building and migrating. Existing catalog changes are preserved.');
