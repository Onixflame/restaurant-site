import { BOUTIQUE_DEFAULTS, MENU_DEFAULTS, MUSIC_DEFAULTS, SITE_CONTENT_DEFAULTS, TEAM_DEFAULTS } from '../data';
import type { DemoSandbox, GuestProfile, PrivateInquiry, Reservation, SettledCheck } from '../types/domain';
import { deepClone } from './format';

const SANDBOX_KEY = 'onix_sandbox_v8';
const RESERVATIONS_KEY = 'onix_demo_reservations_v6';
const INQUIRIES_KEY = 'onix_demo_inquiries_v6';
const ADMIN_SESSION_KEY = 'onix_admin_session_v7';
const GUEST_SESSION_KEY = 'onix_guest_session_v6';
const GUEST_SESSION_PROFILE_KEY = 'onix_guest_session_profile_v6';
const ADMIN_NOTIFICATIONS_KEY = 'onix_admin_notifications_v6';
const SETTLED_CHECKS_KEY = 'onix_settled_checks_v1';
const GUEST_ACCOUNTS_KEY = 'onix_guest_accounts_v1';
const ADMIN_MUTATION_SNAPSHOT_KEY = 'onix_admin_mutation_snapshot_v2';
const ADMIN_ROLLBACK_SIGNAL_KEY = 'onix_admin_rollback_signal_v1';
export const ADMIN_EDIT_TTL = 10 * 60 * 1000;

const ADMIN_MUTABLE_KEYS = [
  SANDBOX_KEY,
  RESERVATIONS_KEY,
  INQUIRIES_KEY,
  SETTLED_CHECKS_KEY,
  GUEST_ACCOUNTS_KEY,
] as const;

type AdminMutationSnapshot = {
  createdAt: number;
  expiresAt: number;
  values: Record<string, string | null>;
};

const SERVICE_WORDS = ['OBSIDIAN','EMBER','VELVET','CINDER','SAFFRON','JUNIPER','ONYX','NOCTURNE','CEDAR','VERBENA','GARNET','VESPER'];
export const randomServiceWord = () => SERVICE_WORDS[Math.floor(Math.random() * SERVICE_WORDS.length)];

const readAdminMutationSnapshot = (): AdminMutationSnapshot | null => {
  try {
    const raw = localStorage.getItem(ADMIN_MUTATION_SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) as AdminMutationSnapshot : null;
  } catch { return null; }
};

export const restoreExpiredAdminChanges = (force = false) => {
  if (typeof window === 'undefined') return false;
  const snapshot = readAdminMutationSnapshot();
  if (!snapshot) return false;
  if (!force && Date.now() < snapshot.expiresAt) return false;

  for (const key of ADMIN_MUTABLE_KEYS) {
    const value = snapshot.values[key] ?? null;
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  }
  localStorage.removeItem(ADMIN_MUTATION_SNAPSHOT_KEY);
  localStorage.setItem(ADMIN_ROLLBACK_SIGNAL_KEY, String(Date.now()));
  return true;
};

export const beginAdminMutationWindow = () => {
  restoreExpiredAdminChanges();
  const now = Date.now();
  const expiresAt = now + ADMIN_EDIT_TTL;
  const current = readAdminMutationSnapshot();
  if (current) {
    localStorage.setItem(ADMIN_MUTATION_SNAPSHOT_KEY, JSON.stringify({ ...current, expiresAt }));
    return expiresAt;
  }

  const values: Record<string, string | null> = {};
  for (const key of ADMIN_MUTABLE_KEYS) values[key] = localStorage.getItem(key);
  localStorage.setItem(ADMIN_MUTATION_SNAPSHOT_KEY, JSON.stringify({ createdAt: now, expiresAt, values } satisfies AdminMutationSnapshot));
  return expiresAt;
};

export const getAdminMutationExpiresAt = () => {
  restoreExpiredAdminChanges();
  return readAdminMutationSnapshot()?.expiresAt ?? null;
};

export const restoreAdminChangesNow = () => restoreExpiredAdminChanges(true);
export const getAdminRollbackSignalKey = () => ADMIN_ROLLBACK_SIGNAL_KEY;

export const createGuestProfile = (): GuestProfile => ({
  name: 'Alex Morgan',
  email: 'guest@onix.demo',
  memberId: '001728',
  serviceWord: randomServiceWord(),
  lifetimeSpend: 3420,
  membershipThreshold: 5000,
});

export const createSandbox = (): DemoSandbox => {
  const sandbox: DemoSandbox = {
    createdAt: Date.now(),
    expiresAt: Date.now() + ADMIN_EDIT_TTL,
    menu: deepClone(MENU_DEFAULTS),
    boutique: deepClone(BOUTIQUE_DEFAULTS),
    music: deepClone(MUSIC_DEFAULTS),
    team: deepClone(TEAM_DEFAULTS),
    content: deepClone(SITE_CONTENT_DEFAULTS),
    guestProfile: createGuestProfile(),
    tableOverrides: {},
  };
  localStorage.setItem(SANDBOX_KEY, JSON.stringify(sandbox));
  return sandbox;
};

