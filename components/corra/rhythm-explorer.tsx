'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,CalendarDays,Check,Leaf,Moon,Repeat,Sun,Waves} from 'lucide-react';
import {getProduct,formatPrice} from '@/lib/products';
import {Pouch} from './pouch';
import {AddToCart} from './cart-controls';

export const phases=[
 {name:'Menstrual',days:'Days 1–5',start:1,end:5,color:'#8E1B3A',tint:'#ecd8d8',note:'Check in as your cycle begins.',detail:'Your cycle begins. Make space for rest and check in with how you feel.',icon:Waves},
 {name:'Follicular',days:'Days 6–13',start:6,end:13,color:'#9BB58E',tint:'#dce6d5',note:'Notice what changes after your period.',detail:'The phase before ovulation. Track your own rhythm as your cycle moves forward.',icon:Leaf},
 {name:'Ovulatory',days:'Days 14–16',start:14,end:16,color:'#F95006',tint:'#ffe3d3',note:'Get to know the middle of your cycle.',detail:'Around the middle of a cycle. Your timing can vary, so keep listening to your body.',icon:Sun},
 {name:'Luteal',days:'Days 17–28',start:17,end:28,color:'#6B1D57',tint:'#ead9e6',note:'Follow your patterns after ovulation.',detail:'The phase after ovulation. Notice patterns in your mood, energy and daily routine.',icon:Moon},
];
export const phaseForDay=(day:number)=>day<=5?0:day<=13?1:day<=16?2:3;
export const SYMPTOMS=['Energy','Mood','Cravings','Sleep'] as const;
const symptomText:Record<string,string>={Energy:'Notice your energy today. Record a check-in and look for changes over time.',Mood:'Log how you feel today. Compare your mood check-ins across your cycle.',Cravings:'Record what you’re craving alongside your cycle day. Your own notes help you notice patterns.',Sleep:'Note how you slept last night. Track your rest alongside your cycle dates.'};

