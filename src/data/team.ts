import type { TeamMember } from '../types/domain';

export const TEAM_DEFAULTS: TeamMember[] = [
  {
    name: 'Mara Voss',
    role: 'Executive Chef',
    bio: 'Mara leads a fire-led kitchen that moves between Central European produce and precise contemporary technique.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=88'
  },
  {
    name: 'Jakub Šíma',
    role: 'General Manager',
    bio: 'Jakub shapes the room: measured pacing, warm service and the sense that no table is being rushed.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=88'
  },
  {
    name: 'Elena Rossi',
    role: 'Pastry Chef',
    bio: 'Elena keeps dessert focused on fruit, toasted grain, dairy and bitterness rather than overt sweetness.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=88'
  },
  {
    name: 'Tomáš Havel',
    role: 'Head Sommelier',
    bio: 'Tomáš curates a compact cellar built around Czech growers, Burgundy, Northern Italy and low-intervention producers.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=88'
  }
] as TeamMember[];
