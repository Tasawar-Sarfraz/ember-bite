'use client';
import {useEffect,useId,useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
export function Dialog({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);const id=useId();const close=useRef(onClose);
 useEffect(()=>{close.current=onClose;},[onClose]);
 useEffect(()=>{const d=ref.current;const previous=document.activeElement as HTMLElement|null;const old=document.body.style.overflow;
 if(d){try{if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');}catch{d.setAttribute('open','');}}
 document.body.style.overflow='hidden';const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close.current();}};document.addEventListener('keydown',escape);
 return()=>{d?.close?.();document.body.style.overflow=old;document.removeEventListener('keydown',escape);previous?.focus();};},[]);
 return createPortal(<dialog ref={ref} className="dialog" aria-modal="true" aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dialog-heading"><h2 id={id}>{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={22}/></button></div>{children}</dialog>,document.body);
}
