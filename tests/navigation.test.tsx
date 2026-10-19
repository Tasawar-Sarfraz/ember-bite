// @vitest-environment happy-dom
import React from 'react';
import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Provider} from '../components/provider';
import {Header} from '../components/shell';
import {Hero} from '../components/hero';
import SiteLink from '../components/site-link';
import {seed} from '../lib/seed';
import {useCart} from '../lib/cart';
import {cartAwareHref,restoreNavigationCart} from '../lib/public-cart-navigation';
vi.mock('next/navigation',()=>({usePathname:()=>'/'}));
afterEach(()=>{cleanup();vi.restoreAllMocks();window.history.replaceState(null,'','/');});
const targets=[['Our menu','/menu'],['Good deals','/deals'],['Our story','/about'],['Find a kitchen','/branches'],['Find your flavour','/menu']];
describe('reported navigation links',()=>{
 it.each(targets)('%s has the correct native destination and does not intercept clicks',(label,href)=>{
  render(<Provider catalog={structuredClone(seed)}><Header/><Hero/></Provider>);
  const link=screen.getByRole('link',{name:label});
  expect(link.getAttribute('href')).toBe(href);expect(link.getAttribute('data-navigation')).toBe('document');
  let intercepted:boolean|undefined;
  const capture=(event:Event)=>{if(event.target instanceof Node&&link.contains(event.target)){intercepted=event.defaultPrevented;event.preventDefault();}};
  document.addEventListener('click',capture);
  fireEvent.click(link);document.removeEventListener('click',capture);
  expect(intercepted).toBe(false);
 });
 it('renders real navigation HTML without client JavaScript',()=>{
  for(const [label,href] of targets){const html=renderToStaticMarkup(<SiteLink href={href}>{label}</SiteLink>);expect(html).toContain(`href="${href}"`);expect(html).toContain('data-navigation="document"');expect(html).toContain(label);}
 });
 it('keeps cart choices across native navigation when storage is blocked',()=>{
  vi.spyOn(window,'localStorage','get').mockReturnValue({length:0,key:()=>null,clear:()=>{},removeItem:()=>{},getItem:()=>{throw new DOMException('Denied','SecurityError');},setItem:()=>{throw new DOMException('Denied','SecurityError');}});
  expect(()=>window.localStorage.setItem('test','x')).toThrow('Denied');
  const item={productId:'the-ember-smash',sizeId:'regular',addonIds:['cheese'],quantity:2};
  useCart.setState({items:[item],selection:{branchId:'lahore',mode:'pickup',zone:'Gulberg'}});
  const href=cartAwareHref('/cart');expect(href).toContain('#eb-cart=');
  window.history.replaceState(null,'',href);useCart.setState({items:[]});restoreNavigationCart();
  expect(useCart.getState().items).toEqual([item]);expect(useCart.getState().selection.mode).toBe('pickup');expect(window.location.hash).toBe('');
 });
 it('ignores malformed navigation state instead of breaking the page',()=>{
  window.history.replaceState(null,'','/cart#eb-cart=not-json');expect(()=>restoreNavigationCart()).not.toThrow();expect(window.location.hash).toBe('');
 });
 it('preserves browser new-tab and modifier-click behavior',()=>{
  render(<SiteLink href="/menu" target="_blank" rel="noopener">Menu in a new tab</SiteLink>);
  const link=screen.getByRole('link');expect(link.getAttribute('target')).toBe('_blank');expect(link.getAttribute('rel')).toBe('noopener');
  const event=new MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true});let intercepted:boolean|undefined;const capture=(e:Event)=>{intercepted=e.defaultPrevented;e.preventDefault();};document.addEventListener('click',capture);link.dispatchEvent(event);document.removeEventListener('click',capture);expect(intercepted).toBe(false);
 });
});
