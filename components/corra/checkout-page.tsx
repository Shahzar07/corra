'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft,ArrowUpRight,Lock,ShoppingBag} from 'lucide-react';
import {useCartLines,useCartReady} from '@/lib/cart';
import {deliveryMethods,deliveryPrice,priceCart,type DeliveryMethodId} from '@/lib/pricing';
import {formatPrice,PRICES_ARE_PLACEHOLDERS} from '@/lib/products';
import {PageShell} from './page-shell';
import {ProductThumb} from './cart-page';
import {CTA} from './cta';

export const LAST_ORDER_KEY='corra-last-order';
export type LastOrder={reference:string;email:string;items:{name:string;subtitle:string;quantity:number;lineTotalPence:number}[];subtotalPence:number;deliveryPence:number;totalPence:number;deliveryName:string};

export function CheckoutPage(){
  const router=useRouter();
  const lines=useCartLines();const ready=useCartReady();
  const [method,setMethod]=useState<DeliveryMethodId>('standard');
  const [status,setStatus]=useState<'idle'|'sending'|'error'>('idle');
  const [error,setError]=useState('');
  const {items,subtotalPence,deliveryPence,totalPence}=priceCart(lines,method);

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const data=new FormData(event.currentTarget);
    setStatus('sending');setError('');
    try{
      const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        email:data.get('email'),firstName:data.get('firstName'),lastName:data.get('lastName'),phone:data.get('phone'),
        address1:data.get('address1'),address2:data.get('address2'),city:data.get('city'),postcode:data.get('postcode'),
        deliveryMethod:method,notes:data.get('notes'),website:data.get('website'),consent:data.get('consent')==='on',
        items:lines,expectedTotalPence:totalPence,
      })});
      const result=await response.json() as {reference?:string;error?:string};
      if(!response.ok||!result.reference)throw new Error(result.error||'Your order could not be placed. Please try again.');
      const summary:LastOrder={reference:result.reference,email:String(data.get('email')),items:items.map(item=>({name:item.product.name,subtitle:item.product.subtitle,quantity:item.quantity,lineTotalPence:item.lineTotalPence})),subtotalPence,deliveryPence,totalPence,deliveryName:deliveryMethods.find(m=>m.id===method)!.name};
      try{window.sessionStorage.setItem(LAST_ORDER_KEY,JSON.stringify(summary))}catch{/* confirmation falls back to the reference alone */}
      // The confirmation page empties the cart. Emptying it here would swap this page to its empty state mid-navigation.
      router.push(`/checkout/confirmation?order=${encodeURIComponent(result.reference)}`);
    }catch(cause){
      setError(cause instanceof Error?cause.message:'Your order could not be placed. Please try again.');
      setStatus('error');
    }
  }

  if(!ready)return <PageShell className="checkout-page"><div className="page-width cart-loading" aria-busy="true">Loading checkout…</div></PageShell>;
  if(items.length===0)return <PageShell className="checkout-page"><section className="cart-empty page-width"><ShoppingBag size={34}/><h1 className="commerce-empty-title">Your cart is empty.</h1><p>Add a Corra formula to your cart to check out.</p><div className="cart-empty-actions"><CTA href="/shop">Shop Corra</CTA></div></section></PageShell>;

  return <PageShell className="checkout-page">
    <section className="inner-hero commerce-hero page-width"><Link prefetch={false} href="/cart" className="text-link"><ArrowLeft size={14}/> Back to cart</Link><h1 className="inner-title">Check<em>out.</em></h1></section>
    <section className="commerce-grid page-width">
      <form className="checkout-form" onSubmit={submit} aria-busy={status==='sending'}>
        <fieldset><legend><span>01</span>Contact</legend>
          <label className="span-2">Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
          <label className="span-2">Phone <small>(optional, for delivery updates)</small><input name="phone" type="tel" autoComplete="tel" maxLength={30} pattern="[+\d\s\(\)\-]*"/></label>
        </fieldset>
        <fieldset><legend><span>02</span>Delivery address</legend>
          <label>First name<input name="firstName" autoComplete="given-name" required maxLength={80}/></label>
          <label>Last name<input name="lastName" autoComplete="family-name" required maxLength={80}/></label>
          <label className="span-2">Address line 1<input name="address1" autoComplete="address-line1" required minLength={3} maxLength={120}/></label>
          <label className="span-2">Address line 2 <small>(optional)</small><input name="address2" autoComplete="address-line2" maxLength={120}/></label>
          <label>Town or city<input name="city" autoComplete="address-level2" required minLength={2} maxLength={80}/></label>
          <label>Postcode<input name="postcode" autoComplete="postal-code" required maxLength={8} pattern="[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}" title="A UK postcode, for example WD3 3HH" className="postcode-input"/></label>
          <label className="span-2">Country<input name="country" value="United Kingdom" readOnly aria-describedby="country-note"/><small id="country-note">Corra currently delivers within the UK.</small></label>
        </fieldset>
        <fieldset><legend><span>03</span>Delivery method</legend>
          <div className="delivery-options span-2" role="radiogroup" aria-label="Delivery method">{deliveryMethods.map(option=>{const price=deliveryPrice(option.id,subtotalPence);return <label key={option.id} className={`delivery-option ${method===option.id?'is-selected':''}`}><input type="radio" name="deliveryMethod" value={option.id} checked={method===option.id} onChange={()=>setMethod(option.id)}/><span><strong>{option.name}</strong><small>{option.eta}</small></span><b>{price===0?'Free':formatPrice(price)}</b></label>})}</div>
          <label className="span-2">Order notes <small>(optional)</small><textarea name="notes" rows={3} maxLength={500} placeholder="Delivery instructions or anything we should know"/></label>
        </fieldset>
        <fieldset><legend><span>04</span>Payment</legend>
          <p className="payment-note span-2"><Lock size={16}/><span>No payment is taken online yet. When you place your order, Corra will email you to confirm it and arrange payment before anything is sent.</span></p>
          <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
          <label className="checkout-consent span-2"><input name="consent" type="checkbox" required/><span>I agree to Corra storing my details to process this order and contact me about it.</span></label>
        </fieldset>
        <button className="pill place-order" disabled={status==='sending'} type="submit"><span>{status==='sending'?'Placing your order…':`Place order · ${formatPrice(totalPence)}`}</span><span className="button-arrow"><ArrowUpRight size={18}/></span></button>
        <div className="checkout-status" role="status" aria-live="polite">{status==='error'&&<p className="contact-error">{error} <Link prefetch={false} href="/contact" className="text-link">Contact Corra <ArrowUpRight size={14}/></Link></p>}</div>
      </form>
      <aside className="order-summary checkout-summary" aria-labelledby="checkout-summary-heading">
        <h2 id="checkout-summary-heading">Your order</h2>
        <ul className="summary-items">{items.map(({product,quantity,lineTotalPence})=><li key={product.id}><span className="summary-thumb"><ProductThumb product={product}/><b aria-label={`Quantity ${quantity}`}>{quantity}</b></span><span><strong>{product.name}</strong><small>{product.subtitle}</small></span><span>{formatPrice(lineTotalPence)}</span></li>)}</ul>
        <dl className="summary-rows"><div><dt>Subtotal</dt><dd>{formatPrice(subtotalPence)}</dd></div><div><dt>Delivery</dt><dd>{deliveryPence===0?'Free':formatPrice(deliveryPence)}</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatPrice(totalPence)}</dd></div></dl>
        <Link prefetch={false} href="/cart" className="text-link">Edit cart <ArrowUpRight size={14}/></Link>
        {PRICES_ARE_PLACEHOLDERS&&<p className="summary-note">Prices shown are sample prices.</p>}
      </aside>
    </section>
  </PageShell>;
}
