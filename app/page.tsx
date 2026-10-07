'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import { Navbar, Footer } from '@/components/corra/site-chrome';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { setupMotion } from '@/lib/motion';
import { Testimonials } from '@/components/corra/testimonials';
import { testimonials } from '@/lib/testimonials';
import { CTA } from '@/components/corra/cta';
import { ProductExperience } from '@/components/corra/product-experience';
import { Marquee } from '@/components/corra/marquee';
import { ShopCollection, WhyCorra } from '@/components/corra/home-sections';
import { RhythmExplorer } from '@/components/corra/rhythm-explorer';

const faqs=[
 ['What is Corra?','Corra brings phase-aware protein and cycle tracking together. Follicular and Luteal packets support your nutrition, while the app is designed to help you understand your patterns and packet routine.'],
 ['Why two packets for four phases?','Your cycle has four phases. Corra brings two complementary packets into one routine: Follicular and Luteal. The app helps you keep track of your cycle and know when to switch.'],
 ['How do I know which phase I’m in?','Cycle dates and symptom check-ins help you understand your estimated phase. Every cycle is different. Try the interactive example on this page to see how a daily check-in can work.'],
 ['What’s in the two-packet set?','One 500g Follicular vanilla packet and one 500g Luteal chocolate packet. The Follicular label lists 25g protein; Luteal lists 30g. Both list 0g added sugar and 20 vitamins & minerals.'],
 ['Does Corra have added sugar?','Both the Follicular and Luteal product labels list 0g added sugar. Follicular is vanilla flavour, and Luteal is chocolate flavour.'],
 ['How can I contact Corra?','Use the contact page for product questions, general inquiries or partnership requests. Choose a topic, share your question and send it to Corra.'],
];
const blur='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTZjOGIxIi8+PC9zdmc+';
function Photo({src,alt,className='',priority=false}:{src:string;alt:string;className?:string;priority?:boolean}) {return <Image src={`/images/${src}.webp`} alt={alt} fill className={className} quality={90} sizes="(max-width: 800px) 100vw, 50vw" priority={priority} placeholder="blur" blurDataURL={blur}/>}
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

 return <div ref={root}><a href="#shop-collection" className="skip-link">Skip to content</a><Navbar/><main><ProductExperience/><Marquee tone="orange" seconds={38} items={['Phase-aware protein','Follicular · Vanilla','Luteal · Chocolate','0g added sugar','20 vitamins & minerals','Free UK delivery over £50']}/><ShopCollection/><WhyCorra/><RhythmExplorer day={day} setDay={setDay} symptom={symptom} setSymptom={setSymptom}/><Marquee tone="plum" seconds={44} items={['Voices & experiences','Two flavours','One simple routine','Made for your cycle']}/><Testimonials reviews={testimonials}/><FAQAccordion contact={()=>router.push('/contact')}/><section className="cta-banner" aria-labelledby="cta-heading"><div className="cta-copy"><span className="eyebrow">YOUR RHYTHM STARTS HERE</span><h2 id="cta-heading">Ready to feel<br/><em>in sync?</em></h2><p>Start with the two packets. Get to know your cycle.</p><div className="actions"><CTA onClick={openShop}>Shop the set</CTA><CTA secondary href="#phase">Find your phase</CTA></div></div><div className="cta-photo"><Photo src="friends" alt="Three friends laughing together after a workout"/></div></section></main><Footer/>

 </div>
}
