export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  isDemo?: boolean;
};

// User-authorized demonstration copy. Replace with approved customer quotes,
// names and ratings, then remove isDemo from those entries before launch.
export const testimonials: Testimonial[] = [
  { id: 'demo-01', name: 'Emma', rating: 5, isDemo: true, quote: 'The two-packet idea is easy to understand. I can see where each one fits.' },
  { id: 'demo-02', name: 'Aisha', rating: 5, isDemo: true, quote: 'I’d never thought to keep a note of my energy alongside my cycle. The check-in makes that feel simple.' },
  { id: 'demo-03', name: 'Rachel', rating: 5, isDemo: true, quote: 'Vanilla and chocolate. Two flavours I’d actually want to come back to.' },
  { id: 'demo-04', name: 'Maya', rating: 5, isDemo: true, quote: 'Seeing both formulas side by side helped me understand the difference straight away.' },
  { id: 'demo-05', name: 'Leah', rating: 5, isDemo: true, quote: 'A quick check-in is something I could fit into my morning.' },
  { id: 'demo-06', name: 'Sophie', rating: 5, isDemo: true, quote: 'I like that the app puts my cycle dates and notes in the same place.' },
  { id: 'demo-07', name: 'Nadia', rating: 5, isDemo: true, quote: 'The packet reminder is the part that makes sense to me. One less thing to remember.' },
  { id: 'demo-08', name: 'Alex', rating: 5, isDemo: true, quote: 'Clear labels, two flavours and no complicated routine to decode.' },
];
