import {findOrder} from '@/lib/server';
import {Tracking} from '@/components/tracking';
import {notFound} from 'next/navigation';
export const metadata={title:'Private order tracker',robots:{index:false,follow:false},referrer:'no-referrer' as const};
export default async function Page({params,searchParams}:{params:Promise<{token:string}>;searchParams:Promise<{confirmed?:string}>}){const {token}=await params;const q=await searchParams;const o=await findOrder(token);if(!o)notFound();const safe={id:o.id,status:o.status,quote:o.quote,history:o.history,mode:o.mode,createdAt:o.createdAt};return <Tracking initial={safe} token={token} confirmed={q.confirmed==='1'}/>;}
