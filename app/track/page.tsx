import {TrackLookup} from '@/components/tracking';
export const metadata={title:'Track your order',robots:{index:false,follow:false}};
export default function Page(){return <div className="container page-section narrow"><p className="eyebrow">FOLLOW THE GOOD STUFF</p><h1>Your order.<br/><span>Right here.</span></h1><p className="lead">Use the private link from your confirmation to see the latest kitchen status.</p><TrackLookup/></div>;}