export const getSandbox = (): DemoSandbox | null => {
  restoreExpiredAdminChanges();
  try {
    const raw = localStorage.getItem(SANDBOX_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as DemoSandbox;
    if (!value.boutique || !value.guestProfile || !value.content?.pages) return null;
    return value;
  } catch { return null; }
};

export const ensureSandbox = () => getSandbox() ?? createSandbox();
export const saveSandbox = (value: DemoSandbox) => localStorage.setItem(SANDBOX_KEY, JSON.stringify(value));
export const getGuestProfile = () => ensureSandbox().guestProfile;
export const saveGuestProfile = (profile: GuestProfile) => {
  const sandbox = ensureSandbox();
  sandbox.guestProfile = profile;
  saveSandbox(sandbox);
  return profile;
};
export const resetSandbox = () => {
  localStorage.removeItem(ADMIN_MUTATION_SNAPSHOT_KEY);
  localStorage.removeItem(SANDBOX_KEY);
  localStorage.removeItem(RESERVATIONS_KEY);
  localStorage.removeItem(INQUIRIES_KEY);
  localStorage.removeItem(ADMIN_NOTIFICATIONS_KEY);
  localStorage.removeItem(SETTLED_CHECKS_KEY);
  return createSandbox();
};

export const getReservations = (): Reservation[] => {
  restoreExpiredAdminChanges();
  try { return JSON.parse(localStorage.getItem(RESERVATIONS_KEY) ?? '[]') as Reservation[]; }
  catch { return []; }
};
export const saveReservations = (value: Reservation[]) => localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(value));

export const getInquiries = (): PrivateInquiry[] => {
  restoreExpiredAdminChanges();
  try { return JSON.parse(localStorage.getItem(INQUIRIES_KEY) ?? '[]') as PrivateInquiry[]; }
  catch { return []; }
};
export const saveInquiries = (value: PrivateInquiry[]) => localStorage.setItem(INQUIRIES_KEY, JSON.stringify(value));

const demoSettledChecks = (): SettledCheck[] => [
  { id:'C1728', email:'guest@onix.demo', guestName:'Alex Morgan', date:'2026-09-04', time:'20:00', table:12, guests:2, amount:1240, summary:'Chef tasting · wine pairing', createdAt:new Date('2026-09-04T22:15:00').getTime() },
  { id:'C1641', email:'guest@onix.demo', guestName:'Alex Morgan', date:'2026-08-19', time:'19:30', table:5, guests:2, amount:980, summary:'Dinner service · cellar selection', createdAt:new Date('2026-08-19T21:48:00').getTime() },
  { id:'C1510', email:'guest@onix.demo', guestName:'Alex Morgan', date:'2026-07-28', time:'20:30', table:18, guests:4, amount:1200, summary:'Private dinner · seasonal menu', createdAt:new Date('2026-07-28T23:05:00').getTime() },
];

export const getSettledChecks = (): SettledCheck[] => {
  restoreExpiredAdminChanges();
  try {
    const raw=localStorage.getItem(SETTLED_CHECKS_KEY);
    if(raw) return JSON.parse(raw) as SettledCheck[];
    const seeded=demoSettledChecks();
    localStorage.setItem(SETTLED_CHECKS_KEY,JSON.stringify(seeded));
    return seeded;
  } catch { return demoSettledChecks(); }
};
export const saveSettledChecks = (value:SettledCheck[]) => localStorage.setItem(SETTLED_CHECKS_KEY,JSON.stringify(value));
export const getSettledChecksForEmail = (email:string) => getSettledChecks().filter(x=>x.email.toLowerCase()===email.trim().toLowerCase()).sort((a,b)=>b.createdAt-a.createdAt);
export const addSettledCheck = (check:Omit<SettledCheck,'id'|'createdAt'>) => {
  const list=getSettledChecks();
  const next: SettledCheck = { ...check, id:`C${Math.floor(1000+Math.random()*9000)}`, createdAt:Date.now() };
  saveSettledChecks([next,...list]);
  return next;
};

export const setAdminSession = (enabled: boolean) => sessionStorage.setItem(ADMIN_SESSION_KEY, enabled ? '1' : '0');
export const hasAdminSession = () => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1';
export const setGuestSession = (enabled: boolean, profile?: GuestProfile) => {
  sessionStorage.setItem(GUEST_SESSION_KEY, enabled ? '1' : '0');
  if (!enabled) sessionStorage.removeItem(GUEST_SESSION_PROFILE_KEY);
  else if (profile) sessionStorage.setItem(GUEST_SESSION_PROFILE_KEY, JSON.stringify(profile));
};
export const hasGuestSession = () => sessionStorage.getItem(GUEST_SESSION_KEY) === '1';
export const getSessionGuestProfile = (): GuestProfile => {
  try {
    const raw=sessionStorage.getItem(GUEST_SESSION_PROFILE_KEY);
    return raw ? JSON.parse(raw) as GuestProfile : getGuestProfile();
  } catch { return getGuestProfile(); }
};

export type AdminNotificationState = { reservationsSeenAt: number; inquiriesSeenAt: number; };
const emptyNotificationState = (): AdminNotificationState => ({ reservationsSeenAt: 0, inquiriesSeenAt: 0 });

export const getAdminNotificationState = (): AdminNotificationState => {
  restoreExpiredAdminChanges();
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY);
    if (!raw) return emptyNotificationState();
    const parsed = JSON.parse(raw) as Partial<AdminNotificationState>;
    return { reservationsSeenAt: Number(parsed.reservationsSeenAt ?? 0), inquiriesSeenAt: Number(parsed.inquiriesSeenAt ?? 0) };
  } catch { return emptyNotificationState(); }
};

export const markAdminNotificationsSeen = (kind: 'reservations' | 'inquiries', seenAt = Date.now()) => {
  const current = getAdminNotificationState();
  const next: AdminNotificationState = kind === 'reservations'
    ? { ...current, reservationsSeenAt: seenAt }
    : { ...current, inquiriesSeenAt: seenAt };
  localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(next));
  return next;
};
