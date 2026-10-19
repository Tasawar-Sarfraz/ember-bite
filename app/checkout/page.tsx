import {Checkout} from '@/components/checkout';
import {pageMeta} from '@/lib/seo';
export function generateMetadata(){return pageMeta('Checkout','Secure demonstration guest checkout.','/checkout',true);}
export default async function Page({searchParams}:{searchParams:Promise<{coupon?:string}>}){const s=await searchParams;return <Checkout initialCoupon={s.coupon?.slice(0,30)||''}/>;}
