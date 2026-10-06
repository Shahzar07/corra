'use client';
import {useEffect,useRef} from 'react';
import {gsap,ScrollTrigger,SplitText} from '@/lib/animation';
import Lenis from 'lenis';
import {usePathname} from 'next/navigation';
import 'lenis/dist/lenis.css';
import {Navbar,Footer} from './site-chrome';
export function PageShell({children,className=''}:{children:React.ReactNode;className?:string}){
 const root=useRef<HTMLDivElement>(null);const pathname=usePathname();
 useEffect(()=>{
  if(!root.current)return;
  const el=root.current;const mm=gsap.matchMedia();const ctx=gsap.context(()=>{mm.add('(prefers-reduced-motion: no-preference)',()=>{
   const lenis=new Lenis({duration:.85,smoothWheel:true,anchors:true});const tick=(t:number)=>lenis.raf(t*1000);gsap.ticker.add(tick);lenis.on('scroll',ScrollTrigger.update);
   const title=el.querySelector('.inner-title');let split:SplitText|undefined;let disposed=false;
   const revealTitle=()=>{if(disposed||!title)return;ctx.add(()=>{split=new SplitText(title,{type:'words',mask:'words'});gsap.from(split.words,{yPercent:105,stagger:.055,duration:.9,ease:'power3.out'})})};
   document.fonts.ready.then(revealTitle);
   el.querySelectorAll<HTMLElement>('.page-reveal').forEach(item=>gsap.from(item,{y:window.innerWidth<700?12:24,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 94%',once:true}}));
   el.querySelectorAll<HTMLElement>('.editorial-image img').forEach(img=>gsap.fromTo(img,{scale:1.04},{scale:1,ease:'none',scrollTrigger:{trigger:img.parentElement,start:'top bottom',end:'bottom top',scrub:.7}}));
   const refresh=()=>{if(!disposed)ScrollTrigger.refresh()};document.fonts.ready.then(refresh);window.addEventListener('load',refresh);
   return()=>{disposed=true;split?.revert();window.removeEventListener('load',refresh);gsap.ticker.remove(tick);lenis.destroy()};
  })},el);
  return()=>{mm.revert();ctx.revert()};
 },[pathname]);
 return <div ref={root} className={`inner-page ${className}`}><a className="skip-link" href="#page-content">Skip to content</a><Navbar/><main id="page-content">{children}</main><Footer/></div>
}
