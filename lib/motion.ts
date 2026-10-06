'use client';
import {gsap, ScrollTrigger} from '@/lib/animation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
let pageScroller:Lenis|undefined;
export function scrollToStory(position:number,onComplete?:()=>void){
 if(pageScroller)pageScroller.scrollTo(position,{duration:1.1,onComplete});
 else {window.scrollTo({top:position,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});onComplete?.()}
}
export function setupMotion(root:HTMLElement){
 const ctx=gsap.context(()=>{} ,root);const mm=gsap.matchMedia();let lenis:Lenis|undefined;let ticker:((time:number)=>void)|undefined;
 ctx.add(()=>mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const desktop=window.innerWidth>800;
  lenis=new Lenis({duration:.9,smoothWheel:true,anchors:true,prevent:(node)=>!!node.closest('[data-slot="dialog-content"], [data-slot="sheet-content"]')});
  pageScroller=lenis;
  lenis.on('scroll',ScrollTrigger.update);ticker=(t)=>lenis?.raf(t*1000);gsap.ticker.add(ticker);
  gsap.from(root.querySelector('.navbar'),{y:-12,opacity:0,duration:.7});
  root.querySelectorAll<HTMLElement>('.section-intro,.bento-card,.phase-card,.science-grid>article,.faq,.app-demo,.contact-copy,.contact-form').forEach(el=>gsap.from(el,{y:desktop?24:10,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}}));
  root.querySelectorAll<SVGPathElement>('.draw-line').forEach(path=>{const length=path.getTotalLength();gsap.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:path.closest('.bento-card'),start:'top 85%',once:true}})});
  gsap.from(root.querySelectorAll('.ring-segment'),{strokeDasharray:'0 1081',stagger:.1,duration:1,scrollTrigger:{trigger:root.querySelector('.cycle-visual'),start:'top 90%',once:true}});
  gsap.from(root.querySelector('.cycle-app'),{y:25,opacity:0,duration:1,scrollTrigger:{trigger:root.querySelector('.cycle-visual'),start:'top 90%',once:true}});
  if(desktop){root.querySelectorAll<HTMLElement>('.shake-photo,.lifestyle-photo,.cta-photo').forEach(el=>{const img=el.querySelector('img');if(img)gsap.fromTo(img,{scale:1.08,yPercent:-2},{scale:1.08,yPercent:2,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:.7}})});}
  gsap.from(root.querySelector('.cta-banner'),{scale:.98,duration:.9,scrollTrigger:{trigger:root.querySelector('.cta-banner'),start:'top 95%',once:true}});
  let disposed=false;const refresh=()=>{if(!disposed)ScrollTrigger.refresh()};window.addEventListener('load',refresh);document.fonts.ready.then(refresh);
  return()=>{disposed=true;window.removeEventListener('load',refresh);if(ticker)gsap.ticker.remove(ticker);if(pageScroller===lenis)pageScroller=undefined;lenis?.destroy()};
 }));
 return()=>{mm.revert();ctx.revert()};
}
