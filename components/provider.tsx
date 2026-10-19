'use client';
import {createContext,useContext,useEffect} from 'react';
import {useCart} from '@/lib/cart';
import {restoreNavigationCart} from '@/lib/public-cart-navigation';
import type {Catalog} from '@/lib/types';
const Context=createContext<Catalog|null>(null);
export function Provider({catalog,children}:{catalog:Catalog;children:React.ReactNode}){
 useEffect(()=>{async function restore(){try{await useCart.persist?.rehydrate();}catch{/* Corrupt or denied browser storage must not block ordering. */}finally{restoreNavigationCart();useCart.getState().ready();}}void restore();},[]);
 return <Context.Provider value={catalog}>{children}</Context.Provider>;
}
export function useCatalog(){const c=useContext(Context);if(!c)throw new Error('Catalog unavailable');return c;}
