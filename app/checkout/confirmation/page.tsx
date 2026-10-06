import type {Metadata} from 'next';
import {OrderConfirmation} from '@/components/corra/order-confirmation';
export const metadata:Metadata={title:'Order received — Corra',description:'Thank you for your Corra order.',robots:{index:false}};
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const query=await searchParams;
  const reference=typeof query.order==='string'&&/^CR-[0-9A-Z]{8}$/.test(query.order)?query.order:'';
  return <OrderConfirmation reference={reference}/>;
}
