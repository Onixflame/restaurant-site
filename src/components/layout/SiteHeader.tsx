import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getDemoPreviewToken, isDemoPreview } from '../../lib/dataSource';

const nav = [['/', 'Home'], ['/story', 'Story'], ['/menu', 'Menu'], ['/boutique', 'Boutique'], ['/reservations', 'Reservations'], ['/visit', 'Visit']];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const token=isDemoPreview()?getDemoPreviewToken():null;
  const previewSearch = token ? `?demo=${encodeURIComponent(token)}` : '';
  const previewTo = (path:string) => `${path}${previewSearch}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <header className={`site-header ${scrolled ? 'scrolled' : ''} ${open ? 'menu-open' : ''}`}>
    <div className="header-inner">
      <Link className="brand" to={previewTo('/')}>ONIX</Link>
      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary navigation">
        <div className="mobile-nav-kicker">ONIX · MALÁ STRANA</div>
        {nav.map(([to, label]) => <NavLink key={to} to={previewTo(to)} end={to === '/'}>{label}</NavLink>)}
        <div className="mobile-nav-actions">
          <Link to={previewTo('/account')}>Account</Link>
          <Link className="mobile-reserve" to={previewTo('/reservations')}>Reserve a table</Link>
        </div>
      </nav>
      <div className="header-actions"><Link className="account-text" to={previewTo('/account')}>Account</Link><Link className="reserve-link" to={previewTo('/reservations')}>Reserve</Link></div>
      <button className="menu-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}><span>{open ? '×' : '☰'}</span></button>
    </div>
  </header>;
}
