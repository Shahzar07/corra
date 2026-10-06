'use client';

import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export function ContactSection({defaultTopic='Product question',defaultMessage='',standalone=false}:{defaultTopic?:string;defaultMessage?:string;standalone?:boolean}) {
  const [topic,setTopic]=useState(defaultTopic);
  const [message,setMessage]=useState(defaultMessage);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'), email: data.get('email'), topic: data.get('topic'),
          message: data.get('message'), website: data.get('website'), consent: data.get('consent') === 'on',
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Your message could not be saved. Please try again.');
      setStatus('success');
      form.reset();setMessage('');setTopic('Product question');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your message could not be saved. Please try again.');
      setStatus('error');
    }
  }

  return <section className={`section contact-section ${standalone?'contact-standalone':''}`} id="contact" aria-labelledby="contact-heading">
    <div className="contact-copy">
      <span className="eyebrow">CONTACT CORRA</span>
      {standalone?<h1 className="inner-title" id="contact-heading">Talk to <em>Corra.</em></h1>:<h2 id="contact-heading">Let’s <em>talk.</em></h2>}
      <p>Ask about a formula, ordering details or the app. Have an idea for working together? We’d like to hear it.</p>
      {standalone?<address className="contact-direct"><dl className="contact-topics"><div><dt>Phone</dt><dd><a href="tel:+447752974145">07752974145</a></dd></div><div><dt>Email</dt><dd><a href="mailto:corrawellness@gmail.com">corrawellness@gmail.com</a></dd></div><div><dt>Address</dt><dd>Flat 5, New Court<br/>New Road, WD3 3HH</dd></div></dl></address>:<dl className="contact-topics"><div><dt>Product questions</dt><dd>Availability, pricing, ingredients and serving instructions.</dd></div><div><dt>The Corra app</dt><dd>The cycle, symptom and packet-switching experience.</dd></div><div><dt>Partnerships</dt><dd>Collaborations and opportunities to work with Corra.</dd></div></dl>}
      <p className="contact-care-note">For product and general inquiries. This form isn’t a medical consultation.</p>
    </div>
    <form className="contact-form" onSubmit={submit} aria-busy={status==='sending'}>
      <span className="eyebrow">YOUR MESSAGE</span>
      <div className="contact-fields">
        <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      </div>
      <label>What’s on your mind?<select name="topic" value={topic} onChange={event=>setTopic(event.target.value)}><option>Product question</option><option>The Corra app</option><option>Partnerships</option><option>General inquiry</option></select></label>
      <label>Your message<textarea name="message" value={message} onChange={event=>setMessage(event.target.value)} required minLength={10} maxLength={3000} rows={4}/></label>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="contact-consent"><input name="consent" type="checkbox" required/><span>I agree to Corra storing my details to respond to this inquiry.</span></label>
      <button className="pill contact-submit" disabled={status==='sending'} type="submit"><span>{status==='sending'?'Sending…':'Send your message'}</span><span className="button-arrow"><ArrowUpRight size={18}/></span></button>
      <div className="contact-status" role="status" aria-live="polite">{status==='success'&&<p className="contact-success"><Check size={18}/>Thank you. Your message has been received.</p>}{status==='error'&&<p className="contact-error">{error}</p>}</div>
    </form>
  </section>;
}
