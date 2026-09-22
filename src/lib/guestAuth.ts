import type { GuestProfile } from '../types/domain';
import { getGuestProfile, randomServiceWord, saveGuestProfile, setGuestSession } from './demoStore';

const LOCAL_ACCOUNTS_KEY = 'onix_guest_accounts_v1';
const LOCAL_TTL = 24 * 60 * 60 * 1000;

export type AuthErrorCode = 'ACCOUNT_NOT_FOUND' | 'INVALID_PASSWORD' | 'ACCOUNT_EXISTS' | 'INVALID_INPUT' | 'UNKNOWN';
export class GuestAuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message: string) { super(message); this.code = code; }
}

type StoredAccount = {
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  profile: GuestProfile;
  expiresAt: number;
};

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const toHex = (bytes: Uint8Array) => Array.from(bytes).map(v => v.toString(16).padStart(2,'0')).join('');
const randomSalt = () => {
  const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); return toHex(bytes);
};
const localHash = async (password: string, salt: string) => {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)));
};
const memberId = () => String(Math.floor(100000 + Math.random() * 900000));
const readLocal = (): StoredAccount[] => {
  try {
    const now = Date.now();
    const list = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) ?? '[]') as StoredAccount[];
    const alive = list.filter(item => item.expiresAt > now);
    if (alive.length !== list.length) localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(alive));
    return alive;
  } catch { return []; }
};
const saveLocal = (list: StoredAccount[]) => localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(list));

const requestApi = async <T>(url: string, init: RequestInit): Promise<T | null> => {
  try {
    const res = await fetch(url, { ...init, headers: { 'content-type':'application/json', ...(init.headers ?? {}) } });
    const type = res.headers.get('content-type') ?? '';
    if (!type.includes('application/json')) return null; // Vite dev fallback
    const body = await res.json() as any;
    if (!res.ok) {
      const code = (body?.code ?? 'UNKNOWN') as AuthErrorCode;
      throw new GuestAuthError(code, body?.message ?? 'Unable to continue.');
    }
    return body as T;
  } catch (error) {
    if (error instanceof GuestAuthError) throw error;
    return null;
  }
};

const createProfile = (name: string, email: string): GuestProfile => ({
  name: name.trim(), email: normalizeEmail(email), memberId: memberId(), serviceWord: randomServiceWord(),
  lifetimeSpend: 0, membershipThreshold: 5000,
});

export async function registerGuestAccount(name: string, email: string, password: string): Promise<GuestProfile> {
  const normalized = normalizeEmail(email);
  if (name.trim().length < 2 || !normalized.includes('@') || password.length < 8) {
    throw new GuestAuthError('INVALID_INPUT','Use your name, a valid email and a password of at least 8 characters.');
  }
  const api = await requestApi<{profile:GuestProfile}>('/api/auth/register', {
    method:'POST', body:JSON.stringify({ name:name.trim(), email:normalized, password })
  });
  if (api) return api.profile;

  const list = readLocal();
  if (list.some(item => item.email === normalized)) throw new GuestAuthError('ACCOUNT_EXISTS','An ONIX account with this email already exists.');
  const salt = randomSalt();
  const profile = createProfile(name, normalized);
  list.push({ email:normalized, name:name.trim(), passwordHash:await localHash(password,salt), salt, profile, expiresAt:Date.now()+LOCAL_TTL });
  saveLocal(list);
  return profile;
}

export async function loginGuestAccount(email: string, password: string): Promise<GuestProfile> {
  const normalized = normalizeEmail(email);
  const api = await requestApi<{profile:GuestProfile}>('/api/auth/login', {
    method:'POST', body:JSON.stringify({ email:normalized, password })
  });
  if (api) return api.profile;

  const account = readLocal().find(item => item.email === normalized);
  if (!account) throw new GuestAuthError('ACCOUNT_NOT_FOUND',"We couldn't find an ONIX account with that email.");
  if (await localHash(password, account.salt) !== account.passwordHash) {
    throw new GuestAuthError('INVALID_PASSWORD',"The password doesn't match this account.");
  }
  return account.profile;
}


export function findGuestProfileByEmail(email:string): GuestProfile | null {
  const normalized=normalizeEmail(email);
  if(normalized==='guest@onix.demo') return getGuestProfile();
  return readLocal().find(item=>item.email===normalized)?.profile ?? null;
}

export function creditGuestSpend(email:string, amount:number): GuestProfile | null {
  const normalized=normalizeEmail(email);
  if(!Number.isFinite(amount)||amount<=0) return findGuestProfileByEmail(normalized);
  if(normalized==='guest@onix.demo'){
    const current=getGuestProfile();
    const next={...current,lifetimeSpend:Math.round((current.lifetimeSpend+amount)*100)/100};
    saveGuestProfile(next);
    try { if(sessionStorage.getItem('onix_guest_session_v6')==='1') setGuestSession(true,next); } catch {}
    return next;
  }
  const list=readLocal();
  const index=list.findIndex(item=>item.email===normalized);
  if(index<0) return null;
  const nextProfile={...list[index].profile,lifetimeSpend:Math.round((list[index].profile.lifetimeSpend+amount)*100)/100};
  list[index]={...list[index],profile:nextProfile};
  saveLocal(list);
  try {
    const raw=sessionStorage.getItem('onix_guest_session_profile_v6');
    if(raw){const active=JSON.parse(raw) as GuestProfile;if(active.email.toLowerCase()===normalized)setGuestSession(true,nextProfile)}
  } catch {}
  return nextProfile;
}
