import {z} from 'zod';
import {database,ensureOrigin,limit,apiError,readJson,privateJson} from '@/lib/server';
const schema=z.object({email:z.string().email().max(200),consent:z.literal(true)}).strict();
export async function POST(req:Request){try{ensureOrigin(req);await limit(req,'newsletter',5);const {email}=schema.parse(await readJson(req));await database().prepare('INSERT INTO subscribers (email,created_at) VALUES (?,?) ON CONFLICT(email) DO NOTHING').bind(email.toLowerCase(),new Date().toISOString()).run();return privateJson({message:'You’re on the list. Your preference is saved; email delivery is not connected in this demo.'});}catch(e){return apiError(e);}}
