'use client';
import Link from 'next/link';
import {ArrowLeft,ArrowUpRight,ShoppingBag,Truck,X} from 'lucide-react';
import {cart,useCartLines,useCartReady} from '@/lib/cart';
import {FREE_DELIVERY_THRESHOLD_PENCE,deliveryMethods,priceCart} from '@/lib/pricing';
import {formatPrice,products,PRICES_ARE_PLACEHOLDERS,type CorraProduct} from '@/lib/products';
import {PageShell} from './page-shell';
import {Pouch} from './pouch';
import {QuantityStepper} from './cart-controls';
import {CTA} from './cta';

export function ProductThumb({product}:{product:CorraProduct}){
  return <span className={`cart-thumb ${product.id==='corra-set'?'is-duo':''}`} style={{'--product-tint':product.tint} as React.CSSProperties}>{product.id!=='luteal'&&<Pouch type="follicular"/>}{product.id!=='follicular'&&<Pouch/>}</span>;
}

export function CartPage(){
  const lines=useCartLines();const ready=useCartReady();
  const {items,subtotalPence,deliveryPence,totalPence}=priceCart(lines);
  const toFree=FREE_DELIVERY_THRESHOLD_PENCE-subtotalPence;
  const count=items.reduce((sum,item)=>sum+item.quantity,0);
  return <PageShell className="cart-page">
    <section className="inner-hero commerce-hero page-width"><span className="eyebrow">YOUR CART</span><h1 className="inner-title">Your <em>cart.</em></h1>{ready&&count>0&&<p className="commerce-hero-note">{count} {count===1?'item':'items'}</p>}</section>
    {!ready?<div className="page-width cart-loading" aria-busy="true">Loading your cart…</div>:items.length===0?
      <section className="cart-empty page-width page-reveal"><ShoppingBag size={34}/><h2>Your cart is empty.</h2><p>Explore the two Corra formulas, or start with the set.</p><div className="cart-empty-actions"><CTA href="/shop">Shop Corra</CTA><CTA secondary href="/shop/corra-set">View the Corra set</CTA></div>
        <div className="cart-suggestions">{products.map(product=><Link prefetch={false} key={product.id} href={`/shop/${product.id}`} className="cart-suggestion"><ProductThumb product={product}/><span><strong>{product.name}</strong><small>{product.subtitle}</small></span><span className="cart-suggestion-price">{formatPrice(product.pricePence)}</span></Link>)}</div>
      </section>:
      <section className="commerce-grid page-width">
        <div className="cart-lines">
          <ul aria-label="Items in your cart">{items.map(({product,quantity,lineTotalPence})=><li key={product.id} className="cart-line">
            <Link prefetch={false} href={`/shop/${product.id}`} aria-label={`View ${product.name}`}><ProductThumb product={product}/></Link>
            <div className="cart-line-info"><Link prefetch={false} href={`/shop/${product.id}`}><h2>{product.name}</h2></Link><p>{product.subtitle}</p><span className="cart-unit">{formatPrice(product.pricePence)} each</span></div>
            <QuantityStepper value={quantity} onChange={next=>cart.setQuantity(product.id,next)} label={product.name}/>
            <strong className="cart-line-total">{formatPrice(lineTotalPence)}</strong>
            <button type="button" className="cart-remove" onClick={()=>cart.remove(product.id)} aria-label={`Remove ${product.name} from cart`}><X size={16}/></button>
          </li>)}</ul>
          <Link prefetch={false} href="/shop" className="text-link cart-continue"><ArrowLeft size={14}/> Continue shopping</Link>
        </div>
        <aside className="order-summary" aria-labelledby="summary-heading">
          <h2 id="summary-heading">Order summary</h2>
          <div className="delivery-progress">{toFree>0?<p><Truck size={15}/>Add {formatPrice(toFree)} more for free standard delivery.</p>:<p><Truck size={15}/>You’ve unlocked free standard delivery.</p>}<span><i style={{width:`${Math.min(100,subtotalPence/FREE_DELIVERY_THRESHOLD_PENCE*100)}%`}}/></span></div>
          <dl className="summary-rows"><div><dt>Subtotal</dt><dd>{formatPrice(subtotalPence)}</dd></div><div><dt>Delivery <small>({deliveryMethods[0].name.toLowerCase()})</small></dt><dd>{deliveryPence===0?'Free':formatPrice(deliveryPence)}</dd></div><div className="summary-total"><dt>Total</dt><dd>{formatPrice(totalPence)}</dd></div></dl>
          <Link prefetch={false} href="/checkout" className="pill checkout-button"><span>Continue to checkout</span><span className="button-arrow"><ArrowUpRight size={17}/></span></Link>
          <p className="summary-note">Express delivery is available at checkout.{PRICES_ARE_PLACEHOLDERS&&' Prices shown are sample prices.'}</p>
        </aside>
      </section>}
  </PageShell>;
}
