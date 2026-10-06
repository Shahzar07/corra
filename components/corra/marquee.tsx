import type {CSSProperties} from 'react';

function Star(){return <svg className="marquee-star" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0c.5 4.3 3.7 7.5 8 8-4.3.5-7.5 3.7-8 8-.5-4.3-3.7-7.5-8-8 4.3-.5 7.5-3.7 8-8Z"/></svg>}

/** A looping text band. The first copy is readable; the duplicate that makes the loop seamless is hidden from assistive tech. */
export function Marquee({items,tone='cream',size='md',seconds=38,reverse=false,label}:{items:string[];tone?:'cream'|'plum'|'orange'|'outline';size?:'sm'|'md'|'lg';seconds?:number;reverse?:boolean;label?:string}){
  const run=Array.from({length:size==='lg'?2:3},()=>items).flat();
  return <div className={`marquee marquee-${tone} marquee-${size} ${reverse?'is-reverse':''}`} style={{'--marquee-duration':`${seconds}s`} as CSSProperties} aria-label={label}>
    <div className="marquee-track">{[0,1].map(copy=><ul className="marquee-group" key={copy} aria-hidden={copy===1?true:undefined}>{run.map((item,i)=><li key={`${item}-${i}`} aria-hidden={i>=items.length?true:undefined}><span>{item}</span><Star/></li>)}</ul>)}</div>
  </div>;
}
