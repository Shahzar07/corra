import type {Metadata} from 'next';
import {CartPage} from '@/components/corra/cart-page';
export const metadata:Metadata={title:'Your cart — Corra',description:'Review the Corra formulas in your cart.',robots:{index:false}};
export default function Page(){return <CartPage/>}
