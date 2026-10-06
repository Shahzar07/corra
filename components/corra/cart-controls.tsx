'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Check,Minus,Plus} from 'lucide-react';
import {cart} from '@/lib/cart';
import {MAX_ITEM_QUANTITY} from '@/lib/pricing';
import type {CorraProduct} from '@/lib/products';

export function QuantityStepper({value,onChange,label,min=1}:{value:number;onChange:(next:number)=>void;label:string;min?:number}){
  return <div className="quantity-stepper" role="group" aria-label={`Quantity for ${label}`}>
    <button type="button" onClick={()=>onChange(value-1)} disabled={value<=min} aria-label={`Decrease quantity of ${label}`}><Minus size={14}/></button>
    <output aria-live="polite" aria-label={`${value} in cart`}>{value}</output>
    <button type="button" onClick={()=>onChange(value+1)} disabled={value>=MAX_ITEM_QUANTITY} aria-label={`Increase quantity of ${label}`}><Plus size={14}/></button>
  </div>;
}

export function AddToCart({product,compact=false}:{product:CorraProduct;compact?:boolean}){
  const [quantity,setQuantity]=useState(1);
  const [added,setAdded]=useState(0);
  function add(){cart.add(product.id,quantity);setAdded(quantity);setQuantity(1)}
  return <div className={`add-to-cart ${compact?'is-compact':''}`}>
    <div className="add-to-cart-row">
      {!compact&&<QuantityStepper value={quantity} onChange={next=>{setQuantity(next);setAdded(0)}} label={product.name}/>}
      <button type="button" className="pill add-to-cart-button" onClick={add}><span>{added?'Added to cart':'Add to cart'}</span><span className="button-arrow">{added?<Check size={17}/>:<Plus size={17}/>}</span></button>
    </div>
    <div className="add-to-cart-status" role="status" aria-live="polite">{added>0&&<p><Check size={15}/>{added} × {product.name} added. <Link prefetch={false} href="/cart" className="text-link">View cart <ArrowUpRight size={14}/></Link></p>}</div>
  </div>;
}
