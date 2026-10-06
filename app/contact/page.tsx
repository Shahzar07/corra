import type {Metadata} from 'next';
import {ContactPage} from '@/components/corra/contact-page';
export const metadata:Metadata={title:'Contact Corra',description:'Ask about Corra protein formulas, availability, the app or partnerships.'};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const query=await searchParams;
  const message=typeof query.message==='string'?query.message.slice(0,3000):'';
  return <ContactPage message={message}/>;
}
