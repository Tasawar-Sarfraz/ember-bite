import Link from '@/components/site-link';
import {ArrowUpRight} from 'lucide-react';
import {ContactForm} from '@/components/forms';
import {pageMeta} from '@/lib/seo';
export function generateMetadata(){return pageMeta('Let’s talk','Save a question or feedback for the Ember Bite demonstration kitchen team.','/contact');}
export default function Contact(){return <div className="container page-section"><div className="contact-grid"><div><p className="eyebrow">WE’RE ALL EARS. AND APPETITE.</p><h1>Say hello.<br/><span>Make our day.</span></h1><p className="lead">A question about the menu? A thought worth sharing? Leave a little note.</p><div className="contact-aside"><h2>Looking for your order?</h2><p>Your private tracking link has the latest saved status, straight from the kitchen.</p><Link href="/track" className="text-link">Track your order <ArrowUpRight size={16}/></Link><p className="note">This is a fictional restaurant demonstration. There is no operating call centre or physical delivery service.</p></div></div><ContactForm/></div></div>;}
