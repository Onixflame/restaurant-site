import { useMemo, useState, type FormEvent } from 'react';
import { occupancy } from '../../lib/availability';
import { getReservations, saveReservations } from '../../lib/demoStore';
import { todayLocal } from '../../lib/format';
import type { RestaurantTable } from '../../types/domain';
import { FloorPlan } from './FloorPlan';
import { isDemoPreview } from '../../lib/dataSource';

const times = ['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];

export function ReservationExperience() {
  const [date, setDate] = useState(todayLocal());
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [table, setTable] = useState<RestaurantTable | null>(null);
  const [message, setMessage] = useState('');
  const demoPreview = isDemoPreview();
  const slots = useMemo(() => times.map(t => {
    const occ = occupancy(date,t,guests,demoPreview);
    return { time:t, occ, label: occ >= 82 ? 'Almost full' : occ >= 62 ? 'Limited' : occ >= 40 ? 'Good' : 'Open' };
  }), [date, guests, demoPreview]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!table) { setMessage('Choose an available table first.'); return; }
    const form = new FormData(e.currentTarget);
    const id = `R${Math.floor(1000+Math.random()*9000)}`;
    const list = getReservations();
    list.unshift({ id, name:String(form.get('name') ?? ''), email:String(form.get('email') ?? ''), note:String(form.get('note') ?? ''), date,time,guests,table:table.id,status:'Pending',createdAt:Date.now() });
    saveReservations(list);
    setMessage(`Reservation ${id} saved for this demo session.`);
    setTable(null);
  };

  return <div className="booking-shell">
    <aside className="booking-panel">
      <div className="kicker">Your evening</div>
      <h2>Build the reservation</h2>
      <div className="booking-steps"><span className="booking-step done"/><span className={`booking-step ${table ? 'done' : 'active'}`}/><span className={`booking-step ${table ? 'active' : ''}`}/></div>
      <form className="form-grid" onSubmit={submit}>
        <div className="field"><label>Date</label><input type="date" min={todayLocal()} value={date} onChange={e=>{setDate(e.target.value);setTable(null)}} required /></div>
        <div className="field"><label>Guests</label><select value={guests} onChange={e=>{setGuests(Number(e.target.value));setTable(null)}}>{[1,2,3,4,5,6,7,8].map(n=><option key={n}>{n}</option>)}</select></div>
        <div className="field booking-time-field">
          <label>Time · dinner 18:00–23:30</label>
          <div className="sidebar-time-grid">{slots.map(s=><button type="button" key={s.time} className={`sidebar-time-slot ${time===s.time?'active':''}`} onClick={()=>{setTime(s.time);setTable(null)}}><strong>{s.time}</strong><small>{s.label}</small></button>)}</div>
          <div className="selected-time-summary"><span>Selected</span><strong>{time}</strong><small>{100-(slots.find(s=>s.time===time)?.occ ?? 0)}% compatible tables currently free</small></div>
        </div>
        <div className="booking-form-divider"><span>Guest details</span></div>
        <div className="field"><label>Name</label><input name="name" required placeholder="Your name" /></div>
        <div className="field"><label>Email</label><input name="email" type="email" required placeholder="name@example.com" /></div>
        <div className="field"><label>Note</label><textarea name="note" rows={3} placeholder="Allergies, celebration, accessibility…" /></div>
        <button className="btn dark" type="submit">Reserve this table</button>
        <p className="booking-note">Portfolio demo — no real reservation is sent.</p>
        {message && <div className="form-message">{message}</div>}
      </form>
    </aside>
    <div className="booking-main">
      <section className="booking-section">
        <div className="booking-section-title"><div><span>Step 01</span><h3>Choose your table</h3></div><p>{date} · {time} · {guests} guest{guests === 1 ? '' : 's'}. Switch between both floors and choose any compatible table.</p></div>
        <FloorPlan date={date} time={time} guests={guests} selected={table?.id ?? null} onSelect={setTable} demoPreview={demoPreview} />
        <div className={`selection-card ${table ? 'has-selection' : ''}`}>{table ? <><div><small>Your selection</small><strong>Table {String(table.id).padStart(2,'0')} · {table.zone}</strong><p>{table.floor} · {table.cap} seats · {date} at {time}</p></div><span className="selection-check">✓</span></> : <><div><small>Waiting for a table</small><strong>{time} selected</strong><p>Available tables are light. Reserved tables are muted and locked. Your chosen table turns gold.</p></div></>}</div>
      </section>
    </div>
  </div>;
}
