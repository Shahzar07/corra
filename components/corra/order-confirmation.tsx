'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {Check,Mail} from 'lucide-react';
import {formatPrice} from '@/lib/products';
import {cart} from '@/lib/cart';
import {PageShell} from './page-shell';
import {CTA} from './cta';
import {LAST_ORDER_KEY,type LastOrder} from './checkout-page';

let cached:{raw:string|null;value:LastOrder|null}={raw:null,value:null};
function readLastOrder(){
  let raw:string|null=null;
  try{raw=window.sessionStorage.getItem(LAST_ORDER_KEY)}catch{/* unavailable */}
  if(raw!==cached.raw){let value:LastOrder|null=null;try{value=raw?JSON.parse(raw) as LastOrder:null}catch{value=null}cached={raw,value}}
  return cached.value;
}
const noSubscribe=()=>()=>{};

export function OrderConfirmation({reference}:{reference:string}){
  const stored=useSyncExternalStore(noSubscribe,readLastOrder,()=>null);
  const order=stored&&stored.reference===reference?stored:null;
  // Empty the cart only when this browser just placed this order, not for an old confirmation link.
  useEffect(()=>{if(order)cart.clear()},[order]);
  return <PageShell className="confirmation-page">
    <section className="confirmation page-width">
      <span className="confirmation-icon"><Check size={30}/></span>
      <span className="eyebrow">ORDER RECEIVED</span>
      <h1 className="inner-title">Thank you<em>.</em></h1>
      {reference?<p className="confirmation-reference">Your order reference is <strong>{reference}</strong></p>:null}
      <p className="confirmation-copy"><Mail size={16}/>{order?<>We’ll email <strong>{order.email}</strong> to confirm your order and arrange payment. Nothing is sent until your order is confirmed.</>:<>We’ll email you to confirm your order and arrange payment. Nothing is sent until your order is confirmed.</>}</p>
      {order&&<div className="order-summary confirmation-summary"><ul className="summary-items">{order.items.map(item=><li key={item.name}><span><strong>{item.quantity} × {item.name}</strong><small>{item.subtitle}</small></span><span>{formatPrice(item.lineTotalPence)}</span></li>)}</ul><dl className="summary-rows"><div><dt>Subtotal</dt><dd>{formatPrice(order.subtotalPence)}</dd></div><div><dt>{order.deliveryName}</dt><dd>{order.deliveryPence===0?'Free':formatPrice(order.deliveryPence)}</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatPrice(order.totalPence)}</dd></div></dl></div>}
      <div className="cart-empty-actions"><CTA href="/shop">Continue shopping</CTA><CTA secondary href={`/contact?message=${encodeURIComponent(`A question about my order ${reference}.`)}`}>Questions about your order?</CTA></div>
    </section>
  </PageShell>;
}
