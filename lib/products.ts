export type ProductId = 'corra-set' | 'follicular' | 'luteal';
export type CorraProduct = {id:ProductId;name:string;subtitle:string;flavour:string;colour:string;tint:string;protein:string;weight:string;description:string};
export const products:CorraProduct[] = [
{id:'corra-set',name:'The Corra set',subtitle:'Follicular vanilla + Luteal chocolate',flavour:'Vanilla + Chocolate',colour:'#6B1D57',tint:'#eee1e8',protein:'25g / 30g',weight:'2 × 500g',description:'Both Corra formulas, together. One Follicular vanilla pouch and one Luteal chocolate pouch, designed to support your nutrition as your cycle changes.'},
{id:'follicular',name:'Follicular',subtitle:'Vanilla · 500g',flavour:'Vanilla',colour:'#F95006',tint:'#FFE3D3',protein:'25g',weight:'500g',description:'Vanilla hormone-support protein for your Follicular routine. With 25g protein, 0g added sugar and 20 vitamins & minerals.'},
{id:'luteal',name:'Luteal',subtitle:'Chocolate · 500g',flavour:'Chocolate',colour:'#6B1D57',tint:'#eedde8',protein:'30g',weight:'500g',description:'Chocolate hormone-support protein for your Luteal routine. With 30g protein, 0g added sugar and 20 vitamins & minerals.'},
];
export function getProduct(id:string){return products.find(p=>p.id===id)}
