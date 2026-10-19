import {MenuBrowser} from '@/components/products';
import {ServiceSelector} from '@/components/service';
import {pageMeta} from '@/lib/seo';
export function generateMetadata(){return pageMeta('Our menu','Explore smash burgers, flame-fired pizza, wraps, sides, desserts and drinks in our sample PKR menu.','/menu');}
export default async function Menu({searchParams}:{searchParams:Promise<{category?:string}>}){const q=await searchParams;const category=['all','burgers','pizza','wraps','sides','desserts','drinks','deals'].includes(q.category||'')?q.category!:'all';return <div className="container page-section"><div className="page-heading"><div><p className="eyebrow">SOMETHING FOR EVERY KIND OF HUNGRY</p><h1>Follow your <span>cravings.</span></h1><p>Big bites. Bold flavours. Good choices all around.</p></div><ServiceSelector/></div><MenuBrowser initialCategory={category}/></div>;}
