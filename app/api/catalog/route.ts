import {getCatalog,apiError} from '@/lib/server';
export async function GET(){try{const c=await getCatalog();return Response.json({...c,coupons:[]},{headers:{'Cache-Control':'no-store'}});}catch(e){return apiError(e);}}
