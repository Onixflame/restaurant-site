import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar, type AdminView } from '../features/admin/AdminSidebar';
import { OverviewPanel } from '../features/admin/OverviewPanel';
import { MenuManager } from '../features/admin/MenuManager';
import { ReservationManager } from '../features/admin/ReservationManager';
import { InquiryManager } from '../features/admin/InquiryManager';
import { TableManager } from '../features/admin/TableManager';
import { ContentManager } from '../features/admin/ContentManager';
import { BoutiqueManager } from '../features/admin/BoutiqueManager';
import { MusicManager, TeamManager } from '../features/admin/MusicTeamManager';
import {
  beginAdminMutationWindow,
  createSandbox,
  ensureSandbox,
  getAdminMutationExpiresAt,
  getAdminNotificationState,
  getInquiries,
  getReservations,
  getSettledChecks,
  hasAdminSession,
  markAdminNotificationsSeen,
  restoreAdminChangesNow,
  restoreExpiredAdminChanges,
  saveInquiries,
  saveReservations,
  saveSandbox,
  setAdminSession,
} from '../lib/demoStore';
import { clearDemoPreview, startDemoPreview } from '../lib/dataSource';
import type { DemoSandbox, PrivateInquiry, Reservation, SettledCheck } from '../types/domain';

