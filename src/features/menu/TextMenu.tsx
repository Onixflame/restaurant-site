import { useMemo, useState } from 'react';
import type { MenuCategory, MenuItem } from '../../types/domain';
import { money } from '../../lib/format';

export const CATEGORIES: MenuCategory[] = ['Snacks','Raw','Sea','From the Garden','Fire','Sides','Desserts & Cheese','Bar'];
export const categorySlug = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const notes: Record<MenuCategory,string> = {
  Snacks:'Small openings for the table.',
  Raw:'Cold preparations and first courses.',
  Sea:'Fish and shellfish from river and coast.',
  'From the Garden':'Vegetables treated with the same care as the mains.',
  Fire:'Meat and produce finished over oak and charcoal.',
  Sides:'Built to share across the table.',
  'Desserts & Cheese':'Desserts, local cheese and the last note of dinner.',
  Bar:'Cocktails, wine flights and late-night plates.'
};
const embellishments: Partial<Record<MenuCategory,{title:string;copy:string;}>> = {
  Snacks:{title:'A first impression',copy:'A concise line of bites designed to arrive with the first pour.'},
  Sea:{title:'From river & coast',copy:'Delicate seafood, butter sauces and restrained brine.'},
  Fire:{title:'The oak grill',copy:'The heart of the kitchen — smoke, ember and deeper savoury notes.'},
  'Desserts & Cheese':{title:'Finish slowly',copy:'Desserts and cheese designed to linger with a digestif or final glass.'},
  Bar:{title:'After dinner',copy:'Classic structure with ONIX signatures, Czech pours and late plates.'}
};

export function TextMenu({ items }: { items: MenuItem[] }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => items.filter(m => !search || [m.name,m.desc,...m.ingredients].join(' ').toLowerCase().includes(search.toLowerCase())), [items, search]);
  const liveCount = filtered.filter(m => m.status !== 'sold').length;
  return <div className="text-menu editorial-menu">
    <div className="text-menu-tools">
      <div>
        <div className="kicker">Everything at once</div>
        <h2 className="display">Complete menu</h2>
        <p className="menu-intro-copy">A classic reading of the menu: dish title, short ingredient line, kitchen description and price. Search to narrow the list or scroll by chapter.</p>
      </div>
      <div className="menu-tools-right">
        <input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dishes or ingredients" />
        <div className="menu-summary-card">
          <span>{liveCount} dishes available</span>
          <strong>Seasonal tasting available nightly</strong>
          <small>$145 per guest · optional pairing</small>
        </div>
      </div>
    </div>

    <div className="menu-category-jump" aria-label="Menu chapter navigation">
      {CATEGORIES.map(category => <a key={category} href={`#cat-${categorySlug(category)}`}>{category}</a>)}
    </div>

    {CATEGORIES.map((category, idx) => {
      const rows = filtered.filter(m => m.category === category);
      if (!rows.length) return null;
      const note = embellishments[category];
      return <section className="menu-category editorial-category" id={`cat-${categorySlug(category)}`} key={category}>
        <div className="category-head editorial-head">
          <div>
            <div className="category-index">{String(idx + 1).padStart(2,'0')}</div>
            <h2>{category}</h2>
            <p>{notes[category]}</p>
          </div>
          {note ? <aside className="category-note"><small>{note.title}</small><p>{note.copy}</p></aside> : <div />}
        </div>
        <div className="editorial-rows">
          {rows.map(m => <article className={`dish-list-row editorial-row ${m.status === 'sold' ? 'sold' : ''}`} key={m.id}>
            <div className="dish-title-block">
              <div className="dish-name-line"><h3>{m.name}</h3>{m.dishOfDay && <span className="dish-badge">Dish of the day</span>}{m.status === 'sold' && <span className="dish-badge muted">Sold out</span>}</div>
              <div className="tiny ingredient-line">{m.ingredients.join(' · ')}</div>
            </div>
            <div className="desc-block">
              <p className="desc">{m.desc}</p>
              <div className="dish-meta">{m.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="price-block"><div className="price">{money(m.price)}</div></div>
          </article>)}
        </div>
      </section>;
    })}
  </div>;
}
