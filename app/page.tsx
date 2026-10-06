'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import { ArrowUpRight, Sparkles, Leaf, Heart, CalendarDays, Waves } from 'lucide-react';
import { Navbar, Footer } from '@/components/corra/site-chrome';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { setupMotion } from '@/lib/motion';
import { ContactSection } from '@/components/corra/contact-section';
import { Testimonials } from '@/components/corra/testimonials';
import { testimonials } from '@/lib/testimonials';
import { Pouch } from '@/components/corra/pouch';
import { CTA } from '@/components/corra/cta';
import { ProductExperience } from '@/components/corra/product-experience';
import { Marquee } from '@/components/corra/marquee';
import { ShopCollection, ShopByPhase, StatsBand } from '@/components/corra/home-sections';
import { RhythmExplorer } from '@/components/corra/rhythm-explorer';

const faqs=[
 ['What is Corra?','Corra brings phase-aware protein and cycle tracking together. Follicular and Luteal packets support your nutrition, while the app is designed to help you understand your patterns and packet routine.'],
 ['Why two packets for four phases?','Your cycle has four phases. Corra brings two complementary packets into one routine: Follicular and Luteal. The app helps you keep track of your cycle and know when to switch.'],
 ['How do I know which phase I’m in?','Cycle dates and symptom check-ins help you understand your estimated phase. Every cycle is different. Try the interactive example on this page to see how a daily check-in can work.'],
 ['What’s in the two-packet set?','One 500g Follicular vanilla packet and one 500g Luteal chocolate packet. The Follicular label lists 25g protein; Luteal lists 30g. Both list 0g added sugar and 20 vitamins & minerals.'],
 ['Does Corra have added sugar?','Both the Follicular and Luteal product labels list 0g added sugar. Follicular is vanilla flavour, and Luteal is chocolate flavour.'],
 ['How can I contact Corra?','Use the contact form below for product questions, general inquiries or partnership requests. Choose a topic, share your question and send it to Corra.'],
];
const blur='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTZjOGIxIi8+PC9zdmc+';
function Photo({src,alt,className='',priority=false}:{src:string;alt:string;className?:string;priority?:boolean}) {return <Image src={`/images/${src}.webp`} alt={alt} fill className={className} sizes="(max-width: 700px) 100vw, 90vw" priority={priority} placeholder="blur" blurDataURL={blur}/>}
function BentoGrid({shop}:{shop:()=>void}) {return <section className="section nutrition" id="nutrition"><div className="section-intro"><span className="eyebrow">LESS GUESSWORK. MORE YOU.</span><h2>Nutrition made <em>for you.</em></h2><p>A daily ritual, designed around a body that never stands still.</p></div><div className="bento-grid restored-bento"><article className="bento-card energy-card"><Photo src="jogging" alt="Woman jogging along the coast at sunrise"/><div className="card-scrim"/><div className="card-heading"><span className="eyebrow">GO WITH YOUR RHYTHM</span><h3>Energy through<br/><em>your cycle.</em></h3></div><div className="line-widget"><div><span>Your rhythm, not a straight line.</span><Waves size={18}/></div><svg viewBox="0 0 330 70" aria-label="Illustration of a changing cycle rhythm"><path className="draw-line" d="M0 52C30 52 34 10 75 20S120 70 164 35 214 12 242 35 290 65 330 18" fill="none" stroke="#FBF6EF" strokeWidth="2.5"/></svg><small>AN ILLUSTRATION OF YOUR CHANGING RHYTHM</small></div></article><article className="bento-card rhythm-card"><span className="eyebrow">YOUR CYCLE, CONNECTED</span><h3>A little context.<br/><em>More clarity.</em></h3><div className="bento-checkin"><span>YOUR DAILY CHECK-IN <CalendarDays size={17}/></span><strong>Day 21 <small>Luteal phase</small></strong><div className="mini-app-line"><span/><span/><span/><span className="current"/></div><p>Track your cycle. Know when to switch.</p></div><a href="#app">Try the app experience <ArrowUpRight size={17}/></a></article><article className="bento-card product-card"><span className="eyebrow">YOUR TWO-PACKET RITUAL</span><div className="bento-duo"><Pouch type="follicular"/><Pouch/></div><div className="bento-product-bottom"><div><h3>Your daily <em>duo.</em></h3><p>Vanilla + Chocolate</p></div><button onClick={shop} aria-label="Explore the two-packet Corra set"><ArrowUpRight size={22}/></button></div></article><article className="bento-card ritual-card"><Photo src="yoga" alt="Woman practicing yoga in a sunlit studio"/><div className="card-scrim"/><div className="ritual-copy"><span className="eyebrow">MAKE SPACE FOR YOU</span><h3>A ritual that<br/><em>moves with you.</em></h3></div></article><article className="bento-card nutrient-card"><span className="eyebrow">THOUGHTFUL NUTRITION</span><strong>20</strong><div><h3>Vitamins <em>&amp; minerals.</em></h3><p>In both packets. With 0g added sugar.</p></div></article></div><div className="system-caption"><span>Four cycle phases. Two complementary packets.</span><span>Your rhythm, made easier to follow.</span></div></section>}
function FAQAccordion({contact}:{contact:()=>void}) {return <section className="section faq" id="faq"><div><span className="eyebrow">A LITTLE MORE CLARITY</span><h2><em>Questions?</em><br/>We’re here.</h2><p>How the packets and app work together.</p><CTA onClick={contact}>Contact us</CTA></div><Accordion type="single" collapsible defaultValue="faq-0" className="faq-items">{faqs.map(([q,a],i)=><AccordionItem value={`faq-${i}`} key={q} className="faq-item"><AccordionTrigger>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion></section>}
export default function Home(){
 const router=useRouter();const root=useRef<HTMLDivElement>(null);const [day,setDay]=useState(21);const [symptom,setSymptom]=useState('Energy');
  useEffect(()=>{if(root.current)return setupMotion(root.current)},[]);
 useEffect(()=>{
  type ModelContext={registerTool:(tool:{name:string;title:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>Promise<object>},options:{signal:AbortSignal})=>void|Promise<void>};
  const context=(document as Document & {modelContext?:ModelContext}).modelContext;if(!context)return;
  const lifecycle=new AbortController();
  const paint=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  void Promise.resolve(context.registerTool({name:'configure_cycle_example',title:'Explore Corra cycle example',description:'Change the visible illustrative cycle day and symptom. Does not store health data or provide a diagnosis.',inputSchema:{type:'object',properties:{day:{type:'integer',minimum:1,maximum:28},symptom:{type:'string',enum:['Energy','Mood','Cravings','Sleep']}},required:['day','symptom'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async(input)=>{const value=input as {day?:number;symptom?:string};if(!value||!Number.isInteger(value.day)||value.day!<1||value.day!>28||!['Energy','Mood','Cravings','Sleep'].includes(value.symptom??''))throw new Error('Use a day from 1 to 28 and a supported symptom.');setDay(value.day!);setSymptom(value.symptom!);document.getElementById('app')?.scrollIntoView({behavior:'auto'});await paint();return {day:value.day,symptom:value.symptom,mode:'illustrative example'};}},{signal:lifecycle.signal})).catch(()=>{});
  return()=>lifecycle.abort();
 },[]);

 const openShop=()=>router.push('/shop');

 return <div ref={root}><a href="#shop-collection" className="skip-link">Skip to content</a><Navbar/><main><ProductExperience/><Marquee tone="orange" seconds={36} items={['Phase-aware protein','Follicular · Vanilla','Luteal · Chocolate','0g added sugar','20 vitamins & minerals','Free UK delivery over £50']}/><ShopCollection/><Marquee tone="outline" size="lg" seconds={56} items={['Shop by phase','Follicular','Luteal','The Corra set']}/><ShopByPhase/><Marquee tone="cream" seconds={44} reverse items={['Less guesswork','More you','A ritual that moves with you','Energy through your cycle']}/><BentoGrid shop={openShop}/><section className="shake-section"><div className="shake-photo"><Photo src="shake" alt="Chocolate protein shake and Corra pouch in a sunlit kitchen"/></div><div className="shake-shade"/><div className="shake-copy"><span className="eyebrow">YOUR NEW EVERYDAY</span><h2 className="shake-title">Every phase,<br/><em>supported.</em></h2><p>Follicular vanilla. Luteal chocolate.<br/>Two formulas designed to support your nutrition.</p><div className="actions"><CTA onClick={openShop}>Explore Corra</CTA><CTA secondary href="#phase">Find your phase ＋</CTA></div></div></section><Marquee tone="plum" seconds={42} items={['How Corra works','Pick your phase','Use the right packet','Check in daily','Know when to switch']}/>
<RhythmExplorer day={day} setDay={setDay} symptom={symptom} setSymptom={setSymptom}/>
<Marquee tone="outline" size="lg" seconds={60} reverse items={['25g · 30g protein','0g added sugar','20 vitamins & minerals']}/>
<StatsBand/>
<section className="lifestyle-section"><div className="lifestyle-photo"><Photo src="cozy" alt="Woman enjoying a shake on a beige sofa with Corra on the side table"/></div><div className="lifestyle-shade"/><div className="lifestyle-labels">{[[Leaf,'0g added sugar'],[Waves,'Two phase-aware formulas'],[Heart,'Vanilla + chocolate'],[Sparkles,'20 vitamins & minerals']].map(([Icon,label])=>{const I=Icon as typeof Leaf;return <div key={label as string}><span><I size={20}/></span><h3>{label as string}</h3></div>})}</div></section><Marquee tone="cream" seconds={44} items={['Voices & experiences','In their words','Two flavours','One simple routine']}/>
<Testimonials reviews={testimonials}/>
<Marquee tone="plum" seconds={40} reverse items={['Questions?','We’re here','Ingredients','Delivery','The app']}/><FAQAccordion contact={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}/><ContactSection/><section className="cta-banner"><div className="cta-photo"><Photo src="friends" alt="Three friends laughing together after a workout"/></div><div className="cta-shade"/><div className="cta-copy"><span className="eyebrow">YOUR RHYTHM STARTS HERE</span><h2>Ready to feel<br/><em>in sync?</em></h2><p>Start with the two packets. Get to know your cycle.</p><div className="actions"><CTA onClick={openShop}>Meet Corra</CTA><CTA secondary href="#phase">Find your phase ＋</CTA></div></div></section></main><Footer/>

 </div>
}
