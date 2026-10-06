'use client';
import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,Check,Plus} from 'lucide-react';
import {products,formatPrice,getProduct,type CorraProduct} from '@/lib/products';
import {cart} from '@/lib/cart';
import {Pouch} from './pouch';

// Hover visuals use the correct current packaging only: the two-pouch product photo for the set, the v2 renders for singles.
// Hover visuals use the correct current packaging renders, shown uncropped.
const hoverRenders:Record<string,string[]>={
  'corra-set':['/images/pouch-follicular-v2.png','/images/pouch-luteal-v2.png'],
  follicular:['/images/pouch-follicular-v2.png'],
  luteal:['/images/pouch-luteal-v2.png'],
};
const badges:Record<string,string>={'corra-set':'Best value','follicular':'Vanilla','luteal':'Chocolate'};

function ShopCard({product,index}:{product:CorraProduct;index:number}){
  const [added,setAdded]=useState(false);
  useEffect(()=>{if(!added)return;const t=setTimeout(()=>setAdded(false),2200);return()=>clearTimeout(t)},[added]);
  const set=getProduct('corra-set')!;
  const saving=product.id==='corra-set'?getProduct('follicular')!.pricePence+getProduct('luteal')!.pricePence-set.pricePence:0;
  const renders=hoverRenders[product.id];
  return <article className="shop-card" style={{'--product-tint':product.tint,'--product-colour':product.colour} as React.CSSProperties}>
    <div className="shop-card-visual">
    <Link prefetch={false} href={`/shop/${product.id}`} className="shop-card-media" aria-label={`View ${product.name}, ${formatPrice(product.pricePence)}`}>
      <span className="shop-card-index">0{index+1}</span>
      <span className={`shop-badge ${product.id==='corra-set'?'is-hot':''}`}>{saving?`Save ${formatPrice(saving)}`:badges[product.id]}</span>
      <span className={`shop-card-pouches ${product.id==='corra-set'?'is-duo':''}`}>{product.id!=='luteal'&&<Pouch type="follicular"/>}{product.id!=='follicular'&&<Pouch/>}</span>
      <span className={`shop-card-photo is-render ${renders.length>1?'is-duo':''}`}>{renders.map(src=><span key={src} className="render-slot"><Image src={src} alt="" fill quality={90} sizes="(max-width: 800px) 70vw, 24vw"/></span>)}</span>
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
  {href:'/shop/corra-set',img:'',kicker:'BOTH PHASES',title:'The Corra set',sub:'Both pouches, together',colour:'#34282d'},
  {href:'/#phase',img:'portrait-ovulatory',kicker:'NOT SURE?',title:'Find your phase',sub:'Try the interactive guide',colour:'#9BB58E'},
];
export function ShopByPhase(){
  return <section className="section phase-tiles-section" aria-labelledby="tiles-heading">
    <div className="section-intro collection-head"><div><span className="eyebrow">SHOP BY PHASE</span><h2 id="tiles-heading">Start with <em>where you are.</em></h2></div><p>Each pouch is made for a part of your cycle. Pick your phase, or take both with the set.</p></div>
    <div className="phase-tiles">{tiles.map((t,i)=><Link prefetch={false} key={t.title} href={t.href} className={`phase-tile ${t.img?'':'is-render'}`} style={{'--tile-colour':t.colour} as React.CSSProperties}>
      {t.img?<Image src={`/images/${t.img}.webp`} alt="" fill quality={90} sizes="(max-width: 800px) 50vw, 25vw"/>:<span className="phase-tile-render" aria-hidden="true"><span><Image src="/images/pouch-follicular-v2.png" alt="" fill quality={90} sizes="20vw"/></span><span><Image src="/images/pouch-luteal-v2.png" alt="" fill quality={90} sizes="20vw"/></span></span>}
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

/** Pointer-tracked tilt + spotlight: writes CSS variables, so the visuals stay in CSS. */
function useTilt(){
  const onPointerMove=(e:React.PointerEvent<HTMLElement>)=>{
    if(e.pointerType!=='mouse')return;
    const el=e.currentTarget;const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width;const y=(e.clientY-r.top)/r.height;
    el.style.setProperty('--mx',`${(x*100).toFixed(1)}%`);el.style.setProperty('--my',`${(y*100).toFixed(1)}%`);
    el.style.setProperty('--rx',`${((.5-y)*5).toFixed(2)}deg`);el.style.setProperty('--ry',`${((x-.5)*6).toFixed(2)}deg`);
    el.style.setProperty('--px',`${((x-.5)*-14).toFixed(1)}px`);el.style.setProperty('--py',`${((y-.5)*-10).toFixed(1)}px`);
  };
  const onPointerLeave=(e:React.PointerEvent<HTMLElement>)=>{const el=e.currentTarget;['--rx','--ry','--px','--py'].forEach(v=>el.style.setProperty(v,'0'))};
  return {onPointerMove,onPointerLeave};
}

export function WhyCorra(){
  const tilt=useTilt();
  const set=getProduct('corra-set')!;
  return <section className="section why-corra" id="nutrition" aria-labelledby="why-heading">
    <div className="section-intro collection-head"><div><span className="eyebrow">WHY CORRA</span><h2 id="why-heading">Nutrition made <em>for you.</em></h2></div><p>Two formulas, one simple routine. Everything below comes straight from the product labels.</p></div>
    <div className="why-grid">
      <Link prefetch={false} href="/shop/corra-set" className="why-card why-product" {...tilt}>
        <span className="why-media"><Image src="/images/hero-v2.webp" alt="The Follicular and Luteal pouches on a stone plinth with orange and plum silk" fill quality={90} sizes="(max-width: 800px) 100vw, 58vw"/></span>
        <span className="why-glow"/>
        <span className="why-chip chip-a">25g · Follicular</span><span className="why-chip chip-b">30g · Luteal</span>
        <span className="why-product-copy"><small>YOUR TWO-PACKET RITUAL</small><strong>The Corra set</strong><span>Follicular vanilla + Luteal chocolate · {formatPrice(set.pricePence)}</span></span>
        <span className="why-cta">Shop the set <ArrowUpRight size={16}/></span>
      </Link>
      <article className="why-card why-protein" {...tilt}>
        <span className="why-glow"/>
        <small className="why-kicker">PROTEIN PER SERVING</small>
        <strong className="why-figure"><CountUp to={25}/><i>/</i><CountUp to={30} suffix="g"/></strong>
        <div className="why-bars"><div><span>Follicular · Vanilla</span><b style={{'--fill':25/30} as React.CSSProperties}/><em>25g</em></div><div><span>Luteal · Chocolate</span><b style={{'--fill':1} as React.CSSProperties}/><em>30g</em></div></div>
        <p>Two protein formulas, one for each half of your cycle.</p>
      </article>
      <article className="why-card why-sugar" {...tilt}>
        <span className="why-glow"/>
        <small className="why-kicker">ADDED SUGAR</small>
        <div className="why-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50"/><circle className="ring-run" cx="60" cy="60" r="50"/></svg><strong className="why-figure"><CountUp to={0} suffix="g"/></strong></div>
        <p>In both the vanilla and the chocolate formula.</p>
      </article>
      <article className="why-card why-vitamins" {...tilt}>
        <span className="why-glow"/>
        <small className="why-kicker">VITAMINS &amp; MINERALS</small>
        <strong className="why-figure"><CountUp to={20}/></strong>
        <span className="why-dots" aria-hidden="true">{Array.from({length:20},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}/>)}</span>
        <p>In each formula.</p>
      </article>
      <Link prefetch={false} href="/#phase" className="why-card why-rhythm" {...tilt}>
        <span className="why-media"><Image src="/images/jogging.webp" alt="Woman jogging along the coast at sunrise" fill quality={90} sizes="(max-width: 800px) 100vw, 50vw"/></span>
        <span className="why-shade"/>
        <svg className="why-line" viewBox="0 0 330 70" aria-hidden="true"><path d="M0 52C30 52 34 10 75 20S120 70 164 35 214 12 242 35 290 65 330 18" pathLength={1}/></svg>
        <span className="why-rhythm-copy"><small>GO WITH YOUR RHYTHM</small><strong>Energy through <em>your cycle.</em></strong><span>See which packet fits each phase <ArrowUpRight size={15}/></span></span>
      </Link>
    </div>
  </section>;
}
