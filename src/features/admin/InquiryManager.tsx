import type { PrivateInquiry, PrivateInquiryStatus } from '../../types/domain';

export function InquiryManager({ rows, onChange }: { rows: PrivateInquiry[]; onChange: (rows: PrivateInquiry[]) => void }) {
  const update = (id: string, status: PrivateInquiryStatus) => onChange(rows.map(r => r.id === id ? { ...r, status } : r));
  const remove = (id: string) => onChange(rows.filter(r => r.id !== id));
  return <section className="admin-section">
    <div className="admin-section-head"><div><h2>Private dining enquiries</h2><p className="muted">Requests created from the public demo are stored locally and expire with the demo data.</p></div></div>
    {!rows.length ? <p className="muted">No enquiries yet. Submit one from Visit → Private dining.</p> : <div className="admin-enquiries">
      {rows.map(row => <article className="admin-enquiry-card" key={row.id}>
        <div><small>{row.kind} · {new Date(row.createdAt).toLocaleString()}</small><h3>{row.name || 'Unnamed guest'}</h3><p>{row.email} · {row.phone}</p></div>
        <div><strong>{row.date || 'Flexible date'}</strong><span>{row.guests ? `${row.guests} guests` : 'Party size TBD'} · {row.eventType || 'No occasion selected'}</span></div>
        <p>{row.note || 'No additional note.'}</p>
        <div className="admin-enquiry-actions"><select value={row.status} onChange={e => update(row.id, e.target.value as PrivateInquiryStatus)}><option>New</option><option>Contacted</option><option>Closed</option></select><button onClick={() => remove(row.id)}>Delete</button></div>
      </article>)}
    </div>}
  </section>;
}
