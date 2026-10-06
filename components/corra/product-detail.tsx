'use client';
import {useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,Pause,Play} from 'lucide-react';
import {products,type CorraProduct} from '@/lib/products';
import {PageShell} from './page-shell';
import {ProductScene} from './product-scene';
import {ProductCard} from './product-card';
import {Pouch} from './pouch';
import {CTA} from './cta';
import {FormulaComparison} from './formula-comparison';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';

export function ProductDetail({product:p}:{product:CorraProduct}){
  const progress=useRef(p.id==='follicular'?.36:p.id==='luteal'?.64:0);
  const [paused,setPaused]=useState(false);
  const [view,setView]=useState<'studio'|'labels'>('studio');
  const message=`I’m interested in ${p.name} (${p.flavour}, ${p.weight}). Please share availability, pricing, complete ingredients, allergens and ordering details.`;
  const inquiry=`/contact?message=${encodeURIComponent(message)}`;
  return <PageShell className="product-detail-page">
    <nav className="page-width product-breadcrumb" aria-label="Breadcrumb"><Link prefetch={false} href="/shop"><ArrowLeft size={14}/> Shop Corra</Link><span aria-hidden="true">/</span><span aria-current="page">{p.name}</span></nav>
    <section className="product-detail-grid page-width">
      <div className="product-gallery" style={{'--product-tint':p.tint,'--product-colour':p.colour} as React.CSSProperties}>
        <div className={`gallery-studio hero-experience ${view==='studio'?'':'gallery-hidden'}`} aria-hidden={view!=='studio'} inert={view!=='studio'}><ProductScene progress={progress} paused={paused||view!=='studio'} chapter={p.id==='follicular'?1:p.id==='luteal'?2:0} gallery={p.id}/><span className="gallery-caption">{p.id==='corra-set'?'THE TWO-PACKET SET':`${p.name.toUpperCase()} / ${p.flavour.toUpperCase()}`}</span><button className="gallery-pause" onClick={()=>setPaused(value=>!value)} aria-label={paused?'Resume product animation':'Pause product animation'} aria-pressed={paused}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div>
        {view==='labels'&&<div className={`gallery-labels ${p.id==='corra-set'?'is-duo':''}`}>{p.id!=='luteal'&&<Pouch type="follicular"/>}{p.id!=='follicular'&&<Pouch/>}</div>}
        <div className="gallery-tabs" role="group" aria-label="Product view"><button onClick={()=>setView('studio')} aria-pressed={view==='studio'}>01 · Studio</button><button onClick={()=>setView('labels')} aria-pressed={view==='labels'}>02 · The packaging</button></div>
      </div>
      <div className="product-detail-copy page-reveal"><span className="eyebrow">HORMONE SUPPORT PROTEIN / {p.weight.toUpperCase()}</span><h1 className="inner-title">{p.name}{p.id==='corra-set'?'.':''}</h1><span className="product-flavour">{p.flavour}</span><p className="detail-description">{p.description}</p>
        <div className="detail-metrics"><div><strong>{p.protein}</strong><span>PROTEIN</span></div><div><strong>0g</strong><span>ADDED SUGAR</span></div><div><strong>20</strong><span>VITAMINS &amp; MINERALS</span></div></div>
        <div className="formula-selector"><span className="detail-label">EXPLORE THE COLLECTION</span><div>{products.map(item=><Link prefetch={false} key={item.id} href={`/shop/${item.id}`} aria-current={item.id===p.id?'page':undefined}>{item.id==='corra-set'?'The set':item.name}</Link>)}</div></div>
        <div className="detail-order"><CTA href={inquiry}>Request ordering details</CTA><p>Contact Corra for availability and pricing.</p></div>
        <Accordion type="single" collapsible defaultValue="inside" className="detail-accordion"><AccordionItem value="inside"><AccordionTrigger>What’s included</AccordionTrigger><AccordionContent>{p.id==='corra-set'?'One 500g Follicular vanilla pouch and one 500g Luteal chocolate pouch. Follicular has 25g protein; Luteal has 30g.':`One ${p.weight} ${p.name} pouch in ${p.flavour.toLowerCase()} flavour.`} Both formulas list 0g added sugar and 20 vitamins &amp; minerals.</AccordionContent></AccordionItem><AccordionItem value="routine"><AccordionTrigger>The packets and the app</AccordionTrigger><AccordionContent>Corra’s two formulas are designed to support your nutrition. The app concept brings cycle dates, symptom check-ins and packet-switching guidance together. Follow the instructions on your packet for use.</AccordionContent></AccordionItem><AccordionItem value="ingredients"><AccordionTrigger>Ingredients, allergens &amp; serving instructions</AccordionTrigger><AccordionContent>Request the complete ingredient and allergen list and serving instructions from our team before ordering. <Link prefetch={false} href={inquiry} className="text-link">Ask Corra <ArrowUpRight size={14}/></Link></AccordionContent></AccordionItem></Accordion>
      </div>
    </section>
    <FormulaComparison/>
    <section className="related-products page-width" aria-labelledby="related-heading"><div className="related-heading"><div><span className="eyebrow">THE CORRA COLLECTION</span><h2 id="related-heading">Also <em>explore.</em></h2></div><Link prefetch={false} className="text-link" href="/shop">View all products <ArrowUpRight size={18}/></Link></div><div className="catalog-grid related-grid">{products.filter(item=>item.id!==p.id).map(product=><ProductCard key={product.id} product={product}/>)}</div></section>
  </PageShell>;
}
