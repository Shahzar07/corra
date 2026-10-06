'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Check,Plus} from 'lucide-react';
import {products,formatPrice,getProduct,type CorraProduct} from '@/lib/products';
import {cart} from '@/lib/cart';
import {Pouch} from './pouch';

const hoverPhoto:Record<string,{src:string;alt:string}>={
  'corra-set':{src:'flatlay',alt:'Both Corra pouches laid out with a shaker and fresh ingredients'},
  follicular:{src:'jogging',alt:'Woman jogging along the coast at sunrise'},
  luteal:{src:'cozy',alt:'Woman enjoying a shake on a beige sofa'},
};
const badges:Record<string,string>={'corra-set':'Best value','follicular':'Vanilla','luteal':'Chocolate'};

function ShopCard({product,index}:{product:CorraProduct;index:number}){
  const [added,setAdded]=useState(false);
  useEffect(()=>{if(!added)return;const t=setTimeout(()=>setAdded(false),2200);return()=>clearTimeout(t)},[added]);
  const set=getProduct('corra-set')!;
  const saving=product.id==='corra-set'?getProduct('follicular')!.pricePence+getProduct('luteal')!.pricePence-set.pricePence:0;
  const photo=hoverPhoto[product.id];
  return <article className="shop-card" style={{'--product-tint':product.tint,'--product-colour':product.colour} as React.CSSProperties}>
    <div className="shop-card-visual">
    <Link prefetch={false} href={`/shop/${product.id}`} className="shop-card-media" aria-label={`View ${product.name}, ${formatPrice(product.pricePence)}`}>
      <span className="shop-card-index">0{index+1}</span>
      <span className={`shop-badge ${product.id==='corra-set'?'is-hot':''}`}>{saving?`Save ${formatPrice(saving)}`:badges[product.id]}</span>
      <span className={`shop-card-pouches ${product.id==='corra-set'?'is-duo':''}`}>{product.id!=='luteal'&&<Pouch type="follicular"/>}{product.id!=='follicular'&&<Pouch/>}</span>
      <span className="shop-card-photo"><Image src={`/images/${photo.src}.webp`} alt="" fill sizes="(max-width: 800px) 90vw, 30vw"/></span>
      <span className="shop-card-view">View product <ArrowUpRight size={15}/></span>
    </Link>
    <button type="button" className={`quick-add ${added?'is-added':''}`} onClick={()=>{cart.add(product.id,1);setAdded(true)}} aria-label={`Add ${product.name} to cart`}>
      {added?<><Check size={16}/>Added to cart</>:<><Plus size={16}/>Quick add · {formatPrice(product.pricePence)}</>}
    </button>
    </div>
    <span className="sr-only" role="status" aria-live="polite">{added?`${product.name} added to cart`:''}</span>
    <div className="shop-card-info">
      <div><Link prefetch={false} href={`/shop/${product.id}`}><h3>{product.name}</h3></Link><p>{product.subtitle}</p></div>
      <div className="shop-card-price"><strong>{formatPrice(product.pricePence)}</strong>{saving>0&&<s>{formatPrice(set.pricePence+saving)}</s>}</div>
    </div>
    <ul className="shop-card-facts"><li>{product.protein} protein</li><li>0g added sugar</li><li>{product.weight}</li></ul>
  </article>;
}

export function ShopCollection(){
  const [filter,setFilter]=useState<'all'|'set'|'single'>('all');const [filtered,setFiltered]=useState(false);
  const shown=products.filter(p=>filter==='all'||(filter==='set'?p.id==='corra-set':p.id!=='corra-set'));
  return <section className="section shop-collection" id="shop-collection" aria-labelledby="collection-heading">
    <div className="collection-head section-intro">
      <div><span className="eyebrow">SHOP THE COLLECTION</span><h2 id="collection-heading">Two formulas. <em>One ritual.</em></h2></div>
      <div className="collection-tools">
        <div className="collection-tabs" role="tablist" aria-label="Filter products">{([['all','All'],['set','The set'],['single','Single pouches']] as const).map(([id,label])=><button key={id} role="tab" aria-selected={filter===id} className={filter===id?'is-active':''} onClick={()=>{setFilter(id);setFiltered(true)}}>{label}<sup>{id==='all'?3:id==='set'?1:2}</sup></button>)}</div>
        <Link prefetch={false} href="/shop" className="text-link">View all <ArrowUpRight size={15}/></Link>
      </div>
    </div>
    <div key={filter} className={`shop-grid count-${shown.length} ${filtered?'is-filtered':''}`}>{shown.map(p=><ShopCard key={p.id} product={p} index={products.indexOf(p)}/>)}</div>
  </section>;
}

