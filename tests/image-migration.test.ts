import {describe,it,expect} from 'vitest';
import {seed} from '../lib/seed';
import {productImages,upgradeLegacyImages} from '../lib/image-assets';
import {catalogSchema} from '../lib/catalog-schema';
describe('product-specific photography',()=>{
 it('assigns a different product photograph to each of the 24 menu items',()=>{expect(seed.products).toHaveLength(24);expect(new Set(seed.products.map(p=>p.image)).size).toBe(24);expect(()=>catalogSchema.parse(seed)).not.toThrow();});
 it('upgrades saved shared images without resetting prices, branch rules or coupons',()=>{const saved=structuredClone(seed);saved.products[0].image='/images/burgers.webp';saved.products[0].price=123456;saved.branches[0].fee=32100;saved.coupons[0].percent=12;const fresh=upgradeLegacyImages(saved);expect(fresh.products[0].image).toBe(productImages['the-ember-smash']);expect(fresh.products[0].price).toBe(123456);expect(fresh.branches[0].fee).toBe(32100);expect(fresh.coupons[0].percent).toBe(12);expect(saved.products[0].image).toBe('/images/burgers.webp');});
 it('preserves a separately assigned photo and ignores unknown products',()=>{const saved=structuredClone(seed);saved.products[0].image='/images/custom-burger.webp';saved.products[1].id='custom-special';saved.products[1].image='/images/burgers.webp';const fresh=upgradeLegacyImages(saved);expect(fresh.products[0].image).toBe('/images/custom-burger.webp');expect(fresh.products[1].image).toBe('/images/burgers.webp');});
 it('accepts local product photos while rejecting traversal and external image URLs',()=>{for(const image of ['/images/products/../../secret.webp','https://example.test/burger.webp','/images/products/subdir/secret.webp']){const copy=structuredClone(seed);copy.products[0].image=image;expect(()=>catalogSchema.parse(copy)).toThrow();}});
});