export function AdminPage(){
  const nav=useNavigate();
  const [authorized,setAuthorized]=useState(hasAdminSession());
  const [sandbox,setSandbox]=useState<DemoSandbox>(()=>typeof window==='undefined'?createSandbox():ensureSandbox());
  const [reservations,setReservations]=useState<Reservation[]>(()=>getReservations());
  const [inquiries,setInquiries]=useState<PrivateInquiry[]>(()=>getInquiries());
  const [checks,setChecks]=useState<SettledCheck[]>(()=>getSettledChecks());
  const [view,setView]=useState<AdminView>('overview');
  const [notificationState,setNotificationState]=useState(()=>getAdminNotificationState());
  const [showSafety,setShowSafety]=useState(authorized);
  const [mutationExpiresAt,setMutationExpiresAt]=useState<number|null>(()=>getAdminMutationExpiresAt());
  const [now,setNow]=useState(Date.now());

  useEffect(()=>{
    const refresh=()=>{
      setSandbox(ensureSandbox());
      setReservations(getReservations());
      setInquiries(getInquiries());
      setChecks(getSettledChecks());
      setNotificationState(getAdminNotificationState());
      setMutationExpiresAt(getAdminMutationExpiresAt());
    };
    const tick=()=>{
      setNow(Date.now());
      if(restoreExpiredAdminChanges()){
        clearDemoPreview();
        refresh();
      } else {
        setMutationExpiresAt(getAdminMutationExpiresAt());
      }
    };
    const timer=window.setInterval(tick,1000);
    window.addEventListener('storage',refresh);
    window.addEventListener('focus',refresh);
    return()=>{
      window.clearInterval(timer);
      window.removeEventListener('storage',refresh);
      window.removeEventListener('focus',refresh);
    };
  },[]);

  const unreadReservations=useMemo(()=>reservations.filter(r=>r.createdAt>notificationState.reservationsSeenAt).length,[reservations,notificationState.reservationsSeenAt]);
  const unreadInquiries=useMemo(()=>inquiries.filter(q=>q.createdAt>notificationState.inquiriesSeenAt).length,[inquiries,notificationState.inquiriesSeenAt]);
  const unreadTotal=unreadReservations+unreadInquiries;
  const changeView=(next:AdminView)=>{
    setView(next);
    if(next==='reservations')setNotificationState(markAdminNotificationsSeen('reservations'));
    if(next==='enquiries')setNotificationState(markAdminNotificationsSeen('inquiries'));
  };

  const persist=(nextSandbox:DemoSandbox)=>{
    const expiry=beginAdminMutationWindow();
    const next={...nextSandbox,expiresAt:expiry};
    setSandbox(next);
    saveSandbox(next);
    setMutationExpiresAt(expiry);
  };
  const persistReservations=(rows:Reservation[])=>{
    const expiry=beginAdminMutationWindow();
    setReservations(rows);
    saveReservations(rows);
    setMutationExpiresAt(expiry);
  };
  const persistInquiries=(rows:PrivateInquiry[])=>{
    const expiry=beginAdminMutationWindow();
    setInquiries(rows);
    saveInquiries(rows);
    setMutationExpiresAt(expiry);
  };

  if(!authorized)return <div className="admin-login"><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(f.get('email')==='admin@onix.demo'&&f.get('password')==='onix24'){setAdminSession(true);setAuthorized(true);setShowSafety(true)}}}><div className="kicker">ONIX / Technical demo</div><h1>Administrator access</h1><p>This is a portfolio sandbox, not a production control panel.</p><div className="credential-card"><strong>Demo credentials</strong><p>Email: <code>admin@onix.demo</code><br/>Password: <code>onix24</code></p></div><input name="email" defaultValue="admin@onix.demo"/><input name="password" type="password" defaultValue="onix24"/><button className="admin-primary">Enter sandbox</button></form></div>;

  const preview=()=>{
    const token=startDemoPreview();
    window.open(`/?demo=${encodeURIComponent(token)}`,'_blank');
  };
  const restoreOriginal=()=>{
    restoreAdminChangesNow();
    clearDemoPreview();
    setSandbox(ensureSandbox());
    setReservations(getReservations());
    setInquiries(getInquiries());
    setChecks(getSettledChecks());
    setNotificationState(getAdminNotificationState());
    setMutationExpiresAt(null);
  };
  const secondsLeft=mutationExpiresAt?Math.max(0,Math.ceil((mutationExpiresAt-now)/1000)):0;
  const ttlLabel=mutationExpiresAt?`${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,'0')}`:'10:00';

  return <div className="admin-app">
    <AdminSidebar view={view} onView={changeView} onPreview={preview} onLogout={()=>{setAdminSession(false);clearDemoPreview();nav('/account',{replace:true})}} notifications={{overview:unreadTotal,reservations:unreadReservations,enquiries:unreadInquiries}}/>
    <main className="admin-main"><header className="admin-topbar"><h1>{view[0].toUpperCase()+view.slice(1)}</h1><div className="admin-topbar-actions"><span className={mutationExpiresAt?'admin-expiry-chip active':'admin-expiry-chip'}>{mutationExpiresAt?`Auto-reset in ${ttlLabel}`:'Edits reset after 10 min'}</span><button onClick={restoreOriginal}>Restore original</button><button className="admin-primary" onClick={preview}>Preview changes</button></div></header>
      {view==='overview'&&<OverviewPanel sandbox={sandbox} reservations={reservations} inquiries={inquiries} checks={checks}/>} 
      {view==='menu'&&<MenuManager sandbox={sandbox} onChange={persist}/>} 
      {view==='boutique'&&<BoutiqueManager sandbox={sandbox} onChange={persist}/>} 
      {view==='reservations'&&<ReservationManager rows={reservations} checks={checks} onChange={persistReservations} onCheckAdded={check=>setChecks(current=>[check,...current])}/>} 
      {view==='enquiries'&&<InquiryManager rows={inquiries} onChange={persistInquiries}/>} 
      {view==='tables'&&<TableManager sandbox={sandbox} onChange={persist}/>} 
      {view==='music'&&<MusicManager sandbox={sandbox} onChange={persist}/>} 
      {view==='team'&&<TeamManager sandbox={sandbox} onChange={persist}/>} 
      {view==='content'&&<ContentManager sandbox={sandbox} onChange={persist}/>} 
      {view==='settings'&&<section className="admin-section"><h2>Demo settings</h2><p>Every change made from ONIX Control is temporary. The first edit starts a protected 10-minute window; each additional edit restarts the timer. When it expires, menu text, boutique items, page copy, table changes, reservation edits and settled-check changes return to the state that existed before the admin session began.</p><p className="muted">{mutationExpiresAt?`Current rollback timer: ${ttlLabel}`:'No temporary admin changes are active.'}</p><button className="admin-danger" onClick={restoreOriginal}>Restore original state now</button></section>}
    </main>
    {showSafety&&<div className="admin-modal admin-welcome-modal" role="dialog" aria-modal="true" aria-labelledby="admin-welcome-title" onMouseDown={e=>{if(e.target===e.currentTarget)setShowSafety(false)}}><div className="admin-welcome-card"><button type="button" className="admin-modal-close" aria-label="Close welcome message" onClick={()=>setShowSafety(false)}>×</button><h2 id="admin-welcome-title">Welcome to the ONIX sandbox</h2><p>Edit page copy, manage menu and boutique items, review reservations and enquiries, close guest bills, adjust tables, music and team content. Every admin change is temporary, auto-rolls back after 10 minutes, and can never publish to the protected public portfolio route.</p><div className="admin-welcome-actions"><button className="admin-primary" onClick={()=>setShowSafety(false)}>Start testing</button></div></div></div>}
  </div>;
}
