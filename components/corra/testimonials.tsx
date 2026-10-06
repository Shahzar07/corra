'use client';

import { useState } from 'react';
import { Pause, Play, Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/lib/testimonials';

function ReviewCard({ review }: { review: Testimonial }) {
  return <article className="review-card">
    <div className="review-card-top"><Quote size={25} className="review-quote-icon" aria-hidden="true"/>{review.isDemo && <span className="review-demo-label">SAMPLE REVIEW</span>}</div>
    {review.rating && <div className="review-stars" aria-label={`${review.isDemo?"Sample rating: ":""}${review.rating} out of 5 stars`}>{Array.from({length:review.rating},(_,i)=><Star key={i} size={14} fill="currentColor" aria-hidden="true"/>)}</div>}
    <blockquote>“{review.quote}”</blockquote>
    <p className="review-author">{review.name}</p>
  </article>;
}

export function Testimonials({ reviews }: { reviews: Testimonial[] }) {
  const [paused, setPaused] = useState(false);
  if (!reviews.length) return null;
  const hasDemo = reviews.some(review=>review.isDemo);
  const midpoint = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, midpoint), reviews.slice(midpoint)];
  if (!rows[1].length) rows[1] = rows[0];

  return <section className={`testimonials-section ${paused?'is-paused':''}`} aria-labelledby="reviews-heading">
    <div className="section-intro"><span className="eyebrow">VOICES & EXPERIENCES</span><h2 id="reviews-heading">{hasDemo?"In their words.":"Real people."}{!hasDemo&&<><br/><em>Real rhythms.</em></>}</h2>{hasDemo && <p className="testimonial-demo-note">Illustrative testimonials. Names, quotes and ratings are fictional.</p>}</div>
    <div className="testimonial-controls"><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?<Play size={15}/>:<Pause size={15}/>}<span>{paused?'Play stories':'Pause stories'}</span></button></div>
    <div className="testimonial-rows">{rows.map((row,index)=>{
      const repeated = Array.from({length:Math.max(1,Math.ceil(6/row.length))},()=>row).flat();
      return <div className={`testimonial-window ${index===1?'moves-right':'moves-left'}`} key={index}><div className="testimonial-track">{[0,1].map(copy=><div className="testimonial-group" key={copy} aria-hidden={copy===1?true:undefined}>{repeated.map((review,i)=><div key={`${review.id}-${i}`} aria-hidden={i>=row.length?true:undefined}><ReviewCard review={review}/></div>)}</div>)}</div></div>;
    })}</div>
  </section>;
}
