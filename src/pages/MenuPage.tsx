import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { MenuBook } from '../features/menu/MenuBook';
import { CATEGORIES, TextMenu, categorySlug } from '../features/menu/TextMenu';
import { effectiveContent, effectiveMenu } from '../lib/dataSource';
import { money } from '../lib/format';
import type { MenuItem, SiteContent } from '../types/domain';

const clamp = (value:number, min=0, max=1) => Math.min(max, Math.max(min, value));

function MenuOpeningScene({ items, copy }: { items: MenuItem[]; copy: SiteContent['pages']['menu'] }){
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress,setProgress] = useState(0);
  const [mobileMode,setMobileMode] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [spotlight] = useState<MenuItem | null>(() => {
    const candidates = items.filter(item => item.featured && item.status !== 'sold');
    const fallback = items.filter(item => item.status !== 'sold');
    const pool = candidates.length ? candidates : fallback;
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  });

  useEffect(()=>{
    const mobile = window.matchMedia('(max-width: 820px)').matches;
    setMobileMode(mobile);
    if (mobile) {
      setProgress(0);
      const timer = window.setTimeout(() => { setProgress(1); setMobileOpen(true); }, 520);
      return () => window.clearTimeout(timer);
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const node = sectionRef.current;
      if(!node) return;
      const rect = node.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      setProgress(clamp(-rect.top / travel));
    };
    const request = () => { if(!raf) raf = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', request, {passive:true});
    window.addEventListener('resize', request);
    return () => { window.removeEventListener('scroll', request); window.removeEventListener('resize', request); if(raf) cancelAnimationFrame(raf); };
  },[]);

  const open = clamp((progress - .14) / .62);
  const coverMove = clamp(open / .5);
  const coverFade = 1 - clamp((open - .5) / .14);
  const spreadReveal = clamp((open - .62) / .22);
  const copyFade = 1 - clamp(progress / .26);
  const hintFade = clamp((progress - .78) / .16);
  const bookShift = 1 - clamp((progress - .05) / .5);
  const sceneStyle = {
    '--menu-open': open,
    '--menu-copy': copyFade,
    '--menu-hint': hintFade,
    '--menu-bg-scale': 1.045 - open * .018,
    '--menu-bg-brightness': .78 - open * .12,
    '--menu-copy-y': `${open * -34}px`,
    '--menu-shift-x': `${bookShift * 58}px`,
    '--menu-object-scale': .88 + open * .12,
    '--menu-shadow-scale': .82 + open * .18,
    '--menu-shadow-opacity': .54 + open * .18,
    '--menu-rotate-x': `${3.5 - open * 2.5}deg`,
    '--menu-rotate-z': `${-.8 + open * .8}deg`,
    '--menu-cover-opacity': coverFade,
    '--menu-cover-x': `${coverMove * -28}px`,
    '--menu-cover-y': `${coverMove * -8}px`,
    '--menu-cover-scale': 1 - coverMove * .025,
    '--menu-spread-opacity': spreadReveal,
    '--menu-spread-scale': .97 + spreadReveal * .03,
    '--menu-spread-clip': `${(1-spreadReveal) * 50}%`,
    '--menu-spine-opacity': spreadReveal,
    '--menu-note-opacity': spreadReveal,
    '--menu-hint-y': `${(1 - hintFade) * 18}px`,
  } as CSSProperties;

  return <section className={`menu-opening-scene ${mobileMode ? 'mobile-menu-opening' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`} ref={sectionRef} style={sceneStyle}>
    <div className="menu-opening-sticky">
      <div className="menu-opening-bg" />
      <div className="menu-opening-shade" />
      <div className="wrap menu-opening-layout">
        <div className="menu-opening-copy">
          <div className="eyebrow">{copy.heroEyebrow}</div>
          <h1>{copy.heroTitle}</h1>
        </div>

        <div className="menu-object-wrap" aria-hidden="true">
          <div className="menu-object-shadow" />
          <div className="menu-object">
            <div className="menu-inner-spread">
              <div className="menu-paper menu-paper-left menu-paper-selection-page">
                <div className="menu-paper-selection-top">
                  <div className="menu-paper-folio">Signature book · ONIX</div>
                  <div className="menu-selection-chip">Opening note</div>
                </div>

                <div className="menu-selection-showcase">
                  <div className="menu-selection-kicker">Chef's selection</div>
                  <div className="menu-selection-title">Selected for you tonight</div>
                  <div className="menu-selection-dish">{spotlight?.name ?? 'Chef selection'}</div>
                  <div className="menu-selection-meta">
                    <span>{spotlight?.category ?? 'Seasonal chapter'}</span>
                    <i aria-hidden="true" />
                    <span>{spotlight ? money(spotlight.price) : '—'}</span>
                  </div>
                </div>

                <div className="menu-paper-rule" />
                <div className="menu-paper-copy menu-paper-copy-footnote">
                  Before the full menu unfolds, ONIX opens with one highlighted page from the signature book — a first recommendation from the kitchen, chosen to give each visit its own opening note.
                </div>
              </div>
              <div className="menu-paper menu-paper-right menu-paper-photo-page">
                {spotlight?.img && <img className="menu-paper-photo" src={spotlight.img} alt={spotlight.name} />}
                <div className="menu-paper-photo-shade" />
                <div className="menu-paper-photo-copy">
                  <div className="menu-paper-folio">{spotlight?.category === 'Bar' ? 'From the bar' : 'Tonight at ONIX'} · {spotlight?.category ?? 'Seasonal'}</div>
                  <div className={`menu-paper-dish ${(spotlight?.name.length ?? 0) > 18 ? 'compact' : ''}`}>{spotlight?.name ?? 'Seasonal selection'}</div>
                  <div className="menu-paper-ingredients">{spotlight?.ingredients.join(' · ') ?? 'selected daily by the kitchen'}</div>
                  <div className="menu-paper-price">{spotlight ? money(spotlight.price) : '—'}</div>
                  <div className="menu-paper-random-note">A different menu highlight appears each visit</div>
                </div>
              </div>
            </div>

            <div className="menu-book-cover" aria-hidden="true">
              <div className="menu-closed-border" />
              <div className="menu-closed-mark">ONIX</div>
              <div className="menu-closed-sub">Prague · Seasonal Menu</div>
            </div>

            <div className="menu-object-spine" />
          </div>
        </div>
      </div>

      <div className="menu-opened-hint">
        <span>Menu opened</span>
        <strong>Continue to browse the book</strong>
        <i>↓</i>
      </div>
    </div>
  </section>;
}

