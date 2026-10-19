import {runtime} from '@/lib/seo';
export default function robots(){const c=runtime();return {rules:c.index?{userAgent:'*',allow:'/',disallow:['/admin','/api/','/cart','/checkout','/track','/order/']}:{userAgent:'*',disallow:'/'},sitemap:`${c.url}/sitemap.xml`};}
