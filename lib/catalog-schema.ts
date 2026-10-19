import {z} from 'zod';
const id=z.string().regex(/^[a-z0-9-]+$/).min(1).max(80);const cash=z.number().int().min(0).max(100000000);const option=z.object({id,name:z.string().min(1).max(80),price:cash}).strict();
export const catalogSchema=z.object({
 categories:z.array(z.object({id,name:z.string().min(1).max(60),sort:z.number().int().min(0).max(100),icon:z.string().max(30)}).strict()).min(1).max(40),
 products:z.array(z.object({id,slug:id,name:z.string().min(1).max(100),category:id,description:z.string().min(1).max(1000),price:cash,image:z.string().regex(/^\/images\/(?:products\/)?[a-z0-9-]+\.(webp|png|avif|svg)$/),badge:z.string().max(40),ingredients:z.string().max(1000),allergens:z.string().max(1000),spicy:z.boolean(),vegetarian:z.boolean(),featured:z.boolean(),active:z.boolean(),sizes:z.array(option).min(1).max(10),addons:z.array(option).max(12),unavailable:z.array(id).max(30)}).strict()).max(200),
 branches:z.array(z.object({id,slug:id,name:z.string().min(1).max(80),city:z.string().min(1).max(80),address:z.string().max(300),open:z.number().int().min(0).max(1439),close:z.number().int().min(1).max(2879),fee:cash,minimum:cash,active:z.boolean(),zones:z.array(z.string().min(1).max(80)).max(40)}).strict()).min(1).max(30),
 coupons:z.array(z.object({code:z.string().regex(/^[A-Z0-9]+$/).max(30),percent:z.number().int().min(1).max(100),minimum:cash,maximum:cash,expires:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),active:z.boolean()}).strict()).max(100)
}).strict().superRefine((c,ctx)=>{
 const check=(values:string[],label:string)=>{if(new Set(values).size!==values.length)ctx.addIssue({code:'custom',message:`Duplicate ${label}.`});};
 check(c.categories.map(x=>x.id),'category IDs');check(c.products.map(x=>x.id),'product IDs');check(c.products.map(x=>x.slug),'product URLs');check(c.branches.map(x=>x.id),'branch IDs');check(c.branches.map(x=>x.slug),'branch URLs');check(c.coupons.map(x=>x.code),'coupon codes');
 for(const p of c.products){if(!c.categories.some(x=>x.id===p.category&&x.id!=='all'))ctx.addIssue({code:'custom',message:`Unknown category for ${p.name}.`});if(p.unavailable.some(id=>!c.branches.some(b=>b.id===id)))ctx.addIssue({code:'custom',message:`Unknown branch for ${p.name}.`});check(p.sizes.map(x=>x.id),'size IDs');check(p.addons.map(x=>x.id),'add-on IDs');}
 for(const b of c.branches){if(b.close<=b.open||b.close-b.open>1440)ctx.addIssue({code:'custom',message:`Invalid hours for ${b.name}.`});check(b.zones,'delivery zones');}
});
