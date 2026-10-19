'use client';
import type {AnchorHTMLAttributes} from 'react';
import {cartAwareHref} from '@/lib/public-cart-navigation';
/** Native navigation remains functional before hydration and on private hosting. */
export default function SiteLink({href,onClick,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}){
 return <a href={href} {...props} data-navigation="document" onClick={event=>{onClick?.(event);if(!event.defaultPrevented)event.currentTarget.href=cartAwareHref(event.currentTarget.href);}}/>;
}