const tiles=[
  {href:'/shop/follicular',img:'portrait-follicular',kicker:'DAYS 6–13*',title:'Follicular',sub:'Vanilla · 25g protein',colour:'#F95006'},
  {href:'/shop/luteal',img:'portrait-luteal',kicker:'DAYS 17–28*',title:'Luteal',sub:'Chocolate · 30g protein',colour:'#6B1D57'},
  {href:'/shop/corra-set',img:'flatlay',kicker:'BOTH PHASES',title:'The Corra set',sub:'Both pouches, together',colour:'#34282d'},
  {href:'/#phase',img:'portrait-ovulatory',kicker:'NOT SURE?',title:'Find your phase',sub:'Try the interactive guide',colour:'#9BB58E'},
];
export function ShopByPhase(){
  return <section className="section phase-tiles-section" aria-labelledby="tiles-heading">
    <div className="section-intro collection-head"><div><span className="eyebrow">SHOP BY PHASE</span><h2 id="tiles-heading">Start with <em>where you are.</em></h2></div><p>Each pouch is made for a part of your cycle. Pick your phase, or take both with the set.</p></div>
    <div className="phase-tiles">{tiles.map((t,i)=><Link prefetch={false} key={t.title} href={t.href} className="phase-tile" style={{'--tile-colour':t.colour} as React.CSSProperties}>
      <Image src={`/images/${t.img}.webp`} alt="" fill sizes="(max-width: 800px) 50vw, 25vw"/>
      <span className="phase-tile-shade"/>
      <span className="phase-tile-num">0{i+1}</span>
      <span className="phase-tile-copy"><small>{t.kicker}</small><strong>{t.title}</strong><span>{t.sub}</span></span>
      <span className="phase-tile-arrow"><ArrowUpRight size={20}/></span>
    </Link>)}</div>
    <p className="tiles-footnote">*Illustrative 28-day cycle. Your own timing may differ.</p>
  </section>;
}

function CountUp({to,suffix='',duration=1400}:{to:number;suffix?:string;duration?:number}){
  const ref=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=`${to}${suffix}`;return}
    el.textContent=`0${suffix}`;let frame=0;
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting)return;observer.disconnect();
      const start=performance.now();
      const step=(now:number)=>{const t=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-t,3);el.textContent=`${Math.round(to*eased)}${suffix}`;if(t<1)frame=requestAnimationFrame(step)};
      frame=requestAnimationFrame(step);
    },{threshold:.6});
    observer.observe(el);return()=>{observer.disconnect();cancelAnimationFrame(frame)};
  },[to,suffix,duration]);
  return <span ref={ref}>{to}{suffix}</span>;
}

export function StatsBand(){
  const stats:{value:React.ReactNode;label:string;note:string}[]=[
    {value:<><CountUp to={25}/><i>/</i><CountUp to={30} suffix="g"/></>,label:'Protein per serving',note:'Follicular 25g · Luteal 30g, as listed on each label'},
    {value:<CountUp to={0} suffix="g"/>,label:'Added sugar',note:'In both the vanilla and chocolate formula'},
    {value:<CountUp to={20}/>,label:'Vitamins & minerals',note:'In each formula'},
    {value:<><CountUp to={2}/><i>×</i><CountUp to={500} suffix="g"/></>,label:'Pouches in the set',note:'One Follicular, one Luteal'},
  ];
  return <section className="stats-band" id="science" aria-labelledby="stats-heading">
    <div className="stats-inner">
      <div className="stats-head"><span className="eyebrow">THE FORMULA, BY THE NUMBERS</span><h2 id="stats-heading">What’s on <em>every label.</em></h2><p>Straight from the product labels. Ask Corra for the complete ingredient and allergen list before ordering.</p><Link prefetch={false} href="/contact?message=Please%20share%20the%20complete%20ingredients%2C%20allergens%20and%20serving%20instructions%20for%20the%20Corra%20formulas." className="text-link">Ask about ingredients <ArrowUpRight size={15}/></Link></div>
      <dl className="stats-grid">{stats.map(s=><div className="stat" key={s.label}><dt>{s.label}</dt><dd><span className="stat-value">{s.value}</span><small>{s.note}</small></dd></div>)}</dl>
    </div>
  </section>;
}
