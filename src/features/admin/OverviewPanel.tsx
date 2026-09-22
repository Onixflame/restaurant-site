import { TABLES } from '../../data';
import type { DemoSandbox, PrivateInquiry, Reservation, SettledCheck } from '../../types/domain';

export function OverviewPanel({sandbox,reservations,inquiries,checks}:{sandbox:DemoSandbox;reservations:Reservation[];inquiries:PrivateInquiry[];checks:SettledCheck[]}){
  const day=sandbox.menu.find(x=>x.dishOfDay&&x.status!=='sold')??sandbox.menu.find(x=>x.featured&&x.status!=='sold');
  const recentChecks=checks.slice().sort((a,b)=>b.createdAt-a.createdAt);
  const demoRevenue=recentChecks.reduce((sum,item)=>sum+item.amount,0);
  return <div>
    <div className="safety-ribbon"><strong>Safety model:</strong> edit anything you want. Changes live under a temporary sandbox and the normal portfolio route keeps protected canonical data.</div>
    <div className="stats">
      <div><small>Menu items</small><b>{sandbox.menu.length}</b></div>
      <div><small>Boutique items</small><b>{sandbox.boutique.length}</b></div>
      <div><small>Reservations</small><b>{reservations.length}</b></div>
      <div><small>Tables</small><b>{TABLES.length}</b></div>
      <div><small>Settled bills</small><b>{checks.length}</b></div>
      <div><small>Sandbox expires</small><b>{Math.max(0,Math.ceil((sandbox.expiresAt-Date.now())/3600000))}h</b></div>
    </div>
    <div className="admin-grid2">
      <section className="admin-section"><div className="admin-section-head"><div><h2>Recent activity</h2><p className="muted">Bookings, enquiries and settled guest bills.</p></div>{demoRevenue>0&&<div className="admin-revenue-chip"><span>Settled value</span><strong>${demoRevenue.toLocaleString()}</strong></div>}</div>
        {reservations.length?reservations.slice(0,3).map(r=><div className="admin-list-row" key={r.id}><span>{r.name}</span><span>{r.date} · {r.time}</span><span>T{r.table}</span><span>{r.status}</span></div>):<p className="muted">No reservations yet.</p>}
        {inquiries.slice(0,2).map(q=><div className="admin-list-row" key={q.id}><span>{q.name || 'Private guest'}</span><span>{q.kind}</span><span>{q.guests || '—'} guests</span><span>{q.status}</span></div>)}
        {recentChecks.slice(0,2).map(c=><div className="admin-list-row admin-activity-check" key={c.id}><span>{c.guestName}</span><span>{c.date} · {c.time}</span><span>{c.id}</span><span>${c.amount.toLocaleString()}</span></div>)}
      </section>
      <section className="admin-section"><h2>Dish of the day</h2>{day?<div className="day-preview"><img src={day.img} alt={day.name}/><h3>{day.name}</h3><p>{day.desc}</p><strong>${day.price}</strong></div>:<p className="muted">No active dishes.</p>}</section>
    </div>
  </div>;
}
