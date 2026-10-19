'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="container empty-state page-section"><p className="eyebrow">A SMALL KITCHEN HICCUP</p><h1>Let’s try <span>that again.</span></h1><p>We couldn’t load this page. Your saved cart will still be here.</p><button className="button" onClick={reset}>Try again</button></div>;}
