import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './pages.css';
const serif=localFont({src:[{path:'./fonts/newsreader-normal.woff2',weight:'200 800',style:'normal'},{path:'./fonts/newsreader-italic.woff2',weight:'200 800',style:'italic'}],variable:'--font-serif',display:'swap'});
const sans=localFont({src:[{path:'./fonts/schibsted-grotesk-normal.woff2',weight:'400 900',style:'normal'},{path:'./fonts/schibsted-grotesk-italic.woff2',weight:'400 900',style:'italic'}],variable:'--font-sans',display:'swap'});
export const metadata:Metadata={title:'Corra — Protein, in sync.',description:'Less chaos. More clarity. Explore Corra’s two phase-aware protein formulas and a connected cycle-tracking app concept.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>}
