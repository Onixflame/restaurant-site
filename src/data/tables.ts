import type { RestaurantTable } from '../types/domain';

export const TABLES: RestaurantTable[] = [
  // Ground floor — 18 tables across five distinct zones.
  { id: 1, cap: 2, floor: 'Ground floor', zone: 'Bar Lounge', x: 12, y: 26, shape: 'round' },
  { id: 2, cap: 2, floor: 'Ground floor', zone: 'Bar Lounge', x: 23, y: 26, shape: 'round' },
  { id: 3, cap: 2, floor: 'Ground floor', zone: 'Bar Lounge', x: 32, y: 26, shape: 'round' },
  { id: 4, cap: 2, floor: 'Ground floor', zone: 'Bar Lounge', x: 18, y: 42, shape: 'round' },
  { id: 5, cap: 2, floor: 'Ground floor', zone: 'Chef’s Counter', x: 45, y: 24, shape: 'round' },
  { id: 6, cap: 2, floor: 'Ground floor', zone: 'Chef’s Counter', x: 56, y: 24, shape: 'round' },
  { id: 7, cap: 2, floor: 'Ground floor', zone: 'Chef’s Counter', x: 67, y: 24, shape: 'round' },
  { id: 8, cap: 4, floor: 'Ground floor', zone: 'Main Dining Room', x: 46, y: 47, shape: 'square' },
  { id: 9, cap: 4, floor: 'Ground floor', zone: 'Main Dining Room', x: 60, y: 47, shape: 'square' },
  { id: 10, cap: 4, floor: 'Ground floor', zone: 'Main Dining Room', x: 74, y: 47, shape: 'square' },
  { id: 11, cap: 4, floor: 'Ground floor', zone: 'Main Dining Room', x: 46, y: 71, shape: 'square' },
  { id: 12, cap: 4, floor: 'Ground floor', zone: 'Main Dining Room', x: 60, y: 71, shape: 'square' },
  { id: 13, cap: 6, floor: 'Ground floor', zone: 'Main Dining Room', x: 74, y: 71, shape: 'long' },
  { id: 14, cap: 2, floor: 'Ground floor', zone: 'Courtyard', x: 16, y: 75, shape: 'round' },
  { id: 15, cap: 4, floor: 'Ground floor', zone: 'Courtyard', x: 27, y: 75, shape: 'square' },
  { id: 16, cap: 4, floor: 'Ground floor', zone: 'Window Salon', x: 91, y: 30, shape: 'square' },
  { id: 17, cap: 4, floor: 'Ground floor', zone: 'Window Salon', x: 91, y: 50, shape: 'square' },
  { id: 18, cap: 8, floor: 'Ground floor', zone: 'Stone Room', x: 91, y: 82, shape: 'long' },

  // First floor — 18 tables across four zones.
  { id: 19, cap: 2, floor: 'First floor', zone: 'Gallery', x: 13, y: 24, shape: 'round' },
  { id: 20, cap: 2, floor: 'First floor', zone: 'Gallery', x: 27, y: 24, shape: 'round' },
  { id: 21, cap: 4, floor: 'First floor', zone: 'Gallery', x: 13, y: 51, shape: 'square' },
  { id: 22, cap: 4, floor: 'First floor', zone: 'Gallery', x: 27, y: 51, shape: 'square' },
  { id: 23, cap: 6, floor: 'First floor', zone: 'Gallery', x: 20, y: 79, shape: 'long' },
  { id: 24, cap: 2, floor: 'First floor', zone: 'Window Salon', x: 45, y: 24, shape: 'round' },
  { id: 25, cap: 2, floor: 'First floor', zone: 'Window Salon', x: 58, y: 24, shape: 'round' },
  { id: 26, cap: 4, floor: 'First floor', zone: 'Window Salon', x: 45, y: 49, shape: 'square' },
  { id: 27, cap: 4, floor: 'First floor', zone: 'Window Salon', x: 58, y: 49, shape: 'square' },
  { id: 28, cap: 6, floor: 'First floor', zone: 'Window Salon', x: 51, y: 78, shape: 'long' },
  { id: 29, cap: 2, floor: 'First floor', zone: 'Balcony', x: 76, y: 24, shape: 'round' },
  { id: 30, cap: 2, floor: 'First floor', zone: 'Balcony', x: 90, y: 24, shape: 'round' },
  { id: 31, cap: 4, floor: 'First floor', zone: 'Balcony', x: 83, y: 46, shape: 'square' },
  { id: 32, cap: 4, floor: 'First floor', zone: 'Library Dining Room', x: 73, y: 74, shape: 'square' },
  { id: 33, cap: 4, floor: 'First floor', zone: 'Library Dining Room', x: 83, y: 74, shape: 'square' },
  { id: 34, cap: 6, floor: 'First floor', zone: 'Library Dining Room', x: 78, y: 86, shape: 'long' },
  { id: 35, cap: 8, floor: 'First floor', zone: 'Private Salon', x: 92, y: 63, shape: 'long' },
  { id: 36, cap: 10, floor: 'First floor', zone: 'Private Salon', x: 92, y: 82, shape: 'long' }
];
