import { useEffect, useMemo, useState } from 'react';
import type { MenuItem } from '../../types/domain';
import { money } from '../../lib/format';

export function MenuBook({ items }: { items: MenuItem[] }) {
  const chapters = useMemo(() => items.filter(i => i.featured && i.status !== 'sold'), [items]);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<'next' | 'prev' | ''>('');
  if (!chapters.length) return null;
  const item = chapters[index % chapters.length];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const move = (direction: number) => {
    if (turn) return;
    setTurn(direction > 0 ? 'next' : 'prev');
    window.setTimeout(() => setIndex(v => (v + direction + chapters.length) % chapters.length), 170);
    window.setTimeout(() => setTurn(''), 640);
  };
  const select = (next: number) => {
    if (next === index || turn) return;
    setTurn(next > index ? 'next' : 'prev');
    window.setTimeout(() => setIndex(next), 170);
    window.setTimeout(() => setTurn(''), 640);
  };

  return <div className="book-wrap">
    <aside className="book-index" aria-label="Menu book chapters">
      <div className="book-index-title"><span>Contents</span><small>{chapters.length} signature plates</small></div>
      {chapters.map((dish, i) => <button key={dish.id} className={i === index ? 'active' : ''} onClick={() => select(i)}><small>{String(i + 1).padStart(2,'0')} · {dish.category}</small><span>{dish.name}</span><i>{money(dish.price)}</i></button>)}
    </aside>
    <div className="book-main">
      <div className="book-stage">
        <div className={`book ${turn ? `turn-${turn}` : ''}`}>
          <div className="book-spine"/>
          <div className="book-turn" />
          <article className="book-page left" key={`left-${item.id}`}>
            <div className="book-folio">{item.category} · signature plate</div>
            <div className="book-page-number">{String(index + 1).padStart(2,'0')}</div>
            <div className="book-copy-lockup">
              <h3>{item.name}</h3>
              <p className="book-desc">{item.desc}</p>
              <div className="book-rule" />
              <div className="book-ingredients">{item.ingredients.map(x => <span key={x}>{x}</span>)}</div>
              <div className="book-bottom"><div><small>Pairing note</small><p>{item.tags.join(' · ') || 'Seasonal pairing available'}</p></div><div className="book-price">{money(item.price)}</div></div>
            </div>
          </article>
          <article className="book-page right" key={`right-${item.id}`}>
            <img src={item.img} alt={item.name} />
            <div className="book-image-shade" />
            <div className="book-caption"><div className="book-folio">ONIX · Prague</div><h4>{item.name}</h4><p>{item.category} · {item.tags.join(' · ') || 'seasonal'}</p></div>
          </article>
        </div>
      </div>
      <div className="book-controls">
        <div className="book-progress"><span>{String(index + 1).padStart(2,'0')}</span><i/><span>{String(chapters.length).padStart(2,'0')}</span></div>
        <div className="book-control-copy">Jump with the contents list or turn one page at a time.</div>
        <div className="book-arrows"><button className="round" onClick={() => move(-1)} aria-label="Previous dish">←</button><button className="round" onClick={() => move(1)} aria-label="Next dish">→</button></div>
      </div>
    </div>
  </div>;
}
