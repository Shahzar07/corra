import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Pouch} from './pouch';
import {formatPrice,type CorraProduct} from '@/lib/products';

export function ProductCard({product}:{product:CorraProduct}){
  return <article className="catalog-card page-reveal" style={{'--product-colour':product.colour,'--product-tint':product.tint} as React.CSSProperties}>
    <Link prefetch={false} href={`/shop/${product.id}`} className="catalog-art" aria-label={`View ${product.name} ${product.flavour}`}><span className="catalog-number">{product.id==='corra-set'?'FOLLICULAR + LUTEAL':product.id==='follicular'?'01 / FOLLICULAR':'02 / LUTEAL'}</span><div className={`catalog-pouches ${product.id==='corra-set'?'is-duo':''}`}>{product.id!=='luteal'&&<Pouch type="follicular"/>}{product.id!=='follicular'&&<Pouch/>}</div><span className="catalog-art-note">{product.weight}</span><span className="catalog-arrow"><ArrowUpRight size={23}/></span></Link>
    <div className="catalog-info"><div><Link prefetch={false} href={`/shop/${product.id}`}><h3>{product.name}</h3></Link><p>{product.subtitle}</p><span className="catalog-price">{formatPrice(product.pricePence)}</span></div><span className="catalog-protein">{product.protein}<small>PROTEIN</small></span></div><Link prefetch={false} className="catalog-detail-link" href={`/shop/${product.id}`}>Explore the formula <ArrowUpRight size={16}/></Link>
  </article>;
}
