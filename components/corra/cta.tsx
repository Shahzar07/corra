import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function CTA({ secondary = false, children, onClick, href }: { secondary?: boolean; children: React.ReactNode; onClick?: () => void; href?: string }) {
  const body = <><span>{children}</span>{!secondary&&<span className="button-arrow"><ArrowUpRight size={17}/></span>}</>;
  return href ? <Link prefetch={false} className={`pill ${secondary?'outline':''}`} href={href}>{body}</Link> : <button className={`pill ${secondary?'outline':''}`} onClick={onClick}>{body}</button>;
}
