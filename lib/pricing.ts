import {getProduct,type ProductId} from './products';

// Placeholder delivery options until Corra confirms its rates.
export const FREE_DELIVERY_THRESHOLD_PENCE = 5000;
export const MAX_ITEM_QUANTITY = 10;
export type DeliveryMethodId = 'standard' | 'express';
export const deliveryMethods:{id:DeliveryMethodId;name:string;eta:string;pricePence:number;freeOverThreshold:boolean}[] = [
  {id:'standard',name:'Standard UK delivery',eta:'3–5 working days',pricePence:395,freeOverThreshold:true},
  {id:'express',name:'Express UK delivery',eta:'1–2 working days',pricePence:695,freeOverThreshold:false},
];

export type CartLine = {id:ProductId;quantity:number};

export function deliveryPrice(method:DeliveryMethodId,subtotalPence:number){
  const option=deliveryMethods.find(m=>m.id===method)??deliveryMethods[0];
  if(subtotalPence===0)return 0;
  return option.freeOverThreshold&&subtotalPence>=FREE_DELIVERY_THRESHOLD_PENCE?0:option.pricePence;
}

// Totals are always computed from the catalogue, never from client-supplied prices.
export function priceCart(lines:CartLine[],method:DeliveryMethodId='standard'){
  const items=lines.flatMap(line=>{
    const product=getProduct(line.id);
    if(!product)return [];
    const quantity=Math.min(Math.max(Math.trunc(line.quantity),1),MAX_ITEM_QUANTITY);
    return [{product,quantity,lineTotalPence:product.pricePence*quantity}];
  });
  const subtotalPence=items.reduce((sum,item)=>sum+item.lineTotalPence,0);
  const deliveryPence=deliveryPrice(method,subtotalPence);
  return {items,subtotalPence,deliveryPence,totalPence:subtotalPence+deliveryPence};
}
