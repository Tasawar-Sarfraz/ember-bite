import {CartPage} from '@/components/checkout';
import {pageMeta} from '@/lib/seo';
export function generateMetadata(){return pageMeta('Your cart','Review your Ember Bite order.','/cart',true);}
export default function Page(){return <CartPage/>;}
