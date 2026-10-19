import {runtime} from '@/lib/seo';
import {getCatalog} from '@/lib/server';
export default async function sitemap(){const c=runtime();if(!c.index)return [];const catalog=await getCatalog();return ['','/menu','/deals','/about','/branches','/contact',...catalog.products.filter(p=>p.active).map(p=>`/menu/${p.slug}`),...catalog.branches.filter(b=>b.active).map(b=>`/branches/${b.slug}`)].map(path=>({url:`${c.url}${path}`}));}
