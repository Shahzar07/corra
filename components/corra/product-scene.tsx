'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animation';
import { sampleProductMotion, type ProductMotion } from '@/lib/product-choreography';
import type { ProductWorld } from '@/lib/product-world';
import { Pouch } from './pouch';

export function ProductScene({progress,paused,chapter,gallery}:{progress:{current:number};paused:boolean;chapter:number;gallery?:'corra-set'|'follicular'|'luteal'}) {
  const host=useRef<HTMLDivElement>(null);
  const fallback=useRef<HTMLDivElement>(null);
  const pause=useRef(paused);
  const drawOnce=useRef<(()=>void)|null>(null);
  useEffect(()=>{pause.current=paused;drawOnce.current?.()},[paused,chapter]);

  useEffect(()=>{
    if(!host.current||!fallback.current)return;
    const scene=host.current;
    const artwork=fallback.current;
    const stage=scene.closest<HTMLElement>('.hero-experience')!;
    const sample=()=>{const value=sampleProductMotion(progress.current,stage.clientWidth<900);if(gallery){value.framing='gallery';value.phone=0;value.orbit=gallery==='follicular'?.25:gallery==='luteal'?.8:-.18;value.packets.forEach((pose,index)=>{const duo=gallery==='corra-set';const shown=duo||(gallery==='follicular'?index===0:index===1);pose.x=shown?(duo?(index===0?.35:.68):.5):3;pose.y=duo?(index===0?.46:.54):.49;pose.height=shown?(duo?Math.min(.65,stage.clientWidth/stage.clientHeight*.72):Math.min(.73,stage.clientWidth/stage.clientHeight*1.1)):.001;pose.depth=duo?(index===0?.6:-1.6):.3;pose.rx=-3;pose.ry=index===0?-13:13;pose.rz=duo?(index===0?-9:9):index===0?-5:5})}return value};
    const packets=Array.from(artwork.querySelectorAll<HTMLElement>('.scene-packet'));
    const orbits=Array.from(artwork.querySelectorAll<HTMLElement>('.fallback-orbit'));
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const lifecycle=new AbortController();
    let world:ProductWorld|undefined;
    let visible=true;
    let cancelled=false;
    let width=stage.clientWidth,height=stage.clientHeight;
    let time=0,px=0,py=0,targetX=0,targetY=0;
    let readyAt=0;
    let lastProgress=-1,lastPaused=false;
    let lastMotion:ProductMotion=sample();
    const tick=(_time=0,delta=16.67)=>{
      if(cancelled||!visible||document.hidden)return;
      const reduced=preference.matches;
      const dt=Math.min(delta/1000,.05);
      const frozen=pause.current||reduced;
      if(!frozen)time+=dt;
      if(frozen){targetX=0;targetY=0}
      const smoothing=1-Math.exp(-dt*7);
      px+=(targetX-px)*smoothing;py+=(targetY-py)*smoothing;
      if(frozen&&lastPaused===frozen&&lastProgress===progress.current&&Math.abs(px)+Math.abs(py)<.0001)return;
      lastPaused=frozen;lastProgress=progress.current;
      const motion=sample();
      const drawFallback=scene.dataset.ready!=='true'||performance.now()-readyAt<700;
      motion.packets.forEach((pose,index)=>{
        // Floating is additive to the authored pose; scrolling never lags behind
        // copy or the phone. A pause freezes only this ambient layer.
        const bob=Math.sin(time*.52+index*2.2)*.006;
        pose.y+=bob;
        pose.x+=px*.004;
        pose.rx+=py*2.2;
        pose.ry+=px*5;
        pose.rz+=Math.sin(time*.36+index*2.1)*.65;
        if(drawFallback){
          const packet=packets[index];
          const mobile=width<900;
          const baseX=mobile?(index===0?.37:.69):(index===0?.66:.84);
          const baseY=mobile?(index===0?.73:.77):(index===0?.45:.51);
          packet.style.height=`${pose.height*height}px`;
          packet.style.width=`${pose.height*height*.65}px`;
          packet.style.transform=`translate3d(${(pose.x-baseX)*width}px,${(pose.y-baseY)*height}px,${pose.depth*15}px) translate(-50%,-50%) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg)`;
        }
      });
      if(drawFallback)orbits.forEach((orbit,index)=>{orbit.style.transform=`translate(-50%,-50%) rotate(${motion.orbit*22+(index?19:-17)}deg) rotateX(${index?54:61}deg)`});
      lastMotion=motion;
      world?.draw(motion,width,height);
    };
    drawOnce.current=()=>{lastProgress=-1;tick()};
    const resize=new ResizeObserver(()=>{
      width=stage.clientWidth;height=stage.clientHeight;lastProgress=-1;tick();
    });
    resize.observe(stage);
    const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){lastProgress=-1;tick()}},{rootMargin:'100px'});
    visibility.observe(stage);
    const move=(event:PointerEvent)=>{
      if(event.pointerType!=='mouse'||pause.current||preference.matches)return;
      const rect=stage.getBoundingClientRect();
      targetX=(event.clientX-rect.left)/rect.width*2-1;
      targetY=(event.clientY-rect.top)/rect.height*2-1;
    };
    const leave=()=>{targetX=0;targetY=0};
    const resume=()=>{lastProgress=-1;tick()};
    let loading=false;
    async function setupWorld(){
      if(cancelled||preference.matches||world||loading)return;
      loading=true;
      try{
        const {createProductWorld}=await import('@/lib/product-world');
        if(cancelled||preference.matches)return;
        const instance=await createProductWorld(scene,{signal:lifecycle.signal,onContextLost:()=>{world=undefined;scene.dataset.ready='false';lastProgress=-1;tick()}});
        if(cancelled||preference.matches){instance.dispose();return}
        world=instance;
        world.draw(lastMotion,width,height);
        readyAt=performance.now();
        scene.dataset.ready='true';
      }catch{scene.dataset.ready='false'}finally{loading=false}
    }
    const changePreference=()=>{
      if(preference.matches){world?.dispose();world=undefined;scene.dataset.ready='false'}
      else void setupWorld();
      lastProgress=-1;tick();
    };
    stage.addEventListener('pointermove',move,{passive:true});
    stage.addEventListener('pointerleave',leave);
    document.addEventListener('visibilitychange',resume);
    preference.addEventListener('change',changePreference);
    gsap.ticker.add(tick);
    tick();void setupWorld();
    return()=>{
      cancelled=true;lifecycle.abort();world?.dispose();drawOnce.current=null;
      gsap.ticker.remove(tick);resize.disconnect();visibility.disconnect();
      stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);
      document.removeEventListener('visibilitychange',resume);preference.removeEventListener('change',changePreference);
      scene.dataset.ready='false';
    };
  },[progress,gallery]);

  return <div className="hero-product-scene" data-gallery={gallery} role="img" aria-label={gallery==='follicular'?'Corra Follicular vanilla pouch in a lit 3D product display':gallery==='luteal'?'Corra Luteal chocolate pouch in a lit 3D product display':'Corra Follicular vanilla and Luteal chocolate pouches in a sculptural product display'}>
    <div className="product-webgl" ref={host} data-ready="false"/>
    <div className="hero-pouch-fallback" ref={fallback} aria-hidden="true">
      <div className="fallback-orbit orbit-orange"/><div className="fallback-orbit orbit-plum"/>
      <div className="scene-packet scene-packet-follicular"><Pouch type="follicular" priority/></div>
      <div className="scene-packet scene-packet-luteal"><Pouch priority/></div>
    </div>
  </div>;
}
