import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';

export function NotFoundPage(){
  return <PageShell><section className="not-found"><div><div className="hero-logo">ONIX</div><h1>Page not found</h1><p>The page you requested is not part of the house.</p><Link className="btn primary" to="/">Return home</Link></div></section></PageShell>;
}
