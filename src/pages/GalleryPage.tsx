import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { PageShell } from '../components/layout/PageShell';
import { GALLERY_IMAGES, type GalleryFloor } from '../data/gallery';

const FLOORS: GalleryFloor[] = ['Ground floor', 'First floor'];

export function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const selected = active === null ? null : GALLERY_IMAGES.find(x => x.id === active) ?? null;
  const groups = useMemo(() => FLOORS.map(floor => ({ floor, images: GALLERY_IMAGES.filter(x => x.floor === floor) })), []);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
      if (event.key === 'ArrowRight') {
        const i = GALLERY_IMAGES.findIndex(x => x.id === selected.id);
        setActive(GALLERY_IMAGES[(i + 1) % GALLERY_IMAGES.length].id);
      }
      if (event.key === 'ArrowLeft') {
        const i = GALLERY_IMAGES.findIndex(x => x.id === selected.id);
        setActive(GALLERY_IMAGES[(i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const lightbox = selected && typeof document !== 'undefined' ? createPortal(
    <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setActive(null)}>
      <button className="gallery-close" onClick={() => setActive(null)} aria-label="Close gallery">×</button>
      <button className="gallery-prev" aria-label="Previous image" onClick={e => { e.stopPropagation(); const i=GALLERY_IMAGES.findIndex(x=>x.id===selected.id); setActive(GALLERY_IMAGES[(i-1+GALLERY_IMAGES.length)%GALLERY_IMAGES.length].id); }}>←</button>
      <div className="gallery-lightbox-card" onClick={e => e.stopPropagation()}>
        <img src={selected.image} alt={selected.title} style={{ objectPosition: selected.position ?? 'center' }} />
        <div className="gallery-lightbox-copy"><small>{selected.floor}</small><h3>{selected.title}</h3><p>{selected.subtitle}</p></div>
      </div>
      <button className="gallery-next" aria-label="Next image" onClick={e => { e.stopPropagation(); const i=GALLERY_IMAGES.findIndex(x=>x.id===selected.id); setActive(GALLERY_IMAGES[(i+1)%GALLERY_IMAGES.length].id); }}>→</button>
    </div>,
    document.body
  ) : null;

  return <PageShell>
    <section className="gallery-hero">
      <img src={GALLERY_IMAGES[3].image} alt="Two-level ONIX restaurant interior" />
      <div className="gallery-hero-shade"/>
      <div className="wrap gallery-hero-copy">
        <div className="eyebrow">Inside ONIX · two floors</div>
        <h1>Gallery</h1>
        <p>The gallery now follows the same plan as Reservations: a lower dining floor and an upper level with balcony, window salon and library dining. Every image is a broad room view rather than a decorative close-up.</p>
      </div>
    </section>

    <section className="section paper gallery-intro">
      <div className="wrap section-head reveal">
        <div><div className="kicker">The whole house</div><h2 className="display">Two floors, one interior language.</h2></div>
        <p className="copy">The photographs are grouped by floor and intentionally treated with the same warm, low-light tone so the restaurant reads as one continuous place instead of unrelated rooms.</p>
      </div>
      <div className="wrap gallery-floor-summary reveal">
        <div><span>Ground floor</span><strong>Main Dining Room · Stone Hall & Bar · Stair Hall</strong></div>
        <i/>
        <div><span>First floor</span><strong>Balcony Dining · Window Salon · Library Dining Room</strong></div>
      </div>
    </section>

    {groups.map((group, groupIndex) => <section className={`gallery-floor-section ${groupIndex % 2 ? 'paper2' : 'paper'}`} key={group.floor}>
      <div className="wrap">
        <div className="gallery-floor-head reveal"><div><small>{groupIndex === 0 ? 'Level 01' : 'Level 02'}</small><h2>{group.floor}</h2></div><p>{groupIndex === 0 ? 'The active service floor: main dining, bar-side rooms and the stair connection upward.' : 'A quieter upper level overlooking the restaurant, with window seating and the library room.'}</p></div>
        <div className="gallery-floor-grid">
          {group.images.map((item, index) => <button key={item.id} className={`gallery-room-card reveal reveal-delay-${index+1}`} onClick={() => setActive(item.id)}>
            <img src={item.image} alt={item.title} loading="lazy" style={{ objectPosition: item.position ?? 'center' }} />
            <div className="gallery-room-shade"/>
            <div className="gallery-room-copy"><small>{group.floor}</small><h3>{item.title}</h3><p>{item.subtitle}</p><span>Open image ↗</span></div>
          </button>)}
        </div>
      </div>
    </section>)}

    <section className="section dark-section gallery-note">
      <div className="wrap gallery-note-grid reveal">
        <div><div className="kicker">Material language</div><h2 className="display">Dark timber.<br/>Stone.<br/>Warm evening light.</h2></div>
        <div><p className="copy">Those cues repeat on both floors and continue into the boutique, bar and private dining rooms so the fictional ONIX house reads as one restaurant.</p><p className="tiny">Portfolio concept · photographic references are curated for one consistent visual direction.</p></div>
      </div>
    </section>
    {lightbox}
  </PageShell>;
}
