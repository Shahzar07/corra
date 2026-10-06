'use client';
import {useSyncExternalStore} from 'react';
import {getProduct,type ProductId} from './products';
import {MAX_ITEM_QUANTITY,type CartLine} from './pricing';

// A small browser-side cart store, persisted to localStorage and shared across tabs.
const STORAGE_KEY='corra-cart-v1';
const EMPTY:CartLine[]=[];
const listeners=new Set<()=>void>();
let lines:CartLine[]|null=null;

function sanitise(value:unknown):CartLine[]{
  if(!Array.isArray(value))return EMPTY;
  const merged=new Map<ProductId,number>();
  for(const entry of value){
    if(!entry||typeof entry!=='object')continue;
    const {id,quantity}=entry as {id?:unknown;quantity?:unknown};
    if(typeof id!=='string'||!getProduct(id)||typeof quantity!=='number'||!Number.isFinite(quantity))continue;
    const next=(merged.get(id as ProductId)??0)+Math.trunc(quantity);
    if(next>0)merged.set(id as ProductId,Math.min(next,MAX_ITEM_QUANTITY));
  }
  return [...merged].map(([id,quantity])=>({id,quantity}));
}
function load(){
  try{return sanitise(JSON.parse(window.localStorage.getItem(STORAGE_KEY)??'[]'))}catch{return EMPTY}
}
function read(){if(lines===null)lines=load();return lines}
function write(next:CartLine[]){
  lines=next;
  try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(next))}catch{/* storage unavailable: keep the in-memory cart */}
  listeners.forEach(listener=>listener());
}
function subscribe(listener:()=>void){
  listeners.add(listener);
  const onStorage=(event:StorageEvent)=>{if(event.key===STORAGE_KEY){lines=load();listener()}};
  window.addEventListener('storage',onStorage);
  return()=>{listeners.delete(listener);window.removeEventListener('storage',onStorage)};
}

export const cart={
  add(id:ProductId,quantity=1){
    const current=read();const existing=current.find(line=>line.id===id);
    write(existing?current.map(line=>line.id===id?{...line,quantity:Math.min(line.quantity+quantity,MAX_ITEM_QUANTITY)}:line):[...current,{id,quantity:Math.min(quantity,MAX_ITEM_QUANTITY)}]);
  },
  setQuantity(id:ProductId,quantity:number){
    write(quantity<1?read().filter(line=>line.id!==id):read().map(line=>line.id===id?{...line,quantity:Math.min(quantity,MAX_ITEM_QUANTITY)}:line));
  },
  remove(id:ProductId){write(read().filter(line=>line.id!==id))},
  clear(){write(EMPTY)},
};

export function useCartLines(){return useSyncExternalStore(subscribe,read,()=>EMPTY)}
export function useCartCount(){return useCartLines().reduce((sum,line)=>sum+line.quantity,0)}
/** False during server rendering and hydration, true once the stored cart has been read. */
export function useCartReady(){return useSyncExternalStore(subscribe,()=>true,()=>false)}
