import {getCatalog,ensureOrigin,limit,apiError,readJson,privateJson} from '@/lib/server';
import {quoteOrder} from '@/lib/business';
export async function POST(req:Request){try{ensureOrigin(req);await limit(req,'quote',60);const q=quoteOrder(await readJson(req),await getCatalog());return privateJson(q);}catch(e){return apiError(e);}}
