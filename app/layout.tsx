import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const fraunces=localFont({src:[{path:'./fonts/fraunces-normal.woff2',weight:'100 900',style:'normal'},{path:'./fonts/fraunces-italic.woff2',weight:'100 900',style:'italic'}],variable:'--font-fraunces',display:'swap'});
const inter=localFont({src:'./fonts/inter.woff2',weight:'100 900',variable:'--font-inter',display:'swap'});
export const metadata:Metadata={title:'Corra — Protein, in sync.',description:'Less chaos. More clarity. Explore Corra’s phase-aware protein and a daily ritual designed around your cycle.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className={`${fraunces.variable} ${inter.variable}`}>{children}</body></html>}
