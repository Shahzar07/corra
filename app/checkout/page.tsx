import type {Metadata} from 'next';
import {CheckoutPage} from '@/components/corra/checkout-page';
export const metadata:Metadata={title:'Checkout — Corra',description:'Place your Corra order.',robots:{index:false}};
export default function Page(){return <CheckoutPage/>}
