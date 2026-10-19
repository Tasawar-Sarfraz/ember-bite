import {env} from 'cloudflare:workers';
import type {Metadata} from 'next';
import {brand} from './config';
export function runtime(){const e=env as unknown as Record<string,string>;return {url:e.SITE_URL||brand.url,index:e.ENABLE_INDEXING==='true'};}
export function pageMeta(title:string,description:string,path:string,noindex=false):Metadata{const cfg=runtime();return {title,description,alternates:{canonical:new URL(path,cfg.url).href},robots:{index:cfg.index&&!noindex,follow:cfg.index&&!noindex},openGraph:{title:`${title} | ${brand.name}`,description,url:new URL(path,cfg.url).href,images:[{url:new URL('/images/story-table-v3.webp',cfg.url).href,width:1600,height:1050,alt:'Ember Bite food spread'}]},twitter:{card:'summary_large_image',title,description,images:[new URL('/images/story-table-v3.webp',cfg.url).href]}};}
