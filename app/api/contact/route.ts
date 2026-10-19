import {z} from 'zod';
import {database,ensureOrigin,limit,apiError,readJson,privateJson} from '@/lib/server';
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email().max(200),message:z.string().trim().min(10).max(2000),website:z.string().max(0).default('')}).strict();
export async function POST(req:Request){try{ensureOrigin(req);await limit(req,'contact',5);const input=schema.parse(await readJson(req));await database().prepare('INSERT INTO submissions (id,kind,email,payload,created_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),'contact',input.email,JSON.stringify(input),new Date().toISOString()).run();return privateJson({message:'Your message is saved for our team. This demo does not send email.'});}catch(e){return apiError(e);}}
