export const brand = { name:'EMBER BITE', tagline:'Big flavour. Zero ordinary.', url:'https://ember-bite.tasawarbajwa.chatgpt.site', description:'Flame-fired pizza, proper smash burgers and feel-good food. Explore the EMBER BITE demonstration menu and order for delivery or pickup.', timezone:'Asia/Karachi', currency:'PKR' };
export function money(minor:number){ return `Rs. ${new Intl.NumberFormat('en-PK',{maximumFractionDigits:2}).format(minor/100)}`; }
export const sampleTaxNote = 'Sample prices include 0% additional tax. Delivery is charged separately. Demonstration rules only.';
