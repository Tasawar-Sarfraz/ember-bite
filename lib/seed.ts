import type { Catalog, Product, Option } from './types';
const extra:Option[]=[{id:'cheese',name:'Extra cheese',price:15000},{id:'jalapenos',name:'Jalapeños',price:8000},{id:'sauce',name:'Ember sauce',price:7000}];
const pizzaSizes:Option[]=[{id:'regular',name:'9-inch',price:0},{id:'large',name:'12-inch',price:45000},{id:'family',name:'15-inch',price:90000}];
const regular:Option[]=[{id:'regular',name:'Regular',price:0}];
const rows:[string,string,string,number,string,string,string,boolean,boolean][]=[
['the-ember-smash','The Ember Smash','burgers',790,'Double smashed beef, molten cheddar, pickles and our signature ember sauce.','SIGNATURE','Beef, brioche, cheddar, pickles, ember sauce',false,false],
['hot-honey-bird','Hot Honey Bird','burgers',850,'Crispy chicken, hot honey glaze and crunchy slaw in a toasted bun.','SWEET HEAT','Chicken, honey, chili, brioche, cabbage',true,false],
['mushroom-melt','Mushroom Melt','burgers',890,'Seared mushrooms, caramelized onions and a generous cheddar melt.','','Mushroom, onion, cheddar, brioche',false,true],
['classic-cheeseburger','Classic Cheeseburger','burgers',650,'A proper beef patty, cheddar, ketchup and crisp pickles.','','Beef, cheddar, pickles, brioche',false,false],
['smoky-pepperoni','Smoky Pepperoni','pizza',1190,'Stone-baked dough, smoky pepperoni and bubbling mozzarella.','CROWD PLEASER','Wheat dough, beef pepperoni, mozzarella, tomato',false,false],
['fire-roasted-chicken','Fire-roasted Chicken','pizza',1290,'Flame-kissed chicken, sweet peppers and our smoky tomato base.','','Chicken, peppers, mozzarella, tomato, wheat',false,false],
['garden-margherita','Garden Margherita','pizza',990,'A simple beauty: tomato, mozzarella, fresh basil and olive oil.','VEGGIE','Tomato, mozzarella, basil, wheat',false,true],
['the-green-heat','The Green Heat','pizza',1150,'Jalapeños, green peppers and feta on a fiery tomato base.','','Jalapeños, peppers, feta, wheat',true,true],
['ember-chicken-wrap','Ember Chicken Wrap','wraps',590,'Chargrilled chicken, fresh greens and creamy ember sauce.','','Chicken, wheat tortilla, lettuce, sauce',false,false],
['peri-peri-wrap','Peri-peri Wrap','wraps',650,'Peri-peri chicken, crisp cabbage and a citrus finish.','HOT','Chicken, wheat tortilla, chili, cabbage',true,false],
['falafel-crunch','Falafel Crunch','wraps',550,'Crispy chickpea falafel, pickled vegetables and tahini.','','Chickpea, wheat tortilla, sesame, vegetables',false,true],
['loaded-ember-fries','Loaded Ember Fries','sides',490,'Golden fries with melted cheese, ember sauce and a little chili kick.','FULLY LOADED','Potato, cheese, sauce, chili',true,true],
['sea-salt-fries','Sea Salt Fries','sides',290,'Skin-on golden fries, finished with flaky sea salt.','','Potato, sea salt',false,true],
['crispy-chicken-bites','Crispy Chicken Bites','sides',590,'Tender chicken bites, crunchy coating, signature dipping sauce.','','Chicken, wheat coating, sauce',false,false],
['mozzarella-sticks','Mozzarella Sticks','sides',450,'Crispy on the outside, beautifully stretchy inside.','','Mozzarella, wheat breadcrumbs',false,true],
['brownie-and-cream','Brownie & Cream','desserts',450,'A rich chocolate brownie with a cloud of vanilla cream.','','Cocoa, wheat, milk, egg',false,true],
['cookie-skillet','Cookie Skillet','desserts',490,'Warm chocolate-chip cookie with a soft molten centre.','','Wheat, milk, egg, chocolate',false,true],
['vanilla-soft-serve','Vanilla Soft Serve','desserts',250,'Silky vanilla with a little caramel drizzle.','','Milk, vanilla, caramel',false,true],
['citrus-cooler','Citrus Cooler','drinks',290,'Fresh citrus, mint and sparkling water over ice.','REFRESH','Lemon, mint, sparkling water',false,true],
['berry-fizz','Berry Fizz','drinks',350,'Bright berry notes, lime and a sparkling finish.','','Berry syrup, lime, sparkling water',false,true],
['classic-cola','Classic Cola','drinks',180,'A chilled 330ml cola.','','Carbonated water, sugar, cola flavour',false,true],
['smash-duo','The Smash Duo','deals',1890,'Two classic cheeseburgers, two sea salt fries and two colas.','SAVE TOGETHER','Beef, wheat, milk, potato, cola',false,false],
['pizza-night','Pizza Night In','deals',2190,'One 12-inch smoky pepperoni pizza, chicken bites and two colas.','NIGHT SORTED','Wheat, beef, chicken, milk, cola',false,false],
['the-lunch-edit','The Lunch Edit','deals',890,'One ember chicken wrap, sea salt fries and a cola.','LUNCH FAVOURITE','Chicken, wheat, potato, cola',false,false],
];
export const seed:Catalog={
 categories:[{id:'all',name:'Everything',sort:0,icon:'flame'},{id:'burgers',name:'Burgers',sort:1,icon:'burger'},{id:'pizza',name:'Pizza',sort:2,icon:'pizza'},{id:'wraps',name:'Wraps',sort:3,icon:'wrap'},{id:'sides',name:'Sides',sort:4,icon:'fries'},{id:'desserts',name:'Desserts',sort:5,icon:'dessert'},{id:'drinks',name:'Drinks',sort:6,icon:'drink'},{id:'deals',name:'Deals',sort:7,icon:'gift'}],
 products:rows.map((r,i):Product=>({id:r[0],slug:r[0],name:r[1],category:r[2],price:r[3]*100,description:r[4],badge:r[5],ingredients:r[6],spicy:r[7],vegetarian:r[8],image:`/images/products/${r[0]}.webp`,allergens:['drinks','sea-salt-fries'].includes(r[2])||r[0]==='sea-salt-fries'?'Sample recipe: ask staff about cross-contact.':r[0]==='falafel-crunch'?'Wheat, sesame. Prepared in a shared kitchen.':'Wheat, milk; may contain egg, soy, sesame. Prepared in a shared kitchen.',featured:[0,4,11,18].includes(i),active:true,sizes:r[2]==='pizza'?pizzaSizes:regular,addons:['burgers','pizza','wraps','sides'].includes(r[2])?extra:[],unavailable:r[0]==='mushroom-melt'?['karachi']:[]})),
 branches:[
 {id:'lahore',slug:'lahore-gulberg',name:'Gulberg',city:'Lahore',address:'Sample branch · Gulberg demonstration zone',open:660,close:1560,fee:18000,minimum:50000,active:true,zones:['Gulberg','Model Town','Garden Town']},
 {id:'islamabad',slug:'islamabad-f7',name:'F-7',city:'Islamabad',address:'Sample branch · F-7 demonstration zone',open:660,close:1560,fee:20000,minimum:60000,active:true,zones:['F-7','F-6','F-8']},
 {id:'karachi',slug:'karachi-clifton',name:'Clifton',city:'Karachi',address:'Sample branch · Clifton demonstration zone',open:660,close:1560,fee:22000,minimum:50000,active:true,zones:['Clifton','DHA Phase 5','DHA Phase 6']}],
 coupons:[{code:'EMBER10',percent:10,minimum:100000,maximum:50000,expires:'2027-12-31',active:true}]
};
