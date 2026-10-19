import type {Metadata} from 'next';
import {getCatalog} from '@/lib/server';
import {brand} from '@/lib/config';
import {runtime} from '@/lib/seo';
import {Provider} from '@/components/provider';
import {Header,Footer,MobileCart} from '@/components/shell';
import './globals.css';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{const c=runtime();return {metadataBase:new URL(c.url),title:{default:`${brand.name} — Big flavour. Zero ordinary.`,template:`%s | ${brand.name}`},description:brand.description,robots:{index:c.index,follow:c.index},icons:{icon:'/favicon.svg'},openGraph:{type:'website',siteName:brand.name,title:brand.name,description:brand.description,images:['/images/story-table-v3.webp']},twitter:{card:'summary_large_image',images:['/images/story-table-v3.webp']}};}
export default async function RootLayout({children}:{children:React.ReactNode}){const catalog=await getCatalog();return <html lang="en"><body><Provider catalog={{...catalog,coupons:[]}}><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><MobileCart/></Provider></body></html>;}
