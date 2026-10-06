'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, MessageCircle, Waves } from 'lucide-react';

export function ContactSection() {
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
      form.reset();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Your message could not be saved. Please try again.');
      setStatus('error');
    }
  }

  return <section className="section contact-section" id="contact" aria-labelledby="contact-heading">
    <div className="contact-copy">
      <span className="eyebrow">A LITTLE CONVERSATION. A LITTLE CLARITY.</span>
      <h2 id="contact-heading">Let’s talk.<br/><em>We’re listening.</em></h2>
      <p>Curious about your Corra routine? Have a product question or an idea to share? Start a conversation with us.</p>
      <div className="contact-detail"><span><MessageCircle size={21}/></span><div><strong>Questions, welcomed.</strong><p>Products, the app, or working together.</p></div></div>
      <div className="contact-detail"><span><Waves size={21}/></span><div><strong>One clear place to connect.</strong><p>Your message goes into Corra’s inquiry inbox.</p></div></div>
      <div className="contact-ribbon" aria-hidden="true"><svg viewBox="0 0 420 130"><path d="M-20 98C100 180 150-40 240 20S360 180 450 38" fill="none" stroke="#F95006" strokeWidth="3"/><path d="M-20 32C100-30 150 166 240 105S360-15 450 88" fill="none" stroke="#6B1D57" strokeWidth="3"/></svg></div>
    </div>
    <form className="contact-form" onSubmit={submit} aria-busy={status==='sending'}>
      <span className="eyebrow">SEND A MESSAGE</span>
      <div className="contact-fields">
        <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
      </div>
      <label>What’s on your mind?<select name="topic" defaultValue="Product question"><option>Product question</option><option>The Corra app</option><option>Partnerships</option><option>General inquiry</option></select></label>
      <label>Your message<textarea name="message" required minLength={10} maxLength={3000} rows={4}/></label>
      <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="contact-consent"><input name="consent" type="checkbox" required/><span>I agree to Corra storing my name, email and message to handle this inquiry. These details are not used for newsletter signup.</span></label>
      <button className="pill contact-submit" disabled={status==='sending'} type="submit"><span>{status==='sending'?'Sending…':'Send your message'}</span><span className="button-arrow"><ArrowUpRight size={18}/></span></button>
      <div className="contact-status" role="status" aria-live="polite">{status==='success'&&<p className="contact-success"><Check size={18}/>Your message has been saved. Thank you for reaching out.</p>}{status==='error'&&<p className="contact-error">{error}</p>}</div>
    </form>
  </section>;
}