export function MenuPage(){
  const [view,setView]=useState<'book'|'text'>('book');
  const items=effectiveMenu();
  const content=effectiveContent();
  return <PageShell>
    <MenuOpeningScene items={items} copy={content.pages.menu} />
    <div className="menu-toolbar"><div className="wrap menu-toolbar-inner"><div className="view-switch"><button className={view==='book'?'active':''} onClick={()=>setView('book')}>Signature book</button><button className={view==='text'?'active':''} onClick={()=>setView('text')}>Complete menu</button></div><div className="menu-toc">{CATEGORIES.map(c=><button key={c} onClick={()=>{setView('text');setTimeout(()=>document.getElementById(`cat-${categorySlug(c)}`)?.scrollIntoView({behavior:'smooth'}),40)}}>{c}</button>)}</div></div></div>
    {view==='book'?<section className="book-layout menu-book-after-open"><div className="wrap"><div className="book-topline reveal"><div><div className="kicker">The opened menu</div><h2 className="display">{content.pages.menu.bookTitle}</h2></div><div className="book-help">{content.pages.menu.bookHelp}</div></div><div className="reveal"><MenuBook items={items}/></div></div></section>:<section className="section paper complete-menu-panel"><div className="wrap is-visible"><TextMenu items={items}/></div></section>}
    <section className="section paper2"><div className="wrap"><div className="section-head reveal"><div><div className="kicker">Tasting menu</div><h2 className="display">{content.pages.menu.tastingTitle}</h2></div><div><p className="copy">{content.pages.menu.tastingText}</p><p><strong>$145</strong> per guest · Wine pairing $78 · Zero-proof pairing $48</p><Link className="btn dark" to="/reservations">Reserve dinner</Link></div></div></div></section>
  </PageShell>;
}
