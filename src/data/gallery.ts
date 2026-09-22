export type GalleryFloor = 'Ground floor' | 'First floor';

export interface GalleryImage {
  id: number;
  floor: GalleryFloor;
  title: string;
  subtitle: string;
  image: string;
  position?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    floor: 'Ground floor',
    title: 'Main Dining Room',
    subtitle: 'A full-room view of the lower dining level: vaulted ceiling, warm timber and the main tables arranged for dinner.',
    image: 'https://images.unsplash.com/photo-1758414335367-22163f4f310c?auto=format&fit=crop&w=2200&q=82',
    position: 'center 52%'
  },
  {
    id: 2,
    floor: 'Ground floor',
    title: 'Stone Hall & Bar',
    subtitle: 'The lower level continues into stone walls, wine storage and a darker bar-side dining area.',
    image: 'https://images.unsplash.com/photo-1775124270427-dd7503c0b264?auto=format&fit=crop&w=2200&q=82',
    position: 'center 50%'
  },
  {
    id: 3,
    floor: 'Ground floor',
    title: 'Stair Hall',
    subtitle: 'A wide view around the central stair where the ground-floor dining room connects to the upper level.',
    image: 'https://images.unsplash.com/photo-1769867863357-790b6150e3b8?auto=format&fit=crop&w=2200&q=82',
    position: 'center 48%'
  },
  {
    id: 4,
    floor: 'First floor',
    title: 'Balcony Dining',
    subtitle: 'The first floor overlooks the lower room, making the two-storey plan visible from the dining balcony.',
    image: 'https://images.unsplash.com/photo-1767675293815-aada014719d4?auto=format&fit=crop&w=2200&q=82',
    position: 'center 50%'
  },
  {
    id: 5,
    floor: 'First floor',
    title: 'Window Salon',
    subtitle: 'A broader upper-floor dining room with windows, tables and quieter seating away from the main service floor.',
    image: 'https://images.unsplash.com/photo-1711906439107-9c4f08e8c526?auto=format&fit=crop&w=2200&q=82',
    position: 'center 48%'
  },
  {
    id: 6,
    floor: 'First floor',
    title: 'Library Dining Room',
    subtitle: 'The most intimate upper-level room: dining tables set against book-lined walls and dark wood paneling.',
    image: 'https://images.unsplash.com/photo-1764687136857-bcfc8c1da1a0?auto=format&fit=crop&w=2200&q=82',
    position: 'center 48%'
  }
];
