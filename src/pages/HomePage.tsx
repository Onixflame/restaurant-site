import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { PrivateDiningExperience } from '../components/ui/PrivateDiningExperience';
import { effectiveContent, effectiveMenu, effectiveMusic } from '../lib/dataSource';
import { money } from '../lib/format';

export function HomePage() {
  const menu = effectiveMenu();
  const content = effectiveContent();
  const music = effectiveMusic();
  const signatures = menu.filter(x=>x.featured && x.status!=='sold').slice(0,3);
  const dish = menu.find(x=>x.dishOfDay && x.status!=='sold') ?? signatures[0];
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const tonight=music.find(x=>x.day===days[new Date().getDay()]) ?? music[0];

  return <PageShell>
    <section className="hero-home">
      <div className="hero-overlay"/>
      <div className="wrap hero-content hero-home-shell">
        <div className="hero-copyblock hero-copy-centered">
          <div className="eyebrow hero-kicker">{content.pages.home.heroEyebrow}</div>
          <h1 className="hero-main-title">{content.pages.home.heroTitle}</h1>
          <p className="hero-copy">{content.pages.home.heroText}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/reservations">Make a reservation</Link>
            <Link className="btn ghost" to="/menu">Explore the menu</Link>
          </div>
        </div>
      </div>
    </section>

    <div className="live-strip"><div className="wrap live-strip-inner"><div className="live-dot"><i/>Tonight at ONIX</div><div><h3>{tonight.title} · {tonight.artist}</h3><p>{tonight.time} · {tonight.note}</p></div><Link className="btn strip-btn" to="/story#music">Weekly programme</Link></div></div>

    <section className="home-intro reveal"><div className="home-intro-media image-reveal"><span>1728</span></div><div className="home-intro-copy"><div className="kicker">The house</div><h2 className="display">{content.pages.home.houseTitle}</h2><p className="copy">{content.pages.home.houseText}</p><p className="copy">The story moves through merchants, musicians, wartime closures and a careful restoration that leaves the oldest marks visible.</p><Link className="text-link" to="/story">Read the history of the house</Link></div></section>

    <section className="section dark-section"><div className="wrap"><div className="section-head reveal"><div><div className="kicker">From the kitchen</div><h2 className="display">{content.pages.home.kitchenTitle}</h2></div><p className="copy">{content.pages.home.kitchenText}</p></div><div className="signature-grid">{signatures.map((m,i)=><article className={`dish-card reveal reveal-delay-${i+1}`} key={m.id}><div className="dish-image"><img src={m.img} alt={m.name}/><span>{String(i+1).padStart(2,'0')}</span></div><div className="dish-card-copy"><small>{m.category}</small><h3>{m.name}</h3><p>{m.desc}</p><span className="price">{money(m.price)}</span></div></article>)}</div><div className="section-cta reveal"><Link className="btn ghost" to="/menu">Open the full menu</Link></div></div></section>

    <section className="service-rhythm"><div className="wrap"><div className="rhythm-head reveal"><div className="kicker">The rhythm of an evening</div><h2 className="display">From first glass<br/>to last note</h2></div><div className="rhythm-track reveal"><article><span>18:00</span><h3>Doors open</h3><p>First cocktails, early tables and the room settling into service.</p></article><article><span>20:30</span><h3>Full room</h3><p>Tasting menus in motion while the Salon Session begins upstairs.</p></article><article><span>22:45</span><h3>Late bar</h3><p>Smaller plates, slower pours and the final live set of the night.</p></article></div></div></section>

    {dish && <section className="focus-grid reveal"><div className="focus-media image-reveal"><img src={dish.img} alt={dish.name}/><div className="focus-stamp">Dish<br/>of the<br/>day</div></div><div className="focus-copy"><div className="kicker">Chef’s focus · tonight</div><h2 className="display">{dish.name}</h2><p className="copy">{dish.desc}</p><div className="focus-tags">{[dish.category,...dish.tags].map(x=><span key={x}>{x}</span>)}</div><div className="focus-price">{money(dish.price)}</div><Link className="text-link" to="/menu">Find it in the menu</Link></div></section>}

    <section className="story-teaser reveal"><div className="story-teaser-copy"><div className="history-mark">1728</div><div className="kicker">From house to restaurant</div><h2 className="display">The Black Stone</h2><p className="copy">A glass merchant's residence, a nineteenth-century salon, a shuttered cellar and a rediscovered oak hearth. ONIX uses the imagined history of the building as a thread through the dining room.</p><Link className="text-link" to="/story">Explore five chapters of the house</Link></div><div className="story-teaser-media image-reveal"><div className="story-caption">Malá Strana · Prague 1</div></div></section>

    <section className="section paper boutique-home-teaser">
      <div className="wrap boutique-home-grid reveal">
        <div className="boutique-home-copy">
          <div className="kicker">The ONIX boutique</div>
          <h2 className="display">{content.pages.home.boutiqueTitle}</h2>
          <p className="copy">{content.pages.home.boutiqueText}</p>
          <Link className="btn dark" to="/boutique">Browse the boutique</Link>
        </div>
        <div className="boutique-home-visual image-reveal"><div className="boutique-home-card"><span>Boutique</span><strong>Wine · gifts · desserts</strong><small>Collect before or after dinner</small></div></div>
      </div>
    </section>

    <PrivateDiningExperience compact />
  </PageShell>;
}
