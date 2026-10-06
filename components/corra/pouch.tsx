import Image from 'next/image';

export function Pouch({ type = 'luteal', className = '', priority = false }: { type?: 'follicular' | 'luteal'; className?: string; priority?: boolean }) {
  return <span className={`pouch ${className}`}><Image
    src={type==='follicular'?'/images/follicular-original.png':'/images/pouch-reference.png'}
    alt={type==='follicular'?'Corra Follicular vanilla protein: 25g protein, 0g added sugar, 20 vitamins and minerals':'Corra Luteal chocolate protein: 30g protein, 0g added sugar, 20 vitamins and minerals'}
    width={1504} height={1440} unoptimized priority={priority}
    sizes="(max-width: 700px) 45vw, 28vw" className="pouch-image"
  /></span>;
}
