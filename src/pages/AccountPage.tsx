import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { DemoCredentialsModal } from '../features/account/DemoCredentialsModal';
import { effectiveContent } from '../lib/dataSource';
import {
  getGuestProfile,
  getReservations,
  getSettledChecksForEmail,
  getSessionGuestProfile,
  hasGuestSession,
  getAdminRollbackSignalKey,
  setAdminSession,
  setGuestSession,
} from '../lib/demoStore';
import { findGuestProfileByEmail, GuestAuthError, loginGuestAccount, registerGuestAccount } from '../lib/guestAuth';
import type { GuestProfile } from '../types/domain';

function MemberCard({ name, memberId }: { name:string; memberId:string }){
  return <div className="membership-card membership-card-finished" aria-label={`ONIX membership card for ${name}`}>
    <div className="membership-shine"/>
    <div className="membership-top"><span>ONIX</span><small>MEMBERSHIP CARD</small></div>
    <div className="membership-name">{name}</div>
    <div className="membership-number">MEMBER · {memberId}</div>
    <div className="membership-bottom"><span>BLACK STONE</span><i>PRAGUE</i></div>
  </div>;
}

function AuthAlert({ message, onClose }: { message:string; onClose:()=>void }){
  return <div className="auth-alert" role="alert" aria-live="assertive">
    <span className="auth-alert-icon">!</span>
    <div><strong>Account notice</strong><p>{message}</p></div>
    <button type="button" onClick={onClose} aria-label="Dismiss account notice">×</button>
  </div>;
}

