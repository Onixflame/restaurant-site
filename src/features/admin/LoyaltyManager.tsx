import { useEffect, useState } from 'react';
import { randomServiceWord } from '../../lib/demoStore';
import type { DemoSandbox } from '../../types/domain';

export function LoyaltyManager({sandbox,onChange}:{sandbox:DemoSandbox;onChange:(s:DemoSandbox)=>void}){
  const [draft,setDraft]=useState(sandbox.guestProfile);
  const [spokenWord,setSpokenWord]=useState('');
  const [bill,setBill]=useState(180);
  const [message,setMessage]=useState('');
  useEffect(()=>setDraft(sandbox.guestProfile),[sandbox.createdAt]);
  const progress=Math.min(100,(draft.lifetimeSpend/draft.membershipThreshold)*100);
  const unlocked=draft.lifetimeSpend>=draft.membershipThreshold;
  const save=()=>{onChange({...sandbox,guestProfile:draft});setMessage('Guest profile saved to the sandbox.')};
  const postVisit=()=>{
    if(spokenWord.trim().toUpperCase()!==draft.serviceWord.toUpperCase()){setMessage('Service word does not match this guest profile.');return;}
    if(!Number.isFinite(bill)||bill<=0){setMessage('Enter a settled bill amount above $0.');return;}
    const next={...draft,lifetimeSpend:Math.round((draft.lifetimeSpend+bill)*100)/100};
    setDraft(next);onChange({...sandbox,guestProfile:next});setSpokenWord('');setMessage(`$${bill.toLocaleString()} added to qualifying spend.`);
  };
  return <section className="admin-section">
    <div className="admin-section-head"><div><h2>Guest loyalty</h2><p className="muted">Manage the demo diner’s service word, cumulative spend and Black Stone membership state.</p></div><button className="admin-primary" onClick={save}>Save guest profile</button></div>
    <div className="admin-loyalty-grid">
      <div>
        <div className="admin-form two">
          <label>Guest name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label>
          <label>Email<input value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/></label>
          <label>Member number<input value={draft.memberId} onChange={e=>setDraft({...draft,memberId:e.target.value})}/></label>
          <label>Service word<div className="admin-inline-input"><input value={draft.serviceWord} onChange={e=>setDraft({...draft,serviceWord:e.target.value.toUpperCase().replace(/[^A-Z]/g,'')})}/><button type="button" onClick={()=>setDraft({...draft,serviceWord:randomServiceWord()})}>Regenerate</button></div></label>
          <label>Qualifying spend ($)<input type="number" min="0" step="10" value={draft.lifetimeSpend} onChange={e=>setDraft({...draft,lifetimeSpend:Math.max(0,Number(e.target.value))})}/></label>
          <label>Membership threshold ($)<input type="number" min="1" step="100" value={draft.membershipThreshold} onChange={e=>setDraft({...draft,membershipThreshold:Math.max(1,Number(e.target.value))})}/></label>
        </div>
        <div className="admin-settlement-demo">
          <div className="admin-subhead"><strong>Waiter checkout simulation</strong><span>Demonstrates how the service word attaches a settled bill to the guest.</span></div>
          <div className="admin-settlement-fields"><label>Word spoken by guest<input placeholder="e.g. OBSIDIAN" value={spokenWord} onChange={e=>setSpokenWord(e.target.value.toUpperCase())}/></label><label>Settled bill ($)<input type="number" min="1" value={bill} onChange={e=>setBill(Number(e.target.value))}/></label><button className="admin-primary" onClick={postVisit}>Attach spend</button></div>
          {message&&<div className="admin-inline-message">{message}</div>}
        </div>
      </div>
      <aside className="admin-loyalty-preview">
        <span>Membership preview</span><strong>{Math.round(progress)}%</strong>
        <div className="admin-loyalty-track"><i style={{width:`${progress}%`}}/></div>
        <p>${draft.lifetimeSpend.toLocaleString()} of ${draft.membershipThreshold.toLocaleString()}</p>
        <div className={`admin-member-preview ${unlocked?'unlocked':''}`}><small>{unlocked?'BLACK STONE MEMBER':'IN PROGRESS'}</small><b>{draft.name}</b><em>{draft.serviceWord}</em></div>
        <p className="muted">At ${draft.membershipThreshold.toLocaleString()}, Account automatically switches from the invitation card to the named Black Stone member card.</p>
      </aside>
    </div>
  </section>;
}
