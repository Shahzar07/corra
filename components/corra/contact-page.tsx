import {PageShell} from './page-shell';
import {ContactSection} from './contact-section';

export function ContactPage({message=''}:{message?:string}){
  return <PageShell className="contact-page"><ContactSection standalone defaultMessage={message}/></PageShell>;
}
