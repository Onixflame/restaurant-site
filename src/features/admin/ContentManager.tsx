import { useEffect, useState } from 'react';
import type { DemoSandbox, SiteContent } from '../../types/domain';

type ContentTab='general'|'home'|'story'|'menu'|'boutique'|'reservations'|'visit'|'account';
const tabs:{id:ContentTab;label:string}[]=[
  {id:'general',label:'General'},
  {id:'home',label:'Home'},
  {id:'story',label:'Story'},
  {id:'menu',label:'Menu'},
  {id:'boutique',label:'Boutique'},
  {id:'reservations',label:'Reservations'},
  {id:'visit',label:'Visit'},
  {id:'account',label:'Account'},
];

function Input({label,value,onChange,wide=false}:{label:string;value:string;onChange:(v:string)=>void;wide?:boolean}){
  return <label className={wide?'wide':''}>{label}<input value={value} onChange={e=>onChange(e.target.value)}/></label>;
}
function Text({label,value,onChange,rows=4,wide=false}:{label:string;value:string;onChange:(v:string)=>void;rows?:number;wide?:boolean}){
  return <label className={wide?'wide':''}>{label}<textarea rows={rows} value={value} onChange={e=>onChange(e.target.value)}/></label>;
}

export function ContentManager({sandbox,onChange}:{sandbox:DemoSandbox;onChange:(s:DemoSandbox)=>void}){
  const [draft,setDraft]=useState<SiteContent>(sandbox.content);
  const [tab,setTab]=useState<ContentTab>('home');
  useEffect(()=>setDraft(sandbox.content),[sandbox.createdAt]);
  const page=draft.pages;
  const setPage = <K extends keyof SiteContent['pages'],>(key:K,value:SiteContent['pages'][K])=>setDraft({...draft,pages:{...draft.pages,[key]:value}});
  const save=()=>onChange({...sandbox,content:draft});

  return <section className="admin-section admin-content-editor">
    <div className="admin-section-head"><div><h2>Pages & site content</h2><p className="muted">Edit the copy for every public page. Menu items, boutique products, team and music have their own dedicated editors.</p></div><button className="admin-primary" onClick={save}>Save page content</button></div>
    <div className="admin-content-tabs" role="tablist">{tabs.map(x=><button key={x.id} className={tab===x.id?'active':''} onClick={()=>setTab(x.id)}>{x.label}</button>)}</div>

    {tab==='general'&&<div className="admin-form two admin-content-panel">
      <Input label="Announcement" value={draft.announcement} onChange={v=>setDraft({...draft,announcement:v})}/>
      <Input label="Phone" value={draft.phone} onChange={v=>setDraft({...draft,phone:v})}/>
      <Input label="Email" value={draft.email} onChange={v=>setDraft({...draft,email:v})}/>
      <Input label="Location label" value={draft.address} onChange={v=>setDraft({...draft,address:v})}/>
      <label>Map latitude<input type="number" step="0.0001" value={draft.mapLat} onChange={e=>setDraft({...draft,mapLat:Number(e.target.value)})}/></label>
      <label>Map longitude<input type="number" step="0.0001" value={draft.mapLng} onChange={e=>setDraft({...draft,mapLng:Number(e.target.value)})}/></label>
    </div>}

    {tab==='home'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.home.heroEyebrow} onChange={v=>setPage('home',{...page.home,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.home.heroTitle} onChange={v=>setPage('home',{...page.home,heroTitle:v})}/>
      <Text label="Hero description" value={page.home.heroText} onChange={v=>setPage('home',{...page.home,heroText:v})} wide/>
      <Input label="House section title" value={page.home.houseTitle} onChange={v=>setPage('home',{...page.home,houseTitle:v})}/>
      <Text label="House section copy" value={page.home.houseText} onChange={v=>setPage('home',{...page.home,houseText:v})}/>
      <Input label="Kitchen section title" value={page.home.kitchenTitle} onChange={v=>setPage('home',{...page.home,kitchenTitle:v})}/>
      <Text label="Kitchen section copy" value={page.home.kitchenText} onChange={v=>setPage('home',{...page.home,kitchenText:v})}/>
      <Input label="Boutique teaser title" value={page.home.boutiqueTitle} onChange={v=>setPage('home',{...page.home,boutiqueTitle:v})}/>
      <Text label="Boutique teaser copy" value={page.home.boutiqueText} onChange={v=>setPage('home',{...page.home,boutiqueText:v})}/>
    </div>}

    {tab==='story'&&<div className="admin-content-panel">
      <div className="admin-form two">
        <Input label="Hero eyebrow" value={page.story.heroEyebrow} onChange={v=>setPage('story',{...page.story,heroEyebrow:v})}/>
        <Input label="Hero title" value={page.story.heroTitle} onChange={v=>setPage('story',{...page.story,heroTitle:v})}/>
        <Text label="Hero description" value={page.story.heroText} onChange={v=>setPage('story',{...page.story,heroText:v})} wide/>
        <Input label="History section title" value={page.story.introTitle} onChange={v=>setPage('story',{...page.story,introTitle:v})}/>
        <Text label="History intro" value={page.story.introText} onChange={v=>setPage('story',{...page.story,introText:v})}/>
        <Input label="Feature title" value={page.story.featureTitle} onChange={v=>setPage('story',{...page.story,featureTitle:v})}/>
        <Text label="Feature copy" value={page.story.featureText} onChange={v=>setPage('story',{...page.story,featureText:v})}/>
        <Input label="Team title" value={page.story.teamTitle} onChange={v=>setPage('story',{...page.story,teamTitle:v})}/>
        <Text label="Team copy" value={page.story.teamText} onChange={v=>setPage('story',{...page.story,teamText:v})}/>
        <Input label="Music title" value={page.story.musicTitle} onChange={v=>setPage('story',{...page.story,musicTitle:v})}/>
        <Text label="Music copy" value={page.story.musicText} onChange={v=>setPage('story',{...page.story,musicText:v})}/>
      </div>
      <div className="admin-story-chapters"><div className="admin-subhead"><strong>History chapters</strong><span>Edit the five timeline entries shown on Story.</span></div>{page.story.timeline.map((chapter,index)=><div className="admin-story-chapter" key={index}><input aria-label="Year" value={chapter.year} onChange={e=>{const timeline=[...page.story.timeline];timeline[index]={...chapter,year:e.target.value};setPage('story',{...page.story,timeline})}}/><input aria-label="Title" value={chapter.title} onChange={e=>{const timeline=[...page.story.timeline];timeline[index]={...chapter,title:e.target.value};setPage('story',{...page.story,timeline})}}/><textarea aria-label="Chapter text" rows={3} value={chapter.text} onChange={e=>{const timeline=[...page.story.timeline];timeline[index]={...chapter,text:e.target.value};setPage('story',{...page.story,timeline})}}/></div>)}</div>
    </div>}

    {tab==='menu'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.menu.heroEyebrow} onChange={v=>setPage('menu',{...page.menu,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.menu.heroTitle} onChange={v=>setPage('menu',{...page.menu,heroTitle:v})}/>
      <Input label="Book section title" value={page.menu.bookTitle} onChange={v=>setPage('menu',{...page.menu,bookTitle:v})}/>
      <Input label="Book helper text" value={page.menu.bookHelp} onChange={v=>setPage('menu',{...page.menu,bookHelp:v})}/>
      <Input label="Tasting menu title" value={page.menu.tastingTitle} onChange={v=>setPage('menu',{...page.menu,tastingTitle:v})}/>
      <Text label="Tasting menu copy" value={page.menu.tastingText} onChange={v=>setPage('menu',{...page.menu,tastingText:v})}/>
    </div>}

    {tab==='boutique'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.boutique.heroEyebrow} onChange={v=>setPage('boutique',{...page.boutique,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.boutique.heroTitle} onChange={v=>setPage('boutique',{...page.boutique,heroTitle:v})}/>
      <Text label="Hero description" value={page.boutique.heroText} onChange={v=>setPage('boutique',{...page.boutique,heroText:v})} wide/>
      <Input label="Intro title" value={page.boutique.introTitle} onChange={v=>setPage('boutique',{...page.boutique,introTitle:v})}/>
      <Text label="Intro copy" value={page.boutique.introText} onChange={v=>setPage('boutique',{...page.boutique,introText:v})}/>
      <Input label="Feature title" value={page.boutique.featureTitle} onChange={v=>setPage('boutique',{...page.boutique,featureTitle:v})}/>
      <Text label="Feature copy" value={page.boutique.featureText} onChange={v=>setPage('boutique',{...page.boutique,featureText:v})}/>
      <Input label="Catalogue title" value={page.boutique.catalogueTitle} onChange={v=>setPage('boutique',{...page.boutique,catalogueTitle:v})}/>
      <Text label="Catalogue copy" value={page.boutique.catalogueText} onChange={v=>setPage('boutique',{...page.boutique,catalogueText:v})}/>
    </div>}

    {tab==='reservations'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.reservations.heroEyebrow} onChange={v=>setPage('reservations',{...page.reservations,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.reservations.heroTitle} onChange={v=>setPage('reservations',{...page.reservations,heroTitle:v})}/>
      <Text label="Hero description" value={page.reservations.heroText} onChange={v=>setPage('reservations',{...page.reservations,heroText:v})} wide/>
    </div>}

    {tab==='visit'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.visit.heroEyebrow} onChange={v=>setPage('visit',{...page.visit,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.visit.heroTitle} onChange={v=>setPage('visit',{...page.visit,heroTitle:v})}/>
      <Text label="Hero description" value={page.visit.heroText} onChange={v=>setPage('visit',{...page.visit,heroText:v})} wide/>
      <Input label="Neighbourhood title" value={page.visit.neighbourhoodTitle} onChange={v=>setPage('visit',{...page.visit,neighbourhoodTitle:v})}/>
      <Text label="Neighbourhood copy" value={page.visit.neighbourhoodText} onChange={v=>setPage('visit',{...page.visit,neighbourhoodText:v})}/>
    </div>}

    {tab==='account'&&<div className="admin-form two admin-content-panel">
      <Input label="Hero eyebrow" value={page.account.heroEyebrow} onChange={v=>setPage('account',{...page.account,heroEyebrow:v})}/>
      <Input label="Hero title" value={page.account.heroTitle} onChange={v=>setPage('account',{...page.account,heroTitle:v})}/>
      <Text label="Hero description" value={page.account.heroText} onChange={v=>setPage('account',{...page.account,heroText:v})} wide/>
    </div>}
  </section>;
}
