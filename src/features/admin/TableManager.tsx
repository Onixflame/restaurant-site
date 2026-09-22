import { useMemo, useState } from 'react';
import { TABLES } from '../../data';
import { tableKey, tableState } from '../../lib/availability';
import { todayLocal } from '../../lib/format';
import type { DemoSandbox, RestaurantFloor, RestaurantTable, RestaurantZone } from '../../types/domain';

const FLOORS:RestaurantFloor[]=['Ground floor','First floor'];

type ZoneConfig={zone:RestaurantZone;title:string;note:string;area:string;tone?:string};
const GROUND:ZoneConfig[]=[
  {zone:'Bar Lounge',title:'Bar Lounge',note:'Cocktails · low tables',area:'bar',tone:'bar'},
  {zone:'Chef’s Counter',title:"Chef's Counter",note:'Open kitchen view',area:'counter'},
  {zone:'Main Dining Room',title:'Main Dining Room',note:'Central service',area:'main'},
  {zone:'Courtyard',title:'Courtyard',note:'Garden side',area:'courtyard',tone:'garden'},
  {zone:'Window Salon',title:'Window Salon',note:'Street windows',area:'window',tone:'window'},
  {zone:'Stone Room',title:'Stone Room',note:'Private dining',area:'stone',tone:'private'},
];
const FIRST:ZoneConfig[]=[
  {zone:'Gallery',title:'Gallery',note:'Quiet dining',area:'gallery'},
  {zone:'Window Salon',title:'Window Salon',note:'Upper windows',area:'salon',tone:'window'},
  {zone:'Balcony',title:'Balcony',note:'Overlooks the hall',area:'balcony',tone:'balcony'},
  {zone:'Library Dining Room',title:'Library Dining Room',note:'Late service',area:'library'},
  {zone:'Private Salon',title:'Private Salon',note:'8–10 guests',area:'private',tone:'private'},
];

export function TableManager({sandbox,onChange}:{sandbox:DemoSandbox;onChange:(s:DemoSandbox)=>void}){
  const [date,setDate]=useState(todayLocal());
  const [time,setTime]=useState('19:30');
  const [guests,setGuests]=useState(2);
  const [floor,setFloor]=useState<RestaurantFloor>('Ground floor');
  const [selected,setSelected]=useState<RestaurantTable|null>(null);
  const state=(t:RestaurantTable)=>sandbox.tableOverrides[tableKey(date,time,t.id)]??tableState({table:t,date,time,guests,demoPreview:true});
  const setOverride=(value:'available'|'reserved'|null)=>{if(!selected)return;const next={...sandbox,tableOverrides:{...sandbox.tableOverrides}};const key=tableKey(date,time,selected.id);if(value)next.tableOverrides[key]=value;else delete next.tableOverrides[key];onChange(next)};
  const floorTables=useMemo(()=>TABLES.filter(t=>t.floor===floor),[floor]);
  const zones=floor==='Ground floor'?GROUND:FIRST;
  const counts=FLOORS.map(f=>({floor:f,total:TABLES.filter(t=>t.floor===f).length,reserved:TABLES.filter(t=>t.floor===f&&state(t)==='reserved').length}));

  return <section className="admin-section">
    <div className="admin-section-head"><div><h2>Table plan</h2><p className="muted">The sandbox now uses the same room-by-room layout as the current Reservations page, so the admin and guest views stay in sync.</p></div></div>
    <div className="admin-toolbar admin-table-toolbar"><input type="date" value={date} onChange={e=>{setDate(e.target.value);setSelected(null)}}/><select value={time} onChange={e=>{setTime(e.target.value);setSelected(null)}}>{['18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'].map(x=><option key={x}>{x}</option>)}</select><select value={guests} onChange={e=>{setGuests(Number(e.target.value));setSelected(null)}}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n} guest{n===1?'':'s'}</option>)}</select></div>
    <div className="admin-floor-switch admin-floor-switch-v36">{counts.map(c=><button key={c.floor} className={floor===c.floor?'active':''} onClick={()=>{setFloor(c.floor);setSelected(null)}}><span>{c.floor}</span><small>{c.total-c.reserved} available · {c.reserved} reserved</small></button>)}</div>
    <div className="admin-plan-layout-v36">
      <div className={`admin-floor-grid-v36 ${floor==='Ground floor'?'admin-ground-v36':'admin-first-v36'}`}>
        {zones.map(config=>{
          const tables=floorTables.filter(t=>t.zone===config.zone);
          return <section className={`admin-room-v36 tone-${config.tone??'plain'}`} style={{gridArea:config.area}} key={config.zone}>
            <header><div><strong>{config.title}</strong><small>{config.note}</small></div><span>{tables.length}</span></header>
            <div className="admin-room-tables-v36">{tables.map(t=>{const s=state(t);return <button type="button" key={t.id} className={`admin-table-v36 ${t.shape} ${s==='reserved'?'reserved':''} ${selected?.id===t.id?'selected':''}`} onClick={()=>setSelected(t)}><strong>T{String(t.id).padStart(2,'0')}</strong><small>{t.cap} seats</small>{s==='reserved'&&<i>×</i>}</button>})}</div>
          </section>;
        })}
        <aside className="admin-room-v36 admin-fixtures-v36" style={{gridArea:'fixtures'}}><header><div><strong>Access</strong><small>Circulation</small></div></header><div className="admin-fixture-list-v36"><span>↕ Stairs</span><span>{floor==='Ground floor'?'↗ Main entrance':'◇ Landing'}</span></div></aside>
      </div>
      <aside className="admin-sidebox admin-table-sidebox-v36">{selected?<><small className="admin-side-kicker">Selected table</small><h3>Table {String(selected.id).padStart(2,'0')}</h3><p>{selected.floor}<br/>{selected.zone} · {selected.cap} seats</p><div className="admin-state-row"><span>Current state</span><strong>{state(selected)}</strong></div><button className="admin-primary" onClick={()=>setOverride('available')}>Mark available</button><button onClick={()=>setOverride('reserved')}>Mark reserved</button><button onClick={()=>setOverride(null)}>Return to simulation</button><p className="muted admin-side-note">Overrides apply only to {date} at {time}. Availability above is calculated for {guests} guest{guests===1?'':'s'}.</p></>:<><small className="admin-side-kicker">Table controls</small><h3>Select a table</h3><p className="muted">Choose a room and then a table. The control panel stays visible while the room grid adapts to the screen.</p></>}</aside>
    </div>
  </section>;
}
