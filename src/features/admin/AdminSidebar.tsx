import type { ReactNode } from 'react';

export type AdminView = 'overview'|'menu'|'boutique'|'reservations'|'enquiries'|'tables'|'music'|'team'|'content'|'settings';

type Item = {id:AdminView;label:string;icon:ReactNode};
const Icon=({children}:{children:ReactNode})=><svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;

const items: Item[]=[
  {id:'overview',label:'Overview',icon:<Icon><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Icon>},
  {id:'menu',label:'Menu',icon:<Icon><path d="M5 4h14v16H5z"/><path d="M9 8h6M9 12h6M9 16h4"/></Icon>},
  {id:'boutique',label:'Boutique',icon:<Icon><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M8 8a4 4 0 0 1 8 0"/></Icon>},
  {id:'reservations',label:'Reservations',icon:<Icon><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></Icon>},
  {id:'enquiries',label:'Enquiries',icon:<Icon><path d="M4 5h16v12H8l-4 4V5Z"/><path d="M8 9h8M8 13h5"/></Icon>},
  {id:'tables',label:'Table plan',icon:<Icon><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></Icon>},
  {id:'music',label:'Live music',icon:<Icon><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></Icon>},
  {id:'team',label:'Team',icon:<Icon><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 15a5 5 0 0 1 6 5"/></Icon>},
  {id:'content',label:'Pages & content',icon:<Icon><path d="M5 3h10l4 4v14H5z"/><path d="M15 3v5h5M9 12h6M9 16h6"/></Icon>},
  {id:'settings',label:'Demo settings',icon:<Icon><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5l-.4 3a8 8 0 0 0-1.7 1L5 6 3 9.4 5 11a7 7 0 0 0 0 2l-2 1.6L5 18l2.4-1a8 8 0 0 0 1.7 1l.4 3h5l.4-3a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1Z"/></Icon>},
];

export function AdminSidebar({view,onView,onPreview,onLogout,notifications={}}:{view:AdminView;onView:(v:AdminView)=>void;onPreview:()=>void;onLogout:()=>void;notifications?:Partial<Record<AdminView,number>>}){
  return <aside className="admin-sidebar">
    <div className="admin-brand">ONIX <span>CONTROL</span></div>
    <div className="sandbox-card"><strong>10-minute protected sandbox</strong><p>Admin edits auto-rollback after 10 minutes and never publish to the protected portfolio copy.</p></div>
    <nav>{items.map(x=>{const count=notifications[x.id]??0;return <button key={x.id} className={view===x.id?'active':''} onClick={()=>onView(x.id)}><span className="admin-nav-main">{x.icon}<span className="admin-nav-label">{x.label}</span></span>{count>0&&<span className="admin-nav-badge">+{count}</span>}</button>})}</nav>
    <div className="admin-side-bottom"><button onClick={onPreview}>Preview sandbox ↗</button><a href="/?demo=0">Public site ↗</a><button onClick={onLogout}>Log out</button></div>
  </aside>;
}
