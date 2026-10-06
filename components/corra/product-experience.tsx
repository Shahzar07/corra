'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CalendarDays, Check, MoveHorizontal, Pause, Play } from 'lucide-react';
import { gsap, SplitText } from '@/lib/animation';
import { scrollToStory } from '@/lib/motion';
import { chapterForProgress, STORY_LABELS, STORY_STOPS } from '@/lib/product-choreography';
import { CTA } from './cta';
import { ProductScene } from './product-scene';

function StoryPhone() {
  return <div className="story-phone" aria-label="Illustrative Corra app check-in for day 21">
    <div className="phone-speaker" aria-hidden="true"/>
    <div className="story-phone-nav"><Image src="/images/wordmark-black.png" alt="Corra" width={84} height={29} unoptimized/><CalendarDays size={18}/></div>
    <span className="phone-greeting">A little clarity, today.</span>
    <div className="phone-dial"><svg viewBox="0 0 240 240" aria-hidden="true">{['#8E1B3A','#9BB58E','#F95006','#6B1D57'].map((color,i)=><circle key={color} cx="120" cy="120" r="94" fill="none" stroke={color} strokeWidth={i===3?13:8} strokeDasharray="126 600" strokeDashoffset={-i*148} transform="rotate(-90 120 120)" opacity={i===3?1:.5}/>)}</svg><div><small>DAY</small><strong>21</strong><span>Luteal phase</span></div></div>
    <div className="phone-packet"><span className="plum-dot"/><div><strong>Your packet, in focus.</strong><span>Luteal · Chocolate</span></div><Check size={16}/></div>
    <a href="#app" className="phone-checkin">Try a daily check-in</a>
    <span className="phone-concept">APP CONCEPT · ILLUSTRATIVE DAY</span>
  </div>;
}

