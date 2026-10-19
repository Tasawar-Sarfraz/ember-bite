import {z} from 'zod';
import {sampleTaxNote} from './config';
import type {Branch,Catalog,Quote,OrderStatus} from './types';
export class BusinessError extends Error { constructor(message:string,public status=400){super(message);} }
export const itemSchema=z.object({productId:z.string().min(1).max(100),sizeId:z.string().min(1).max(80),addonIds:z.array(z.string().max(80)).max(8),quantity:z.number().int().min(1).max(20)}).strict();
export const quoteSchema=z.object({items:z.array(itemSchema).min(1,'Your cart is empty.').max(50),branchId:z.string().min(1).max(80),mode:z.enum(['delivery','pickup']),zone:z.string().max(120).default(''),coupon:z.string().trim().max(30).default('')}).strict();
const phone=z.string().trim().regex(/^(?:\+92|0)3\d{9}$/,'Use a Pakistan mobile number, e.g. 03001234567.');
export const orderSchema=quoteSchema.extend({customer:z.string().trim().min(2).max(80),phone,address:z.string().trim().max(400).default(''),notes:z.string().trim().max(500).default(''),idempotency:z.string().uuid()}).superRefine((v,ctx)=>{if(v.mode==='delivery'&&v.address.length<10)ctx.addIssue({code:'custom',path:['address'],message:'Please enter a complete delivery address (at least 10 characters).'});});
export function isOpen(branch:Branch,now=new Date()){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const minute=Number(parts.find(p=>p.type==='hour')?.value)*60+Number(parts.find(p=>p.type==='minute')?.value);
 return branch.active && (branch.close>1440 ? minute>=branch.open || minute<branch.close-1440 : minute>=branch.open && minute<branch.close);
}
export function quoteOrder(raw:unknown,catalog:Catalog,now=new Date(),enforceHours=true):Quote{
 const input=quoteSchema.parse(raw); const b=catalog.branches.find(b=>b.id===input.branchId);
 if(!b||!b.active)throw new BusinessError('This kitchen is currently unavailable. Please choose another.');
 if(enforceHours&&!isOpen(b,now))throw new BusinessError('This kitchen is closed. Sample hours are 11am–2am Pakistan time.');
 if(input.mode==='delivery'&&!b.zones.includes(input.zone))throw new BusinessError('Please choose a supported delivery area.');
 const lines=input.items.map(item=>{
  const p=catalog.products.find(p=>p.id===item.productId&&p.active); if(!p||p.unavailable.includes(b.id))throw new BusinessError('An item is unavailable at this kitchen. Please review your cart.');
  const size=p.sizes.find(s=>s.id===item.sizeId);if(!size)throw new BusinessError(`Choose a valid size for ${p.name}.`);
  if(new Set(item.addonIds).size!==item.addonIds.length)throw new BusinessError('Duplicate add-ons are not allowed.');
  const addons=item.addonIds.map(id=>{const a=p.addons.find(a=>a.id===id);if(!a)throw new BusinessError(`Invalid add-on for ${p.name}.`);return a;});
  const unitPrice=p.price+size.price+addons.reduce((n,a)=>n+a.price,0);
  return {...item,name:p.name,image:p.image,size:size.name,addons:addons.map(a=>a.name),unitPrice,total:unitPrice*item.quantity};
 });
 const subtotal=lines.reduce((n,l)=>n+l.total,0);if(input.mode==='delivery'&&subtotal<b.minimum)throw new BusinessError(`Delivery minimum is Rs. ${b.minimum/100}. Add a little more or choose pickup.`);
 let discount=0;let coupon=''; if(input.coupon){const c=catalog.coupons.find(c=>c.code===input.coupon.toUpperCase()&&c.active); const localDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);if(!c||c.expires<localDate)throw new BusinessError('This code is invalid or has expired.');if(subtotal<c.minimum)throw new BusinessError(`This code needs a minimum of Rs. ${c.minimum/100}.`); discount=Math.min(Math.floor(subtotal*c.percent/100),c.maximum);coupon=c.code;}
 const fee=input.mode==='delivery'?b.fee:0;return {lines,subtotal,discount,fee,tax:0,total:subtotal-discount+fee,coupon,branchName:`${b.name}, ${b.city}`,mode:input.mode,taxNote:sampleTaxNote};
}
const transitions:Record<OrderStatus,OrderStatus[]>={received:['accepted','cancelled'],accepted:['preparing','cancelled'],preparing:['ready','cancelled'],ready:['out_for_delivery','completed'],out_for_delivery:['completed'],completed:[],cancelled:[]};
export function nextStatuses(status:OrderStatus,mode:'delivery'|'pickup'){return transitions[status].filter(x=>mode==='delivery'?x!=='completed'||status==='out_for_delivery':x!=='out_for_delivery');}
export function validateTransition(from:OrderStatus,to:OrderStatus,mode:'delivery'|'pickup'){if(!nextStatuses(from,mode).includes(to))throw new BusinessError('That order status change is not allowed.');}
