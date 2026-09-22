import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { addSettledCheck, beginAdminMutationWindow } from '../../lib/demoStore';
import { creditGuestSpend, findGuestProfileByEmail } from '../../lib/guestAuth';
import type { Reservation, ReservationStatus, SettledCheck } from '../../types/domain';

export function ReservationManager({rows,checks,onChange,onCheckAdded}:{rows:Reservation[];checks:SettledCheck[];onChange:(rows:Reservation[])=>void;onCheckAdded:(check:SettledCheck)=>void}){
  const [confirmDelete,setConfirmDelete]=useState<Reservation|null>(null);
  const [acknowledged,setAcknowledged]=useState(false);
  const [undoItem,setUndoItem]=useState<{reservation:Reservation;index:number}|null>(null);
  const [settleItem,setSettleItem]=useState<Reservation|null>(null);
  const [serviceWord,setServiceWord]=useState('');
  const [billAmount,setBillAmount]=useState(180);
  const [settleError,setSettleError]=useState('');
  const undoTimer=useRef<number|null>(null);

  useEffect(()=>()=>{if(undoTimer.current) window.clearTimeout(undoTimer.current)},[]);

  const update=(id:string,status:ReservationStatus)=>onChange(rows.map(r=>r.id===id?{...r,status}:r));
  const seed=()=>onChange([{id:`R${Math.floor(1000+Math.random()*9000)}`,name:'Alex Morgan',email:'guest@onix.demo',note:'Anniversary',date:new Date().toISOString().slice(0,10),time:'20:00',guests:2,table:5,status:'Confirmed',createdAt:Date.now()},...rows]);

  const askDelete=(reservation:Reservation)=>{setAcknowledged(false);setConfirmDelete(reservation)};
  const cancelDelete=()=>{setAcknowledged(false);setConfirmDelete(null)};
  const removeConfirmed=()=>{
    if(!confirmDelete||!acknowledged) return;
    const index=rows.findIndex(r=>r.id===confirmDelete.id); if(index<0) return;
    const deleted=confirmDelete;
    onChange(rows.filter(r=>r.id!==deleted.id)); setConfirmDelete(null); setAcknowledged(false); setUndoItem({reservation:deleted,index});
    if(undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current=window.setTimeout(()=>setUndoItem(null),6500);
  };
  const undoDelete=()=>{
    if(!undoItem) return; if(undoTimer.current) window.clearTimeout(undoTimer.current);
    const next=[...rows]; next.splice(Math.min(undoItem.index,next.length),0,undoItem.reservation); onChange(next); setUndoItem(null);
  };

  const openSettlement=(reservation:Reservation)=>{
    setSettleItem(reservation); setServiceWord(''); setBillAmount(180); setSettleError('');
  };
  const closeSettlement=()=>{setSettleItem(null);setSettleError('');setServiceWord('')};
  const confirmSettlement=()=>{
    if(!settleItem) return;
    if(checks.some(c=>c.reservationId===settleItem.id)){setSettleError('This reservation already has a settled bill.');return;}
    const profile=findGuestProfileByEmail(settleItem.email);
    if(!profile){setSettleError('No ONIX guest account is registered with this reservation email. The guest needs an Account profile before spend can be attached.');return;}
    if(profile.serviceWord.toUpperCase()!==serviceWord.trim().toUpperCase()){setSettleError('The ONIX word does not match this guest account.');return;}
    if(!Number.isFinite(billAmount)||billAmount<=0){setSettleError('Enter a valid settled amount above $0.');return;}
    beginAdminMutationWindow();
    const check=addSettledCheck({
      email:settleItem.email.toLowerCase(), guestName:settleItem.name, reservationId:settleItem.id,
      date:settleItem.date,time:settleItem.time,table:settleItem.table,guests:settleItem.guests,
      amount:Math.round(billAmount*100)/100, summary:settleItem.note?.trim()||'ONIX dinner service',
    });
    creditGuestSpend(settleItem.email,check.amount);
    onChange(rows.map(r=>r.id===settleItem.id?{...r,status:'Settled'}:r));
    onCheckAdded(check);
    closeSettlement();
  };

  const deleteModal=confirmDelete&&typeof document!=='undefined'?createPortal(
    <div className="admin-delete-backdrop" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)cancelDelete()}}>
      <div className="admin-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-booking-title">
        <div className="admin-delete-icon" aria-hidden="true">!</div>
        <div className="admin-delete-copy"><div className="admin-delete-kicker">Destructive action</div><h2 id="delete-booking-title">Delete this reservation?</h2><p>This removes the booking from the demo reservation list and releases its table for this service time.</p></div>
        <div className="admin-delete-booking">
          <div><small>Guest</small><strong>{confirmDelete.name}</strong><span>{confirmDelete.email}</span></div><div><small>Date & time</small><strong>{confirmDelete.date}</strong><span>{confirmDelete.time}</span></div><div><small>Table</small><strong>T{confirmDelete.table}</strong><span>{confirmDelete.guests} guest{confirmDelete.guests===1?'':'s'}</span></div><div><small>Booking ID</small><strong>{confirmDelete.id}</strong><span>{confirmDelete.status}</span></div>
        </div>
        <label className="admin-delete-ack"><input type="checkbox" checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)}/><span>I understand that this reservation will be removed from the demo data.</span></label>
        <div className="admin-delete-actions"><button type="button" onClick={cancelDelete}>Keep reservation</button><button type="button" className="admin-delete-confirm" disabled={!acknowledged} onClick={removeConfirmed}>Delete reservation</button></div>
      </div>
    </div>,document.body):null;

  const settleModal=settleItem&&typeof document!=='undefined'?createPortal(
    <div className="admin-delete-backdrop" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)closeSettlement()}}>
      <div className="admin-settle-dialog" role="dialog" aria-modal="true" aria-labelledby="settle-booking-title">
        <div className="admin-settle-icon" aria-hidden="true">✓</div>
        <div className="admin-delete-copy"><div className="admin-settle-kicker">Close guest bill</div><h2 id="settle-booking-title">Settle {settleItem.name}'s visit</h2><p>The ONIX word links this closed bill to the matching guest Account. It will then appear in their previous bills and count toward membership automatically.</p></div>
        <div className="admin-delete-booking"><div><small>Reservation</small><strong>{settleItem.id}</strong><span>{settleItem.date} · {settleItem.time}</span></div><div><small>Table</small><strong>T{settleItem.table}</strong><span>{settleItem.guests} guest{settleItem.guests===1?'':'s'}</span></div></div>
        <div className="admin-settle-fields"><label>ONIX word<input autoFocus value={serviceWord} onChange={e=>setServiceWord(e.target.value.toUpperCase())} placeholder="ONIX word spoken by guest"/></label><label>Final bill amount ($)<input type="number" min="1" step="1" value={billAmount} onChange={e=>setBillAmount(Number(e.target.value))}/></label></div>
        {settleError&&<div className="admin-settle-error">{settleError}</div>}
        <div className="admin-delete-actions"><button type="button" onClick={closeSettlement}>Cancel</button><button type="button" className="admin-settle-confirm" onClick={confirmSettlement}>Close bill & attach spend</button></div>
      </div>
    </div>,document.body):null;

  const undo=undoItem&&typeof document!=='undefined'?createPortal(<div className="admin-undo-toast" role="status" aria-live="polite"><div><strong>Reservation deleted</strong><span>{undoItem.reservation.name} · {undoItem.reservation.date} at {undoItem.reservation.time}</span></div><button type="button" onClick={undoDelete}>Undo</button></div>,document.body):null;

  return <>
    <section className="admin-section">
      <div className="admin-section-head"><div><h2>Reservations</h2><p className="muted">Bookings appear here. Confirm a visit, then close its bill with the guest's ONIX word.</p></div><button onClick={seed}>+ Add sample booking</button></div>
      <div className="admin-table admin-reservation-table admin-reservation-table-v42">
        <div className="admin-table-head"><span>Guest</span><span>Date</span><span>Time</span><span>Table</span><span>Status</span><span aria-hidden="true">Actions</span></div>
        {rows.length?rows.map(r=><div className="admin-table-row" key={r.id}>
          <span><strong>{r.name}</strong><small>{r.email}</small></span><span>{r.date}</span><span>{r.time}</span><span>T{r.table}</span>
          <span>{r.status==='Settled'?<span className="admin-status-settled">Settled</span>:<select value={r.status} onChange={e=>update(r.id,e.target.value as ReservationStatus)}><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select>}</span>
          <span className="admin-reservation-actions admin-reservation-actions-v42">{r.status!=='Cancelled'&&r.status!=='Settled'&&<button type="button" className="admin-settle-trigger" onClick={()=>openSettlement(r)}>Close bill</button>}<button type="button" className="admin-delete-trigger" onClick={()=>askDelete(r)} aria-label={`Delete reservation ${r.id} for ${r.name}`}>Delete</button></span>
        </div>):<div className="admin-empty-state"><strong>No reservations</strong><span>New reservations will appear here.</span></div>}
      </div>
    </section>
    {deleteModal}{settleModal}{undo}
  </>;
}
