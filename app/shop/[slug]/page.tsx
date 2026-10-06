import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getProduct,products} from '@/lib/products';
import {ProductDetail} from '@/components/corra/product-detail';
export function generateStaticParams(){return products.map(p=>({slug:p.id}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const p=getProduct((await params).slug);return {title:p?`${p.name} — Corra`:'Product not found — Corra',description:p?.description}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const p=getProduct((await params).slug);if(!p)notFound();return <ProductDetail product={p}/>}
