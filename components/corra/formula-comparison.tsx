import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {formatPrice,getProduct} from '@/lib/products';
import {Pouch} from './pouch';

const rows:{label:string;follicular:string;luteal:string;shared?:boolean;display?:boolean}[]=[
  {label:'Protein',follicular:'25g',luteal:'30g',display:true},
  {label:'Flavour',follicular:'Vanilla',luteal:'Chocolate'},
  {label:'Designed for',follicular:'Days 6–13*',luteal:'Days 17–28*'},
  {label:'Added sugar',follicular:'0g',luteal:'0g',shared:true},
  {label:'Vitamins & minerals',follicular:'20',luteal:'20',shared:true},
  {label:'Pouch size',follicular:'500g',luteal:'500g',shared:true},
];

export function FormulaComparison({dark=false}:{dark?:boolean}) {
  const follicular=getProduct('follicular')!;const luteal=getProduct('luteal')!;
  return <section className={`formula-comparison page-width page-reveal ${dark?'comparison-dark':''}`} aria-labelledby="comparison-heading">
    <div className="comparison-intro"><span className="eyebrow">THE TWO FORMULAS</span><h2 id="comparison-heading">Different packets.<br/><em>Shared essentials.</em></h2><p>Two flavours and two protein formulas. Here’s what you’ll find on each pouch.</p>
      <ul className="comparison-key" aria-label="How to read the comparison"><li><span className="key-swatch key-distinct"/>Made for its phase</li><li><span className="key-swatch key-shared"/>Shared by both</li></ul>
      <Link prefetch={false} className="text-link" href="/contact?message=Please%20share%20the%20complete%20ingredients%2C%20allergens%20and%20serving%20instructions%20for%20the%20Corra%20formulas.">Ask about ingredients &amp; allergens <ArrowUpRight size={16}/></Link>
    </div>
    <div className="comparison-table-wrap"><table className="comparison-table"><caption className="sr-only">Follicular and Luteal packet comparison, using product label values</caption>
      <thead><tr><th scope="col"><span className="sr-only">Product detail</span></th>
        {[follicular,luteal].map((p,i)=><th scope="col" key={p.id} className={`formula-col col-${p.id}`}><Link prefetch={false} href={`/shop/${p.id}`} className="formula-col-head" aria-label={`View ${p.name} ${p.flavour}`}><span className="formula-col-art"><Pouch type={p.id==='follicular'?'follicular':'luteal'}/></span><span className="formula-col-index">0{i+1} / {p.name.toUpperCase()}</span><span className="formula-col-name">{p.name}</span></Link></th>)}
      </tr></thead>
      <tbody>{rows.map(row=><tr key={row.label} className={row.shared?'is-shared':''}><th scope="row">{row.label}{row.shared&&<span className="shared-tag">Both</span>}</th>
        <td className="formula-col col-follicular">{row.display?<span className="formula-figure">{row.follicular}</span>:row.follicular}</td>
        <td className="formula-col col-luteal">{row.display?<span className="formula-figure">{row.luteal}</span>:row.luteal}</td></tr>)}</tbody>
      <tfoot><tr><th scope="row"><span className="sr-only">Shop</span></th>{[follicular,luteal].map(p=><td key={p.id} className={`formula-col col-${p.id}`}><Link prefetch={false} href={`/shop/${p.id}`} className="formula-col-shop"><span>{formatPrice(p.pricePence)}</span><span className="formula-col-cta">Shop {p.name} <ArrowUpRight size={14}/></span></Link></td>)}</tr></tfoot>
    </table><p className="comparison-note">*Illustrative 28-day cycle. Follow the serving instructions on your packet.</p></div>
  </section>;
}
