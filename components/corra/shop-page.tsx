import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {products,getProduct,formatPrice} from '@/lib/products';
import {PageShell} from './page-shell';
import {ProductCard} from './product-card';
import {Pouch} from './pouch';
import {CTA} from './cta';
import {FormulaComparison} from './formula-comparison';

export function ShopPage(){
  return <PageShell className="shop-page">
    <section className="inner-hero shop-intro page-width"><div><span className="eyebrow">SHOP CORRA / HORMONE SUPPORT PROTEIN</span><h1 className="inner-title">Two packets.<br/><em>Your cycle.</em></h1></div><p className="shop-intro-copy page-reveal">Follicular vanilla and Luteal chocolate.<br/>Explore both formulas together, or get to know each one.</p></section>
    <section className="featured-set page-width page-reveal" aria-labelledby="set-heading">
      <Link prefetch={false} href="/shop/corra-set" className="featured-set-art" aria-label="Explore the Corra two-packet set"><span className="featured-art-label eyebrow">FOLLICULAR + LUTEAL</span><div className="featured-pouches"><Pouch type="follicular" priority/><Pouch priority/></div><span className="featured-art-bottom">VANILLA & CHOCOLATE / 2 × 500G<ArrowUpRight size={22}/></span></Link>
      <div className="featured-set-copy"><span className="eyebrow">THE COMPLETE PAIR</span><h2 id="set-heading">The Corra set.</h2><p>One of each formula. Two packets designed to support your daily nutrition as your cycle changes.</p><ul className="set-contents"><li><span className="formula-dot follicular-dot"/><div><strong>Follicular</strong><span>Vanilla · 25g protein · 500g</span></div></li><li><span className="formula-dot luteal-dot"/><div><strong>Luteal</strong><span>Chocolate · 30g protein · 500g</span></div></li></ul><span className="featured-set-price">{formatPrice(getProduct('corra-set')!.pricePence)}<small>2 × 500g</small></span><CTA href="/shop/corra-set">Explore the set</CTA><span className="set-shared-note">Both formulas: 0g added sugar · 20 vitamins &amp; minerals</span></div>
    </section>
    <section className="catalog-section page-width" aria-labelledby="single-packets-heading"><div className="catalog-heading"><div><span className="eyebrow">GET TO KNOW EACH FORMULA</span><h2 id="single-packets-heading">The individual <em>packets.</em></h2></div><span>02 FORMULAS</span></div><div className="catalog-grid">{products.filter(p=>p.id!=='corra-set').map(product=><ProductCard key={product.id} product={product}/>)}</div></section>
    <FormulaComparison dark/>
    <section className="collection-help page-width page-reveal"><div><span className="eyebrow">YOUR NEXT STEP</span><h2>Questions before ordering?</h2><p>Ask us about ingredients, delivery or which formula fits your routine.</p></div><CTA secondary href="/contact">Talk to Corra</CTA></section>
  </PageShell>;
}