export function ProductExperience() {
  const root=useRef<HTMLDivElement>(null);
  const progress=useRef(0);
  const timelineRef=useRef<gsap.core.Timeline|null>(null);
  const navigationTween=useRef<gsap.core.Tween|null>(null);
  const chapterRange=useRef<{start:number;end:number}|null>(null);
  const activeRef=useRef(0);
  const requestedChapter=useRef(0);
  const navigating=useRef(false);
  const touchStart=useRef<{x:number;y:number}|null>(null);
  const [active,setActive]=useState(0);
  const [paused,setPaused]=useState(false);

  useEffect(()=>{
    if(!root.current)return;
    const element=root.current;
    const media=gsap.matchMedia();
    let cancelled=false;
    let split:SplitText|undefined;
    const userScroll=()=>{navigating.current=false;requestedChapter.current=activeRef.current};
    window.addEventListener('wheel',userScroll,{passive:true});
    const context=gsap.context(()=>{
      media.add({all:'(min-width: 0px)',desktop:'(min-width: 900px)',reduced:'(prefers-reduced-motion: reduce)'},match=>{
        const desktop=!!match.conditions?.desktop;
        const reduced=!!match.conditions?.reduced;
        const previousChapter=activeRef.current;
        const stage=element.querySelector<HTMLElement>('.hero-experience')!;
        const panels=Array.from(element.querySelectorAll<HTMLElement>('.hero-panel'));
        const phone=element.querySelector('.hero-scene-phone')!;
        const reveal=element.querySelector('.story-progress-fill')!;
        const lights=element.querySelectorAll('.phase-light');
        gsap.set(panels,{autoAlpha:0,yPercent:desktop?-50:0,y:24});
        gsap.set(panels[0],{autoAlpha:1,y:0});
        gsap.set(phone,{autoAlpha:0,xPercent:-50,yPercent:-50,y:38,rotationY:-10,rotationZ:-4,scale:.91,transformOrigin:'50% 60%'});
        gsap.set(reveal,{scaleX:0,transformOrigin:'left'});
        gsap.set(lights,{opacity:0});
        progress.current=0;activeRef.current=0;setActive(0);
        requestedChapter.current=0;navigating.current=false;
        const clock={value:0};
        const timeline=gsap.timeline({paused:!(desktop&&!reduced),onUpdate:()=>{
          progress.current=clock.value;
          const chapter=chapterForProgress(clock.value);
          if(!navigating.current)requestedChapter.current=chapter;
          if(chapter!==activeRef.current){activeRef.current=chapter;setActive(chapter)}
        },scrollTrigger:desktop&&!reduced?{
          id:'corra-product-story',trigger:stage,start:'top top',
          end:()=>`+=${Math.round(window.innerHeight*2.8)}`,
          pin:true,scrub:.55,anticipatePin:1,invalidateOnRefresh:true,
          onRefresh:trigger=>{chapterRange.current={start:trigger.start,end:trigger.end}},
        }:undefined});
        timelineRef.current=timeline;
        timeline.to(clock,{value:1,duration:1,ease:'none'},0)
          .to(panels[0],{autoAlpha:0,y:-22,duration:.09,ease:'sine.inOut'},.16)
          .to(panels[1],{autoAlpha:1,y:0,duration:.09,ease:'power2.out'},.245)
          .to(panels[1],{autoAlpha:0,y:-22,duration:.08,ease:'sine.inOut'},.435)
          .to(panels[2],{autoAlpha:1,y:0,duration:.09,ease:'power2.out'},.515)
          .to(panels[2],{autoAlpha:0,y:-22,duration:.08,ease:'sine.inOut'},.725)
          .to(panels[3],{autoAlpha:1,y:0,duration:.09,ease:'power2.out'},.805)
          .to(phone,{autoAlpha:1,y:0,rotationY:0,rotationZ:0,scale:1,duration:.11,ease:'power2.out'},.80)
          .to(lights[0],{opacity:1,duration:.15,ease:'sine.inOut'},.17)
          .to(lights[0],{opacity:0,duration:.15,ease:'sine.inOut'},.43)
          .to(lights[1],{opacity:1,duration:.15,ease:'sine.inOut'},.43)
          .to(lights[1],{opacity:0,duration:.15,ease:'sine.inOut'},.73)
          .to(reveal,{scaleX:1,duration:1,ease:'none'},0);
        if(!(desktop&&!reduced))timeline.progress(STORY_STOPS[previousChapter]);
        return()=>{
          navigationTween.current?.kill();timelineRef.current=null;
          progress.current=0;chapterRange.current=null;
        };
      });
      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        gsap.from('.hero-product-scene',{opacity:0,duration:1.15,ease:'power2.out'});
        document.fonts.ready.then(()=>{
          if(cancelled)return;
          context.add(()=>{
            split=SplitText.create(element.querySelector('.hero-title')!,{type:'words',mask:'words',autoSplit:false});
            gsap.from(split.words,{yPercent:104,duration:.9,stagger:.045,ease:'power3.out'});
            gsap.from(element.querySelectorAll('.hero-intro-copy .eyebrow,.hero-intro-copy>p,.hero-intro-copy .actions,.hero-flavours'),{opacity:0,y:12,duration:.8,stagger:.07,delay:.2,ease:'power3.out'});
          });
        });
      }
    },element);
    return()=>{cancelled=true;window.removeEventListener('wheel',userScroll);navigationTween.current?.kill();split?.revert();media.revert();context.revert()};
  },[]);

  function goToChapter(index:number) {
    const next=(index+STORY_STOPS.length)%STORY_STOPS.length;
    requestedChapter.current=next;navigating.current=true;
    const finish=()=>{navigating.current=false;requestedChapter.current=activeRef.current};
    const range=chapterRange.current;
    if(range){scrollToStory(range.start+(range.end-range.start)*STORY_STOPS[next],finish);return}
    const timeline=timelineRef.current;
    if(!timeline){finish();return}
    navigationTween.current?.kill();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){timeline.progress(STORY_STOPS[next]);finish()}
    else navigationTween.current=timeline.tweenTo(STORY_STOPS[next],{duration:1.05,ease:'power2.inOut',onComplete:finish});
  }

  return <div ref={root} className="product-experience">
    <section className="hero hero-experience" id="top" data-chapter={active} aria-label="Corra product story" aria-roledescription="carousel"
      onPointerDown={event=>{if(event.pointerType==='touch'&&!(event.target as Element).closest('button,a')){navigating.current=false;requestedChapter.current=activeRef.current;touchStart.current={x:event.clientX,y:event.clientY}}}}
      onPointerUp={event=>{const start=touchStart.current;touchStart.current=null;if(start&&Math.abs(event.clientX-start.x)>55&&Math.abs(event.clientY-start.y)<70)goToChapter(requestedChapter.current+(event.clientX<start.x?1:-1))}}
      onPointerCancel={()=>{touchStart.current=null}}>
      <div className="product-light" aria-hidden="true"/><div className="phase-light phase-light-follicular" aria-hidden="true"/><div className="phase-light phase-light-luteal" aria-hidden="true"/>
      <div className="product-stage-word" aria-hidden="true">in sync.</div>
      <ProductScene progress={progress} paused={paused} chapter={active}/>
      <div className="hero-panel hero-copy hero-intro-copy" aria-hidden={active!==0} inert={active!==0}>
        <span className="eyebrow">PHASE-AWARE PROTEIN / FOLLICULAR + LUTEAL</span>
        <h1 className="hero-title">Less chaos.<br/><em>More in sync.</em></h1>
        <p>Two protein formulas for your cycle. An app concept to help you know when to switch.</p>
        <div className="actions"><CTA href="/shop/corra-set">Meet your set</CTA><CTA secondary href="#app">Explore the app</CTA></div>
        <div className="hero-flavours"><span><i className="orange-dot"/>Follicular · Vanilla</span><span><i className="plum-dot"/>Luteal · Chocolate</span></div>
      </div>
      <div className="hero-panel hero-formula-copy follicular-copy" aria-hidden={active!==1} inert={active!==1}>
        <span className="eyebrow"><i className="orange-dot"/>01 / THE FOLLICULAR PACKET</span>
        <h2>Follicular.<br/><em>Vanilla.</em></h2>
        <p>A vanilla formula designed to support your Follicular nutrition.</p>
        <div className="packet-focus-stats"><strong>25g <small>protein</small></strong><span>0g added sugar<br/>20 vitamins &amp; minerals</span></div>
        <span className="packet-flavour-note">VANILLA FLAVOUR · 500G</span>
        <CTA href="/shop/follicular">Explore Follicular</CTA>
      </div>
      <div className="hero-panel hero-formula-copy luteal-copy" aria-hidden={active!==2} inert={active!==2}>
        <span className="eyebrow"><i className="plum-dot"/>02 / THE LUTEAL PACKET</span>
        <h2>Luteal.<br/><em>Chocolate.</em></h2>
        <p>A chocolate formula designed to support your Luteal nutrition.</p>
        <div className="packet-focus-stats"><strong>30g <small>protein</small></strong><span>0g added sugar<br/>20 vitamins &amp; minerals</span></div>
        <span className="packet-flavour-note">CHOCOLATE FLAVOUR · 500G</span>
        <CTA href="/shop/luteal">Explore Luteal</CTA>
      </div>
      <div className="hero-panel hero-app-copy" aria-hidden={active!==3} inert={active!==3}>
        <span className="eyebrow">03 / FROM CHAOS TO CLARITY</span>
        <h2>Your rhythm.<br/><em>All connected.</em></h2>
        <p>Two complementary packets. One place to understand your routine.</p>
        <ul className="hero-story-steps"><li><span>01</span>Track your cycle.</li><li><span>02</span>Notice your patterns.</li><li><span>03</span>Know when to switch.</li></ul>
        <CTA href="#app">Try the app experience</CTA>
      </div>
      <div className="hero-scene-phone" aria-hidden={active!==3} inert={active!==3}><StoryPhone/></div>
      <div className="product-interaction-hint" aria-hidden="true"><MoveHorizontal size={14}/><span>Move to explore</span></div>
      <div className="hero-experience-bottom">
        <div className="story-navigation" aria-label="Product story chapters" onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();goToChapter(requestedChapter.current+(event.key==='ArrowRight'?1:-1))}}}>
          {STORY_LABELS.map((name,index)=><button key={name} onClick={()=>goToChapter(index)} className={active===index?'active':''} aria-current={active===index?'step':undefined}><span>0{index+1}</span>{name}</button>)}
          <div className="story-progress" aria-hidden="true"><span className="story-progress-fill"/></div>
        </div>
        <span className="hero-scroll-invitation">SCROLL THROUGH THE STORY <span>↓</span></span>
        <div className="story-transport"><button onClick={()=>goToChapter(requestedChapter.current-1)} aria-label="Previous product chapter"><ArrowLeft size={17}/></button><button onClick={()=>goToChapter(requestedChapter.current+1)} aria-label="Next product chapter"><ArrowRight size={17}/></button><button className="product-motion-toggle" onClick={()=>setPaused(value=>!value)} aria-pressed={paused} aria-label={paused?'Resume floating product motion':'Pause floating product motion'}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></div>
      </div>
      <span className="sr-only" aria-live="polite">{STORY_LABELS[active]} · Chapter {active+1} of 4</span>
    </section>
  </div>;
}
