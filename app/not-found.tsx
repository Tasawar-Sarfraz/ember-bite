import Link from '@/components/site-link';
import {Flame,ArrowUpRight} from 'lucide-react';
export default function NotFound(){return <div className="container empty-state page-section"><Flame size={54}/><p className="eyebrow">404 · A LITTLE LOST?</p><h1>This bite’s <span>off the menu.</span></h1><p>Let’s get you back to something delicious.</p><Link className="button" href="/menu">Explore the menu <ArrowUpRight size={18}/></Link></div>;}
