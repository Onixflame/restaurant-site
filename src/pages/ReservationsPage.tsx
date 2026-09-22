import { PageShell } from '../components/layout/PageShell';
import { PageHero } from '../components/layout/PageHero';
import { ReservationExperience } from '../features/booking/ReservationExperience';
import { effectiveContent } from '../lib/dataSource';

export function ReservationsPage(){
  const content=effectiveContent();
  const page=content.pages.reservations;
  return <PageShell><PageHero eyebrow={page.heroEyebrow} title={page.heroTitle} className="reserve">{page.heroText}</PageHero><section className="section paper reservation-page-section"><div className="wrap"><div className="reveal"><ReservationExperience/></div></div></section></PageShell>
}
