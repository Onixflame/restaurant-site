import { BOUTIQUE_DEFAULTS, MENU_DEFAULTS, MUSIC_DEFAULTS, SITE_CONTENT_DEFAULTS, TEAM_DEFAULTS } from '../data';
import { getSandbox } from './demoStore';

const PREVIEW_GLOBAL_KEY = 'onix_demo_preview_global_v7';
const PREVIEW_TAB_KEY = 'onix_demo_preview_tab_v7';
const PREVIEW_TTL = 10 * 60 * 1000;

type PreviewSession = { token:string; expiresAt:number };

const readGlobalPreview = (): PreviewSession | null => {
  try {
    const raw=localStorage.getItem(PREVIEW_GLOBAL_KEY);
    if(!raw) return null;
    const value=JSON.parse(raw) as PreviewSession;
    if(!value.token || Date.now()>=value.expiresAt){localStorage.removeItem(PREVIEW_GLOBAL_KEY);return null;}
    return value;
  } catch { return null; }
};

const tokenFromUrl = () => {
  if(typeof window==='undefined') return null;
  const value=new URLSearchParams(window.location.search).get('demo');
  return value && value!=='0' ? value : null;
};

export const startDemoPreview = () => {
  const bytes=new Uint32Array(4); crypto.getRandomValues(bytes);
  const token=Array.from(bytes).map(v=>v.toString(36)).join('');
  const session={token,expiresAt:Date.now()+PREVIEW_TTL};
  localStorage.setItem(PREVIEW_GLOBAL_KEY,JSON.stringify(session));
  sessionStorage.setItem(PREVIEW_TAB_KEY,token);
  return token;
};

export const isDemoPreview = () => {
  if (typeof window === 'undefined') return false;
  const urlMode=new URLSearchParams(window.location.search).get('demo');
  if(urlMode==='0'){sessionStorage.removeItem(PREVIEW_TAB_KEY);return false;}
  const global=readGlobalPreview();
  if(!global){sessionStorage.removeItem(PREVIEW_TAB_KEY);return false;}
  const urlToken=tokenFromUrl();
  if(urlToken){
    if(urlToken!==global.token) return false;
    sessionStorage.setItem(PREVIEW_TAB_KEY,urlToken);
    return true;
  }
  return sessionStorage.getItem(PREVIEW_TAB_KEY)===global.token;
};

export const getDemoPreviewToken = () => isDemoPreview() ? (sessionStorage.getItem(PREVIEW_TAB_KEY) ?? tokenFromUrl()) : null;

export const clearDemoPreview = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREVIEW_GLOBAL_KEY);
  sessionStorage.removeItem(PREVIEW_TAB_KEY);
};

export const effectiveMenu = () => isDemoPreview() ? (getSandbox()?.menu ?? MENU_DEFAULTS) : MENU_DEFAULTS;
export const effectiveBoutique = () => isDemoPreview() ? (getSandbox()?.boutique ?? BOUTIQUE_DEFAULTS) : BOUTIQUE_DEFAULTS;
export const effectiveMusic = () => isDemoPreview() ? (getSandbox()?.music ?? MUSIC_DEFAULTS) : MUSIC_DEFAULTS;
export const effectiveTeam = () => isDemoPreview() ? (getSandbox()?.team ?? TEAM_DEFAULTS) : TEAM_DEFAULTS;
export const effectiveContent = () => isDemoPreview() ? (getSandbox()?.content ?? SITE_CONTENT_DEFAULTS) : SITE_CONTENT_DEFAULTS;
