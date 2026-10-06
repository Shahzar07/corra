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
  { id: 'demo-01', name: 'Emma', rating: 5, isDemo: true, quote: 'Two flavours, one simple ritual. I love the idea of nutrition that makes room for my changing routine.' },
  { id: 'demo-02', name: 'Aisha', rating: 5, isDemo: true, quote: 'The little daily check-in is my favourite part. A moment to pause, notice how I feel and reconnect with myself.' },
  { id: 'demo-03', name: 'Rachel', rating: 5, isDemo: true, quote: 'Vanilla for one part of my routine, chocolate for another. It feels thoughtful without adding more to my day.' },
  { id: 'demo-04', name: 'Maya', rating: 5, isDemo: true, quote: 'I appreciate seeing the packets and the app as one connected experience. Everything has a clear place in the routine.' },
  { id: 'demo-05', name: 'Leah', rating: 5, isDemo: true, quote: 'A shake, a check-in, a little time for me. This is the kind of everyday ritual I can get behind.' },
  { id: 'demo-06', name: 'Sophie', rating: 5, isDemo: true, quote: 'I like a routine that leaves room for real life. Corra’s approach feels considered, calm and easy to understand.' },
  { id: 'demo-07', name: 'Nadia', rating: 5, isDemo: true, quote: 'The two-packet idea feels refreshingly clear. Having a little guidance alongside my nutrition makes the experience feel more personal.' },
  { id: 'demo-08', name: 'Alex', rating: 5, isDemo: true, quote: 'My favourite thing is the simplicity. Two packets, two flavours and one place to keep track of my own rhythm.' },
];
