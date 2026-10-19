'use client';
import {cartAwareHref} from './public-cart-navigation';
/** Use the same native document navigation as storefront anchors after mutations. */
export function navigateDocument(path:string){
 const target=new URL(path,window.location.href);
 if(target.origin!==window.location.origin)throw new Error('Navigation must remain on this website.');
 window.location.assign(cartAwareHref(target.href));
}
