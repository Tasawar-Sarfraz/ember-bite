'use client';
import {create} from 'zustand';
import {createJSONStorage,persist} from 'zustand/middleware';
import type {CartItem,Selection} from './types';
export function itemKey(item:CartItem){return `${item.productId}:${item.sizeId}:${[...item.addonIds].sort().join(',')}`;}
const defaultSelection:Selection={branchId:'lahore',mode:'delivery',zone:'Gulberg'};
// Storage may be unavailable in private mode or a cross-site embedded preview.
// Keep the cart interactive in memory even when persistence is denied.
const storage=createJSONStorage(()=>({
 getItem:(name:string)=>{try{return window.localStorage.getItem(name);}catch{return null;}},
 setItem:(name:string,value:string)=>{try{window.localStorage.setItem(name,value);}catch{/* In-memory cart remains usable. */}},
 removeItem:(name:string)=>{try{window.localStorage.removeItem(name);}catch{/* Nothing persisted. */}}
}));
type CartState={items:CartItem[];selection:Selection;hydrated:boolean;add:(item:CartItem)=>void;setQuantity:(key:string,n:number)=>void;remove:(key:string)=>void;clear:()=>void;select:(s:Selection)=>void;ready:()=>void};
function validItem(v:unknown):v is CartItem{if(!v||typeof v!=='object')return false;const i=v as Partial<CartItem>;return typeof i.productId==='string'&&typeof i.sizeId==='string'&&Array.isArray(i.addonIds)&&i.addonIds.every(a=>typeof a==='string')&&typeof i.quantity==='number'&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=20;}
export const useCart=create<CartState>()(persist((set)=>({items:[],selection:defaultSelection,hydrated:false,add:(item)=>set(s=>{const key=itemKey(item);const found=s.items.find(x=>itemKey(x)===key);return {items:found?s.items.map(x=>itemKey(x)===key?{...x,quantity:Math.min(20,x.quantity+item.quantity)}:x):[...s.items,{...item,addonIds:[...item.addonIds].sort()}]};}),setQuantity:(key,n)=>set(s=>({items:s.items.map(x=>itemKey(x)===key?{...x,quantity:Math.max(1,Math.min(20,n))}:x)})),remove:(key)=>set(s=>({items:s.items.filter(x=>itemKey(x)!==key)})),clear:()=>set({items:[]}),select:(selection)=>set({selection}),ready:()=>set({hydrated:true})}),{name:'ember-bite-cart-v1',version:1,storage,partialize:s=>({items:s.items,selection:s.selection}),skipHydration:true,merge:(stored,current)=>{const value=(stored&&typeof stored==='object'?stored:{}) as Partial<CartState>;const s=value.selection;return {...current,items:Array.isArray(value.items)?value.items.filter(validItem):[],selection:s&&typeof s.branchId==='string'&&(s.mode==='delivery'||s.mode==='pickup')&&typeof s.zone==='string'?s:defaultSelection};}}));
