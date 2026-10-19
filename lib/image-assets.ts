import type {Catalog} from './types';
export const productImageIds=[
 'the-ember-smash','hot-honey-bird','mushroom-melt','classic-cheeseburger',
 'smoky-pepperoni','fire-roasted-chicken','garden-margherita','the-green-heat',
 'ember-chicken-wrap','peri-peri-wrap','falafel-crunch','loaded-ember-fries',
 'sea-salt-fries','crispy-chicken-bites','mozzarella-sticks','brownie-and-cream',
 'cookie-skillet','vanilla-soft-serve','citrus-cooler','berry-fizz','classic-cola',
 'smash-duo','pizza-night','the-lunch-edit'
] as const;
export const productImages:Record<string,string>=Object.fromEntries(productImageIds.map(id=>[id,`/images/products/${id}.webp`]));
const legacy=new Set(['burgers.webp','pizza.webp','wraps.webp','sides.webp','desserts.svg','drinks.svg','deals.webp','menu-burger.webp','menu-pizza.webp','menu-wrap.webp','menu-fries.webp','menu-spread.webp'].map(n=>`/images/${n}`));
/** Update saved demonstration catalogs without resetting prices or admin edits. */
export function upgradeLegacyImages(catalog:Catalog):Catalog{return {...catalog,products:catalog.products.map(p=>legacy.has(p.image)&&productImages[p.id]?{...p,image:productImages[p.id]}:p)};}
export const marketingImages={hero:'/images/hero-burger-v3.webp',heroMobile:'/images/hero-burger-v3-mobile.webp',story:'/images/story-table-v3.webp',about:'/images/about-kitchen-v3.webp',burgers:'/images/category-burgers-v3.webp',pizza:'/images/category-pizza-v3.webp',wraps:'/images/category-wraps-v3.webp',sides:'/images/category-sides-v3.webp'};
