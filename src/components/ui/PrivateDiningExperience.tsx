import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { effectiveContent } from '../../lib/dataSource';
import { getInquiries, saveInquiries } from '../../lib/demoStore';
import type { PrivateInquiry } from '../../types/domain';

const gallery = [
  {
    src: '/images/private/stone-room-main.jpg',
    alt: 'Intimate private dining room with one long table set for twelve guests and exposed stone walls',
    caption: 'The Stone Room · 12-seat setting, expandable to 14',
  },
  {
    src: '/images/private/stone-room-wine.jpg',
    alt: 'Private dining table beside the Stone Room wine display and candlelit service setting',
    caption: 'Cellar service · private wine pairing',
  },
  {
    src: '/images/private/stone-room-stonework.jpg',
    alt: 'Historic stone wall and intimate table setting inside the same private dining room',
    caption: 'Original stonework · candlelight service',
  },
];

type Mode = 'enquiry' | 'callback' | null;

export function PrivateDiningExperience({ compact = false }: { compact?: boolean }) {
  const c = effectiveContent();
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<Mode>(null);
  const [sent, setSent] = useState(false);
  const touchStart = useRef<number | null>(null);
  const image = gallery[active];

  useEffect(() => {
    if (mode) return;
    const timer = window.setInterval(() => setActive(v => (v + 1) % gallery.length), 6500);
    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (!mode || typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMode(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mode]);
  const bullets = useMemo(() => ['Dedicated tasting menu', 'Dedicated service', 'Live chamber music on request', 'Wine pairing on request'], []);

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const row: PrivateInquiry = {
      id: `E${Date.now()}`,
      kind: mode === 'callback' ? 'Callback' : 'Private dining',
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      date: String(data.get('date') ?? ''),
      guests: Number(data.get('guests') ?? 0),
      eventType: String(data.get('eventType') ?? ''),
      note: String(data.get('note') ?? ''),
      status: 'New',
      createdAt: Date.now(),
    };
    saveInquiries([row, ...getInquiries()]);
    setSent(true);
  };

  return <section className={`private-experience ${compact ? 'compact-private' : ''}`} id="private">
    <div className="private-gallery reveal reveal-left">
      <div className="private-gallery-stage" onTouchStart={e => { touchStart.current = e.changedTouches[0]?.clientX ?? null; }} onTouchEnd={e => { const start = touchStart.current; const end = e.changedTouches[0]?.clientX; if (start == null || end == null) return; const delta = end - start; if (Math.abs(delta) > 45) setActive(v => (v + (delta < 0 ? 1 : -1) + gallery.length) % gallery.length); touchStart.current = null; }}>
        {gallery.map((item, i) => <img key={item.src} src={item.src} alt={item.alt} className={i === active ? 'active' : ''} />)}
        <div className="private-gallery-caption"><span>{String(active + 1).padStart(2, '0')}</span>{image.caption}</div>
        <div className="private-gallery-arrows">
          <button aria-label="Previous photo" onClick={() => setActive(v => (v - 1 + gallery.length) % gallery.length)}>←</button>
          <button aria-label="Next photo" onClick={() => setActive(v => (v + 1) % gallery.length)}>→</button>
        </div>
      </div>
      <div className="private-thumbs">
        {gallery.map((item, i) => <button key={item.src} className={i === active ? 'active' : ''} onClick={() => setActive(i)}><img src={item.src} alt="" /></button>)}
      </div>
    </div>
    <div className="private-copy reveal reveal-right">
      <div className="kicker">Private dining</div>
      <h2 className="display">The Stone Room</h2>
      <p className="copy">An intimate private room for 8–14 guests arranged around one long table and the oldest surviving stonework in the house. The room stays deliberately small: dedicated service, a private wine selection and live chamber music on request, without the feel of a large event venue.</p>
      <div className="private-facts">{bullets.map(x => <span key={x}>{x}</span>)}</div>
      <div className="private-actions">
        <button className="btn primary" onClick={() => { setSent(false); setMode('enquiry'); }}>Request private dining</button>
        <button className="btn ghost" onClick={() => { setSent(false); setMode('callback'); }}>Request a callback</button>
      </div>
      <div className="private-direct"><a href={`tel:${c.phone.replace(/\s/g, '')}`}>Call {c.phone}</a><a href={`mailto:${c.email}?subject=ONIX%20private%20dining`}>Email the team</a></div>
    </div>
    {mode && typeof document !== 'undefined' ? createPortal(<div className="enquiry-backdrop" role="dialog" aria-modal="true" aria-label="Private dining enquiry" onMouseDown={e => { if (e.currentTarget === e.target) setMode(null); }}>
      <div className="enquiry-modal" onMouseDown={e => e.stopPropagation()}>
        <button className="modal-x" aria-label="Close" onClick={() => setMode(null)}>×</button>
        {!sent ? <>
          <div className="kicker">{mode === 'callback' ? 'Callback request' : 'Private dining enquiry'}</div>
          <h2>{mode === 'callback' ? 'When should we call?' : 'Plan an evening in the Stone Room'}</h2>
          <p className="muted">Portfolio demo — no real enquiry is sent. The request is stored only for this demo session.</p>
          <form className="enquiry-form" onSubmit={e => { e.preventDefault(); submit(e.currentTarget); }}>
            <label>Name<input name="name" required placeholder="Your name" /></label>
            <label>Email<input name="email" type="email" required placeholder="name@example.com" /></label>
            <label>Phone<input name="phone" required placeholder="+420 ..." /></label>
            <label>Preferred date<input name="date" type="date" /></label>
            <label>Guests<select name="guests" defaultValue="10">{[8,9,10,11,12,13,14].map(n => <option key={n}>{n}</option>)}</select></label>
            <label>Occasion<select name="eventType"><option>Private dinner</option><option>Business dinner</option><option>Birthday</option><option>Celebration</option><option>Other</option></select></label>
            <label className="wide">Notes<textarea name="note" rows={4} placeholder="Tell us what you are planning." /></label>
            <button className="btn dark wide" type="submit">{mode === 'callback' ? 'Request callback' : 'Send enquiry'}</button>
          </form>
        </> : <div className="enquiry-success"><div className="success-mark">✓</div><h2>Request saved</h2><p>The enquiry is saved for this demo session and is visible in ONIX Control → Enquiries. Nothing has been sent externally.</p><button className="btn dark" onClick={() => setMode(null)}>Close</button></div>}
      </div>
    </div>, document.body) : null}
  </section>;
}
