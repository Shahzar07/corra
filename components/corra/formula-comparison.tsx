import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';

export function FormulaComparison({dark=false}:{dark?:boolean}) {
  return <section className={`formula-comparison page-width page-reveal ${dark?'comparison-dark':''}`} aria-labelledby="comparison-heading">
    <div className="comparison-intro"><span className="eyebrow">THE TWO FORMULAS</span><h2 id="comparison-heading">Different packets.<br/><em>Shared essentials.</em></h2><p>Two flavours and two protein formulas. Here’s what you’ll find on each pouch.</p></div>
    <div className="comparison-table-wrap"><table className="comparison-table"><caption className="sr-only">Follicular and Luteal packet comparison, using product label values</caption><thead><tr><th scope="col"><span className="sr-only">Product detail</span></th><th scope="col"><span className="formula-dot follicular-dot"/>Follicular</th><th scope="col"><span className="formula-dot luteal-dot"/>Luteal</th></tr></thead><tbody><tr><th scope="row">Flavour</th><td>Vanilla</td><td>Chocolate</td></tr><tr><th scope="row">Protein</th><td>25g</td><td>30g</td></tr><tr><th scope="row">Added sugar</th><td>0g</td><td>0g</td></tr><tr><th scope="row">Vitamins &amp; minerals</th><td>20</td><td>20</td></tr><tr><th scope="row">Pouch size</th><td>500g</td><td>500g</td></tr></tbody></table><p className="comparison-note">Follow the serving instructions on your packet.</p><Link prefetch={false} className="text-link" href="/contact?message=Please%20share%20the%20complete%20ingredients%2C%20allergens%20and%20serving%20instructions%20for%20the%20Corra%20formulas.">Ask about ingredients &amp; allergens <ArrowUpRight size={16}/></Link></div>
  </section>;
}
