import { ArrowUpRight } from 'lucide-react';

export function CTA({ secondary = false, children, onClick, href }: { secondary?: boolean; children: React.ReactNode; onClick?: () => void; href?: string }) {
  const body = <><span>{children}</span>{!secondary&&<span className="button-arrow"><ArrowUpRight size={17}/></span>}</>;
  return href ? <a className={`pill ${secondary?'outline':''}`} href={href}>{body}</a> : <button className={`pill ${secondary?'outline':''}`} onClick={onClick}>{body}</button>;
}