export function RhythmExplorer({day,setDay,symptom,setSymptom}:{day:number;setDay:(d:number)=>void;symptom:string;setSymptom:(s:string)=>void}){
  const index=phaseForDay(day);const p=phases[index];const Icon=p.icon;
  const packet=getProduct(index===3?'luteal':'follicular')!;
  const switchHint=index===3?'Switch back to Follicular when your next cycle begins.':`Switch to Luteal around day 17${day<17?` · ${17-day} ${17-day===1?'day':'days'} to go`:''}.`;
  const progress=(day-1)/27;
  return <section className="section explorer" id="phase" aria-labelledby="explorer-heading" style={{'--phase-color':p.color,'--phase-tint':p.tint} as React.CSSProperties}>
    <div className="explorer-head section-intro">
      <div><span className="eyebrow">HOW CORRA WORKS</span><h2 id="explorer-heading">Find your phase. <em>Know your packet.</em></h2></div>
      <ol className="explorer-steps"><li><span>01</span>Pick a day in your cycle</li><li><span>02</span>See the packet for that phase</li><li><span>03</span>Check in with how you feel</li></ol>
    </div>

    <div className="phase-tabs" role="group" aria-label="Cycle phases">{phases.map((ph,i)=>{const I=ph.icon;return <button key={ph.name} type="button" className={`phase-tab ${i===index?'is-active':''}`} aria-pressed={i===index} onClick={()=>setDay(i===index?day:[3,9,15,21][i])} style={{'--tab-color':ph.color} as React.CSSProperties}><span className="phase-tab-icon"><I size={18}/></span><span><strong>{ph.name}</strong><small>{ph.days}*</small></span></button>})}</div>

    <div className="cycle-timeline" style={{'--progress':progress} as React.CSSProperties}>
      <div className="timeline-track" aria-hidden="true">{phases.map((ph,i)=><span key={ph.name} className={i===index?'is-active':''} style={{flexGrow:ph.end-ph.start+1,background:ph.color}}/>)}</div>
      <span className="timeline-marker" aria-hidden="true"><b>Day {day}</b></span>
      <label className="sr-only" htmlFor="cycle-day">Cycle day</label>
      <input id="cycle-day" type="range" min={1} max={28} step={1} value={day} onChange={e=>setDay(Number(e.target.value))} aria-valuetext={`Day ${day}, ${p.name} phase`}/>
      <div className="timeline-scale" aria-hidden="true"><span>Day 1</span><span>7</span><span>14</span><span>21</span><span>28</span></div>
    </div>

    <div className="explorer-panels" id="app">
      <article className="explorer-card explorer-phase" aria-live="polite">
        <Image key={p.name} src={`/images/portrait-${p.name.toLowerCase()}.webp`} alt={`Portrait for the ${p.name.toLowerCase()} phase`} fill sizes="(max-width: 900px) 100vw, 33vw"/>
        <span className="explorer-phase-shade"/>
        <div className="explorer-phase-copy"><span className="explorer-pill"><Icon size={15}/>{p.days}*</span><h3>{p.name} <em>phase.</em></h3><p>{p.detail}</p></div>
      </article>

      <article className="explorer-card explorer-packet" style={{'--product-tint':packet.tint,'--product-colour':packet.colour} as React.CSSProperties}>
        <span className="eyebrow">YOUR PACKET FOR THIS PHASE</span>
        <div className="explorer-packet-art"><Pouch key={packet.id} type={packet.id==='luteal'?'luteal':'follicular'}/></div>
        <div className="explorer-packet-info"><div><h3>{packet.name}</h3><p>{packet.flavour} · {packet.protein} protein · {packet.weight}</p></div><strong>{formatPrice(packet.pricePence)}</strong></div>
        <p className="explorer-switch"><Repeat size={15}/>{switchHint}</p>
        <AddToCart product={packet} compact/>
        <Link prefetch={false} href="/shop/corra-set" className="text-link">Get both with the set · save {formatPrice(getProduct('follicular')!.pricePence+getProduct('luteal')!.pricePence-getProduct('corra-set')!.pricePence)} <ArrowUpRight size={14}/></Link>
      </article>

      <article className="explorer-card explorer-app">
        <div className="explorer-app-top"><span className="eyebrow">YOUR DAILY CHECK-IN</span><span className="demo-badge">APP CONCEPT</span></div>
        <div className="mini-dial"><svg viewBox="0 0 120 120" aria-hidden="true">{phases.map((ph,i)=>{const len=(ph.end-ph.start+1)/28*326.7;const offset=(ph.start-1)/28*326.7;return <circle key={ph.name} cx="60" cy="60" r="52" fill="none" stroke={ph.color} strokeWidth={i===index?10:6} opacity={i===index?1:.25} strokeDasharray={`${len-3} 326.7`} strokeDashoffset={-offset} transform="rotate(-90 60 60)"/>})}<circle cx={60+52*Math.sin(progress*2*Math.PI*27/28)} cy={60-52*Math.cos(progress*2*Math.PI*27/28)} r="6" fill="#fbf6ef" stroke={p.color} strokeWidth="3"/></svg><div><small>DAY</small><strong>{day}</strong><span>{p.name}</span></div></div>
        <span className="demo-label"><CalendarDays size={14}/>What are you checking in on?</span>
        <div className="symptom-options">{SYMPTOMS.map(s=><button key={s} type="button" aria-pressed={s===symptom} className={s===symptom?'selected':''} onClick={()=>setSymptom(s)}>{s}</button>)}</div>
        <p className="explorer-response" aria-live="polite"><Check size={15}/>{symptomText[symptom]}</p>
      </article>
    </div>
    <p className="explorer-disclaimer">*Illustrative 28-day cycle; your timing may differ. Interactive example only: the packet schedule is illustrative and cycle estimates are not diagnostic. Follow the instructions on your packet.</p>
  </section>;
}