export function AccountPage(){
  const [hint,setHint]=useState(true);
  const [guest,setGuest]=useState(hasGuestSession());
  const [profile,setProfile]=useState<GuestProfile>(()=>getSessionGuestProfile());
  const [authMode,setAuthMode]=useState<'signin'|'register'>('signin');
  const [guestError,setGuestError]=useState('');
  const [adminError,setAdminError]=useState('');
  const [authBusy,setAuthBusy]=useState(false);
  const nav=useNavigate();
  const reservations=getReservations().filter(r=>r.email.toLowerCase()===profile.email.toLowerCase());
  const settledChecks=getSettledChecksForEmail(profile.email);
  const content=effectiveContent();
  const page=content.pages.account;
  const progress=Math.min(100,(profile.lifetimeSpend/profile.membershipThreshold)*100);
  const remaining=Math.max(0,profile.membershipThreshold-profile.lifetimeSpend);
  const unlocked=profile.lifetimeSpend>=profile.membershipThreshold;

  useEffect(()=>{
    const refreshAfterRollback=(event:StorageEvent)=>{
      if(event.key!==getAdminRollbackSignalKey()||!hasGuestSession()) return;
      const activeEmail=profile.email.toLowerCase();
      const refreshed=findGuestProfileByEmail(activeEmail) ?? getGuestProfile();
      setGuestSession(true,refreshed);
      setProfile(refreshed);
    };
    window.addEventListener('storage',refreshAfterRollback);
    return()=>window.removeEventListener('storage',refreshAfterRollback);
  },[profile.email]);

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuestError('');
    const f=new FormData(e.currentTarget);
    const email=String(f.get('email')??'').trim().toLowerCase();
    const password=String(f.get('password')??'');
    setAuthBusy(true);
    try {
      let nextProfile: GuestProfile;
      if(email==='guest@onix.demo'&&password==='guest24') nextProfile=getGuestProfile();
      else nextProfile=await loginGuestAccount(email,password);
      setGuestSession(true,nextProfile);
      setProfile(nextProfile);
      setGuest(true);
    } catch(error) {
      if(error instanceof GuestAuthError) setGuestError(error.message);
      else setGuestError('We could not sign you in. Please try again.');
    } finally { setAuthBusy(false); }
  };

  const register = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuestError('');
    const f=new FormData(e.currentTarget);
    const name=String(f.get('name')??'').trim();
    const email=String(f.get('email')??'').trim();
    const password=String(f.get('password')??'');
    const confirm=String(f.get('confirm')??'');
    if(password!==confirm){ setGuestError('The two passwords do not match.'); return; }
    setAuthBusy(true);
    try {
      const nextProfile=await registerGuestAccount(name,email,password);
      setGuestSession(true,nextProfile);
      setProfile(nextProfile);
      setGuest(true);
    } catch(error) {
      if(error instanceof GuestAuthError) setGuestError(error.message);
      else setGuestError('We could not create the account. Please try again.');
    } finally { setAuthBusy(false); }
  };

  return <PageShell>
    <section className="account-hero-v5 account-hero-loyalty">
      <div className="account-hero-image"/>
      <div className="account-hero-shade"/>
      <div className="wrap account-hero-content">
        <div className="account-hero-copy reveal"><div className="eyebrow">{page.heroEyebrow}</div><h1>{page.heroTitle}</h1><p>{page.heroText}</p></div>
        <MemberCard name="NAME SURNAME" memberId="000000"/>
      </div>
    </section>

    {hint&&<DemoCredentialsModal onClose={()=>setHint(false)}/>}<section className="account-wrap"><div className="wrap">{!guest?<div className="account-grid">
      <div className="login-card guest-auth-card reveal is-visible">
        <div className="account-auth-tabs" role="tablist" aria-label="Guest account options">
          <button type="button" className={authMode==='signin'?'active':''} onClick={()=>{setAuthMode('signin');setGuestError('')}}>Sign in</button>
          <button type="button" className={authMode==='register'?'active':''} onClick={()=>{setAuthMode('register');setGuestError('')}}>Create account</button>
        </div>

        {authMode==='signin'?<>
          <div className="kicker">Guest account</div><h2>Welcome back</h2>
          <p className="copy">Sign in to see reservations, previous bills, your ONIX word and Black Stone membership progress.</p>
          <div className="credential-card"><strong>Demo guest credentials</strong><p>Email: <code>guest@onix.demo</code><br/>Password: <code>guest24</code></p></div>
          {guestError&&<AuthAlert message={guestError} onClose={()=>setGuestError('')}/>} 
          <form className="form-grid" onSubmit={signIn}>
            <div className="field"><label>Email</label><input name="email" type="email" autoComplete="email" defaultValue="guest@onix.demo" required/></div>
            <div className="field"><label>Password</label><input name="password" type="password" autoComplete="current-password" defaultValue="guest24" required/></div>
            <button className="btn dark" disabled={authBusy}>{authBusy?'Checking account…':'Open guest account'}</button>
          </form>
          <button className="auth-inline-link" type="button" onClick={()=>{setAuthMode('register');setGuestError('')}}>New to ONIX? Create an account</button>
        </>:<>
          <div className="kicker">ONIX guest profile</div><h2>Create your account</h2>
          <p className="copy">Create a guest profile with a unique ONIX word and a fresh path toward Black Stone membership.</p>
          <div className="registration-note"><strong>Portfolio demo</strong><span>Guest accounts created here are temporary and automatically expire.</span></div>
          {guestError&&<AuthAlert message={guestError} onClose={()=>setGuestError('')}/>} 
          <form className="form-grid" onSubmit={register}>
            <div className="field"><label>Name</label><input name="name" autoComplete="name" placeholder="Name Surname" required minLength={2}/></div>
            <div className="field"><label>Email</label><input name="email" type="email" autoComplete="email" placeholder="name@example.com" required/></div>
            <div className="field"><label>Password</label><input name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" required minLength={8}/></div>
            <div className="field"><label>Confirm password</label><input name="confirm" type="password" autoComplete="new-password" placeholder="Repeat password" required minLength={8}/></div>
            <button className="btn dark" disabled={authBusy}>{authBusy?'Creating profile…':'Create ONIX account'}</button>
          </form>
          <button className="auth-inline-link" type="button" onClick={()=>{setAuthMode('signin');setGuestError('')}}>Already registered? Sign in</button>
        </>}
      </div>

      <div className="login-card admin-entry reveal reveal-delay-1 is-visible"><div className="kicker">Portfolio technical demo</div><h2>Enter ONIX Control</h2><div className="safety-note"><strong>Safe sandbox:</strong> every admin edit automatically rolls back after 10 minutes and cannot alter the protected public showcase.</div><div className="credential-card"><strong>Administrator demo</strong><p>Email: <code>admin@onix.demo</code><br/>Password: <code>onix24</code></p></div>{adminError&&<AuthAlert message={adminError} onClose={()=>setAdminError('')}/>}<form className="form-grid" onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(f.get('email')==='admin@onix.demo'&&f.get('password')==='onix24'){setAdminSession(true);nav('/admin')}else setAdminError('Administrator account not found or the password is incorrect.')}}><div className="field"><label>Email</label><input name="email" type="email" defaultValue="admin@onix.demo"/></div><div className="field"><label>Password</label><input name="password" type="password" defaultValue="onix24"/></div><button className="btn primary">Enter sandbox admin</button></form></div>
    </div>:<div className="guest-dashboard guest-dashboard-v36">
      <div className="guest-dashboard-head"><div><div className="kicker">Welcome back</div><h2>{profile.name}</h2><p className="copy">Your ONIX profile keeps reservations, previous bills and membership progress together.</p></div><button className="guest-signout" onClick={()=>{setGuestSession(false);setGuest(false);setProfile(getGuestProfile());setGuestError('')}}>Sign out</button></div>

      <section className="loyalty-grid-v36">
        <article className="loyalty-progress-card-v36">
          <div className="loyalty-card-head"><div><span>Black Stone membership</span><strong>{unlocked?'Membership unlocked':'Progress to membership'}</strong></div><b>{Math.round(progress)}%</b></div>
          <div className="loyalty-progress-track" aria-label={`${Math.round(progress)} percent toward membership`}><i style={{width:`${progress}%`}}/></div>
          <div className="loyalty-progress-meta"><div><small>Qualifying spend</small><strong>${profile.lifetimeSpend.toLocaleString()}</strong></div><div><small>Membership threshold</small><strong>${profile.membershipThreshold.toLocaleString()}</strong></div></div>
          <p>{unlocked?'Your named Black Stone card is active and appears above whenever you open Account.':`$${remaining.toLocaleString()} in qualifying spend remains before your named Black Stone card is issued.`}</p>
        </article>

        <article className="service-word-card-v36">
          <div className="service-word-orbit" aria-hidden="true"/>
          <span>Your ONIX word</span><strong>{profile.serviceWord}</strong>
          <p>Tell the service team this word before the bill is closed. The settled spend is then attached to your guest profile automatically.</p>
          <small>Private to this guest profile</small>
        </article>
      </section>

      {unlocked&&<section className="unlocked-membership-v36"><div><div className="kicker">Member card</div><h3>Your Black Stone card.</h3><p>The card is now named to you and remains visible in Account as the visual proof of membership.</p></div><MemberCard name={profile.name} memberId={profile.memberId}/></section>}

      <section className="guest-checks-v42">
        <div className="guest-reservation-head"><div><div className="kicker">Previous bills</div><h3>Your settled visits</h3><p className="copy">Every settled bill linked with your ONIX word is kept here and counts toward Black Stone membership.</p></div><div className="guest-check-total"><small>Recorded spend</small><strong>${settledChecks.reduce((sum,c)=>sum+c.amount,0).toLocaleString()}</strong></div></div>
        {settledChecks.length?<div className="guest-check-list">{settledChecks.map(check=><article className="guest-check-card" key={check.id}>
          <div className="guest-check-top"><div><span className="guest-check-id">{check.id}</span><strong>{new Date(`${check.date}T12:00:00`).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'})}</strong></div><b>${check.amount.toLocaleString()}</b></div>
          <div className="guest-check-summary">{check.summary}</div>
          <div className="guest-check-meta"><span>{check.time}</span>{check.table&&<span>Table {check.table}</span>}{check.guests&&<span>{check.guests} guest{check.guests===1?'':'s'}</span>}<span className="guest-check-settled">Settled</span></div>
        </article>)}</div>:<div className="guest-check-empty"><strong>No settled bills yet</strong><p>Your closed restaurant bills will appear here after the service team links them with your ONIX word.</p></div>}
      </section>

      <section className="guest-reservations-v36"><div className="guest-reservation-head"><div><div className="kicker">Reservations</div><h3>Your reservations</h3></div><Link to="/reservations" className="text-link">Book another table</Link></div>{reservations.length?reservations.map(r=><div className="guest-reservation" key={r.id}><strong>{r.date} · {r.time}</strong><span>Table {r.table} · {r.guests} guests · {r.status}</span></div>):<p className="copy">No reservations yet. Choose a table from the Reservations page.</p>}</section>
    </div>}</div></section>
  </PageShell>;
}
