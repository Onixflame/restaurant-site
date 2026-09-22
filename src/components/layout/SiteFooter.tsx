import { Link } from 'react-router-dom';
import { getDemoPreviewToken, isDemoPreview } from '../../lib/dataSource';

export function SiteFooter() {
  const token=isDemoPreview()?getDemoPreviewToken():null;
  const q=token?`?demo=${encodeURIComponent(token)}`:'';
  const to=(path:string)=>`${path}${q}`;

  return <footer className="site-footer"><div className="wrap">
    <div className="footer-top">
      <div>
        <div className="footer-word">ONIX</div>
        <p className="tiny portfolio-mark">Fire, stone and season — modern European dining imagined in the heart of Prague.</p>
      </div>

      <div className="footer-col">
        <h4>Explore</h4>
        <Link to={to('/story')}>The house & history</Link>
        <Link to={to('/menu')}>Menu</Link>
        <Link to={to('/boutique')}>Boutique</Link>
        <Link to={to('/reservations')}>Reservations</Link>
        <Link to={to('/visit')}>Visit & private dining</Link>
      </div>

      <div className="footer-col footer-credit">
        <h4>Portfolio</h4>
        <div className="footer-credit-block">
          <span className="footer-credit-label">Designed & developed by</span>
          <span className="footer-credit-name">Stanislav Verbitckii</span>
          <a className="footer-credit-email" href="mailto:onixflamenv@gmail.com">
            <span>onixflamenv@gmail.com</span><span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} ONIX concept.</span>
      <span>Portfolio concept · no real reservations or orders are processed.</span>
    </div>
  </div></footer>;
}
