'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {ArrowUpRight,ChevronDown,Menu,X,Mail,ShoppingBag} from 'lucide-react';
import {products,formatPrice} from '@/lib/products';
import {FREE_DELIVERY_THRESHOLD_PENCE} from '@/lib/pricing';
import {Pouch} from './pouch';
import {Marquee} from './marquee';
import {socials} from '@/lib/site';
import {useCartCount,useCartReady} from '@/lib/cart';
function CartLink(){
 const count=useCartCount();const ready=useCartReady();const shown=ready&&count>0;
 return <Link prefetch={false} href="/cart" className="icon-button cart-link" aria-label={shown?`Cart, ${count} ${count===1?'item':'items'}`:'Cart'}><ShoppingBag size={20}/>{shown&&<span className="cart-count" aria-hidden="true">{count>9?'9+':count}</span>}</Link>
}
function ShopMenu(){
 return <div className="mega-menu" role="group" aria-label="Shop Corra">
  <div className="mega-products">{products.map(p=><Link prefetch={false} key={p.id} href={`/shop/${p.id}`} className="mega-product" style={{'--product-tint':p.tint,'--product-colour':p.colour} as React.CSSProperties}>
   <span className={`mega-art ${p.id==='corra-set'?'is-duo':''}`}>{p.id!=='luteal'&&<Pouch type="follicular"/>}{p.id!=='follicular'&&<Pouch/>}{p.id==='corra-set'&&<em className="mega-badge">Best value</em>}</span>
   <span className="mega-info"><strong>{p.name}</strong><small>{p.subtitle}</small><b>{formatPrice(p.pricePence)}</b></span>
  </Link>)}</div>
  <div className="mega-aside"><span className="eyebrow">NOT SURE WHERE TO START?</span><p>Find your phase, then match it to the right packet.</p><Link prefetch={false} href="/#phase" className="text-link">Find your phase <ArrowUpRight size={14}/></Link><Link prefetch={false} href="/shop" className="pill mega-all"><span>Shop all</span><span className="button-arrow"><ArrowUpRight size={16}/></span></Link></div>
 </div>
}
export function AnnouncementBar(){
 return <Marquee size="sm" tone="plum" seconds={46} label="Corra announcements" items={[`Free UK delivery over ${formatPrice(FREE_DELIVERY_THRESHOLD_PENCE)}`,'Two phase-aware protein formulas','0g added sugar','20 vitamins & minerals','Follicular vanilla · Luteal chocolate','Save with the two-packet set']}/>
}
export function Navbar(){
 const path=usePathname();const [openPath,setOpenPath]=useState<string|null>(null);const menu=openPath!==null&&openPath===path;
 const [scrolled,setScrolled]=useState(false);const [hidden,setHidden]=useState(false);
 useEffect(()=>{if(!menu)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpenPath(null)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[menu]);
 useEffect(()=>{
  let last=window.scrollY;let frame=0;
  const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const y=window.scrollY;setScrolled(y>40);setHidden(y>240&&y>last+2);if(y<last-2||y<=240)setHidden(false);last=y})};
  window.addEventListener('scroll',onScroll,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll)};
 },[]);
 const links=[['About Corra','/about'],['How it works','/#phase'],['Science','/#science'],['Contact','/contact']];
 return <>
 <AnnouncementBar/>
 <header className={`navbar site-navbar ${scrolled?'is-scrolled':''} ${hidden&&!menu?'is-hidden':''}`}>
  <nav className="nav-left" aria-label="Main navigation">
   <div className="nav-shop"><Link prefetch={false} href="/shop" aria-current={path.startsWith('/shop')?'page':undefined} aria-haspopup="true">Shop <ChevronDown size={14} className="nav-chevron"/></Link><ShopMenu/></div>
   {links.map(([name,url])=><Link prefetch={false} href={url} key={url} aria-current={path===url?'page':undefined}>{name}</Link>)}
  </nav>
  <button className="mobile-menu icon-button" aria-label={menu?'Close menu':'Open menu'} aria-controls="corra-mobile-nav" aria-expanded={menu} onClick={()=>setOpenPath(menu?null:path)}>{menu?<X size={22}/>:<Menu size={22}/>}</button>
  <Link prefetch={false} className="nav-logo" href="/" aria-label="Corra home"><Image className="wordmark" src="/images/wordmark-black.png" width={190} height={64} alt="Corra" priority/></Link>
  <div className="nav-right"><Link prefetch={false} href="/contact" className="icon-button nav-contact" aria-label="Contact Corra"><Mail size={20}/></Link><CartLink/><Link prefetch={false} className="small-pill" href="/shop">Shop now</Link></div>
  {menu&&<nav id="corra-mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
   <div className="mobile-products">{products.map(p=><Link prefetch={false} key={p.id} href={`/shop/${p.id}`} onClick={()=>setOpenPath(null)} style={{'--product-tint':p.tint} as React.CSSProperties}><span className={`mega-art ${p.id==='corra-set'?'is-duo':''}`}>{p.id!=='luteal'&&<Pouch type="follicular"/>}{p.id!=='follicular'&&<Pouch/>}</span><strong>{p.id==='corra-set'?'The set':p.name}</strong><small>{formatPrice(p.pricePence)}</small></Link>)}</div>
   {[['Shop all','/shop'],...links,['Your cart','/cart']].map(([name,url])=><Link prefetch={false} key={url} href={url} onClick={()=>setOpenPath(null)}>{name}<ArrowUpRight size={17}/></Link>)}
  </nav>}
 </header>
 </>
}
const socialPaths:Record<string,string>={
 facebook:'M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3Z',
 instagram:'M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.8S17.4 3 15.9 2.9C14.4 2.8 9.6 2.8 8.1 2.9c-1.5.1-2.8.4-3.8 1.4S3 6.6 2.9 8.1c-.1 1.5-.1 6.3 0 7.8.1 1.5.4 2.8 1.5 3.8s2.3 1.3 3.8 1.4c1.5.1 6.3.1 7.8 0 1.5-.1 2.8-.4 3.8-1.4s1.4-2.3 1.4-3.8c.1-1.5.1-6.3 0-7.8Zm-2 9.4a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3a3 3 0 0 1 1.7-1.7C7.9 4.7 10.7 4.8 12 4.8s4.1-.1 5.3.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3Z',
 whatsapp:'M17.5 14.4c-.3-.2-1.8-.9-2-1s-.5-.1-.7.2-.8 1-.9 1.1-.3.2-.6.1a7.5 7.5 0 0 1-3.7-3.3c-.3-.5.3-.4.8-1.4.1-.2 0-.3 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.5 13.5 0 0 0 5.2 4.6c1.9.8 2.7.9 3.6.7a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.9L.1 24l6.3-1.7a11.8 11.8 0 0 0 5.6 1.4A11.9 11.9 0 0 0 20.4 3.6Z',
 x:'M17.8 3h3.1l-6.8 7.8 8 10.6h-6.3l-4.9-6.4L5.3 21.4H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9L17.8 3Zm-1.1 16.5h1.7L7.4 4.8H5.5l11.2 14.7Z',
};
function SocialLinks(){return <ul className="footer-socials" aria-label="Corra on social media">{socials.map(s=><li key={s.id}><a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Corra on ${s.label}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={socialPaths[s.id]}/></svg></a></li>)}</ul>}
export function Footer(){return <footer className="footer"><div className="footer-upper"><div className="footer-brand"><Link prefetch={false} href="/" aria-label="Corra home"><Image className="circle-logo" src="/images/logo-original.png" width={125} height={125} alt="Corra"/></Link><h3>Less chaos.<br/><em>More clarity.</em></h3><p>Two protein formulas.<br/>Connected to your cycle.</p></div><div className="footer-col"><span>EXPLORE</span><Link prefetch={false} href="/shop">Shop Corra</Link><Link prefetch={false} href="/shop/corra-set">The two-packet set</Link><Link prefetch={false} href="/shop/follicular">Follicular · Vanilla</Link><Link prefetch={false} href="/shop/luteal">Luteal · Chocolate</Link></div><div className="footer-col"><span>CORRA</span><Link prefetch={false} href="/about">About us</Link><Link prefetch={false} href="/#app">The Corra app</Link><Link prefetch={false} href="/#science">Our formula</Link><Link prefetch={false} href="/#faq">FAQs</Link><Link prefetch={false} href="/contact">Contact us</Link></div><div className="footer-invitation"><span className="eyebrow">LET’S CONNECT</span><p>A question?<br/><em>We’re listening.</em></p><Link prefetch={false} href="/contact">Talk to Corra <ArrowUpRight size={20}/></Link></div></div><div className="footer-divider"><span>© {new Date().getFullYear()} Corra.</span><span>CHAOS → CORRA → CLARITY</span><SocialLinks/></div><div className="footer-landscape"><Image src="/images/footer-v2.webp" alt="The two Corra protein pouches in a sculptural orange and plum landscape" fill quality={90} sizes="(max-width: 1700px) 100vw, 1672px"/></div><div className="footer-credit"><span>Powered by <strong>Eagle Studio</strong> 2026</span></div></footer>}
