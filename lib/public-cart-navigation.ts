'use client';
import {useCart} from './cart';
const marker='#eb-cart=';
/** Carry only public cart choices when browser persistence is denied. */
export function cartAwareHref(href:string){
 const target=new URL(href,window.location.href);if(target.origin!==window.location.origin)return target.href;
 try{const probe='ember-bite-storage-probe';window.localStorage.setItem(probe,'ok');const available=window.localStorage.getItem(probe)==='ok';window.localStorage.removeItem(probe);if(available)return target.href;}catch{/* Embedded/private browser storage may be denied. */}
 const {items,selection}=useCart.getState();const value=encodeURIComponent(JSON.stringify({items,selection}));
 if(value.length<48000)target.hash=`eb-cart=${value}`;return target.href;
}
export function restoreNavigationCart(){
 const hash=window.location.hash;if(!hash.startsWith(marker)||hash.length>48020)return;
 try{const saved:unknown=JSON.parse(decodeURIComponent(hash.slice(marker.length)));const current=useCart.getState();const merged=useCart.persist.getOptions().merge?.(saved,current);if(merged)useCart.setState({items:merged.items,selection:merged.selection});}catch{/* Ignore malformed fragments; server validation still governs orders. */}
 window.history.replaceState(window.history.state,'',window.location.pathname+window.location.search);
}
