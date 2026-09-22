import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { clearDemoPreview, getDemoPreviewToken, isDemoPreview } from '../../lib/dataSource';
import { restoreExpiredAdminChanges } from '../../lib/demoStore';

const PAGE_META: Record<string,{title:string;description:string}> = {
  '/': { title:'ONIX — Contemporary Dining in Prague', description:'ONIX is a contemporary restaurant portfolio concept in Prague, built around fire, stone, season and thoughtful hospitality.' },
  '/story': { title:'Story — ONIX Prague', description:'Discover the imagined house history, people and evening music programme behind ONIX.' },
  '/menu': { title:'Menu — ONIX Prague', description:'Explore the ONIX signature book and complete modern European menu.' },
  '/boutique': { title:'Boutique — ONIX Prague', description:'Wine, gifts and house-made objects selected for the ONIX boutique.' },
  '/reservations': { title:'Reservations — ONIX Prague', description:'Choose a date, time and exact table across both floors of ONIX.' },
  '/visit': { title:'Visit — ONIX Prague', description:'Opening hours, location, directions and private dining information for ONIX in Prague.' },
  '/account': { title:'Account — ONIX Prague', description:'Guest reservations, previous bills, ONIX word and Black Stone membership progress.' },
};

export function PageShell({ children }: { children: ReactNode }) {
  const [preview,setPreview]=useState(()=>typeof window !== 'undefined' && isDemoPreview());
  const location = useLocation();

  useEffect(() => {
    const meta=PAGE_META[location.pathname] ?? { title:'ONIX — Page not found', description:'ONIX restaurant portfolio concept.' };
    document.title=meta.title;
    const description=document.querySelector<HTMLMetaElement>('meta[name=\"description\"]');
    if(description) description.content=meta.description;
  }, [location.pathname]);

  useEffect(() => {
    const verifyPreview = () => {
      const restored=restoreExpiredAdminChanges();
      const active=isDemoPreview();
      if(preview && (!active || restored)) {
        if(restored) clearDemoPreview();
        const clean=`${window.location.pathname}${window.location.hash}`;
        window.location.replace(clean);
        return;
      }
      setPreview(active);
    };
    const timer=window.setInterval(verifyPreview,1500);
    window.addEventListener('storage',verifyPreview);
    window.addEventListener('focus',verifyPreview);
    return()=>{window.clearInterval(timer);window.removeEventListener('storage',verifyPreview);window.removeEventListener('focus',verifyPreview)};
  }, [preview]);

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(n => n.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' });
    nodes.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, [location.pathname]);

  const showMobileBar = location.pathname !== '/admin';
  const token=preview?getDemoPreviewToken():null;
  const previewSearch = token ? `?demo=${encodeURIComponent(token)}` : '';

  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{preview && <div className="demo-preview-banner"><strong>Private sandbox preview</strong><span>Only you can see these admin changes. The public portfolio site is unchanged.</span><a href="/admin">Back to Control</a></div>}<main id="main-content" key={location.pathname} className="page-enter">{children}</main>{showMobileBar && <div className="mobile-booking-bar" aria-label="Quick actions"><Link to={`/menu${previewSearch}`}>Menu</Link><Link className="mobile-booking-primary" to={`/reservations${previewSearch}`}>Reserve</Link></div>}<SiteFooter /></>;
}
