import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero';
import { PageShell } from '../components/layout/PageShell';
import { effectiveBoutique, effectiveContent } from '../lib/dataSource';
import type { BoutiqueCategory } from '../types/domain';

const categories: BoutiqueCategory[] = ['Wine cellar','Desserts','Pantry & keepsakes'];

export function BoutiquePage() {
  const [active, setActive] = useState<BoutiqueCategory | 'All'>('All');
  const items = effectiveBoutique();
  const content = effectiveContent();
  const visible = useMemo(() => active === 'All' ? items : items.filter(i => i.category === active), [active, items]);
  return <PageShell>
    <PageHero eyebrow={content.pages.boutique.heroEyebrow} title={content.pages.boutique.heroTitle} className="boutique">{content.pages.boutique.heroText}</PageHero>

    <section className="section paper boutique-intro">
      <div className="wrap boutique-lead reveal">
        <div><div className="kicker">After dinner</div><h2 className="display">{content.pages.boutique.introTitle}</h2><p className="copy">{content.pages.boutique.introText}</p></div>
        <div className="boutique-highlight-card boutique-overview-card"><small>Prepared to take home</small><strong>Cellar bottles · boxed pastry · pantry gifts · tableware</strong><p>Reserve a bottle or gift before dinner and collect it from the host stand when you leave.</p><div className="boutique-overview-pills"><span>Wine cellar</span><span>Desserts</span><span>Pantry</span><span>Tableware</span></div></div>
      </div>
    </section>

    <section className="section dark-section boutique-featured">
      <div className="wrap feature-shelf reveal">
        <div className="feature-shelf-media image-reveal boutique-shelf-photo" />
        <div className="feature-shelf-copy"><div className="kicker">The boutique corner</div><h2 className="display">{content.pages.boutique.featureTitle}</h2><p className="copy">{content.pages.boutique.featureText}</p><div className="boutique-feature-meta"><span>Inside ONIX</span><span>Cellar shelf</span><span>Collect after dinner</span></div><div className="hero-actions"><a className="btn primary" href="mailto:onixflamenv@gmail.com?subject=ONIX%20Boutique%20enquiry">Ask about boutique orders</a><Link className="btn ghost" to="/story">Discover the house</Link></div></div>
      </div>
    </section>

    <section className="section paper boutique-catalogue">
      <div className="wrap">
        <div className="section-head reveal"><div><div className="kicker">The shelf</div><h2 className="display">{content.pages.boutique.catalogueTitle}</h2></div><p className="copy">{content.pages.boutique.catalogueText}</p></div>
        <div className="boutique-filters reveal"><button className={active==='All'?'active':''} onClick={()=>setActive('All')}>All</button>{categories.map(category=><button key={category} className={active===category?'active':''} onClick={()=>setActive(category)}>{category}</button>)}</div>
        <div className="boutique-grid">{visible.map((item,index)=><article key={item.id} className={`boutique-card reveal reveal-delay-${(index%3)+1}`}><div className="boutique-card-media boutique-product-photo"><img src={item.image} alt={item.name} loading="lazy" style={{objectPosition:item.position??'center'}}/><span>{item.category}</span></div><div className="boutique-card-copy"><div className="boutique-card-top"><h3>{item.name}</h3><strong>${item.price}</strong></div><p>{item.description}</p><div className="boutique-note">{item.note}</div><div className="boutique-actions"><a href={`mailto:onixflamenv@gmail.com?subject=${encodeURIComponent('Boutique reservation · '+item.name)}`}>Reserve item</a><a href={`tel:${content.phone.replace(/\s/g,'')}`}>Call boutique</a></div></div></article>)}</div>
      </div>
    </section>
  </PageShell>;
}
