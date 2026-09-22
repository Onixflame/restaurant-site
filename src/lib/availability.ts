import { TABLES } from '../data';
import type { RestaurantTable, TableState } from '../types/domain';
import { getReservations, getSandbox } from './demoStore';
import { hashString } from './format';

export const tableKey = (date: string, time: string, id: number) => `${date}|${time}|${id}`;

export const tableState = ({ table, date, time, guests, demoPreview = false }: {
  table: RestaurantTable; date: string; time: string; guests: number; demoPreview?: boolean;
}): TableState => {
  if (table.cap < guests) return 'reserved';
  const localBooking = getReservations().some(r => r.date === date && r.time === time && r.table === table.id && r.status !== 'Cancelled');
  if (demoPreview) {
    const override = getSandbox()?.tableOverrides?.[tableKey(date, time, table.id)];
    if (override === 'reserved') return 'reserved';
    if (override === 'available') return localBooking ? 'reserved' : 'available';
  }
  if (localBooking) return 'reserved';
  const pressure = time >= '19:30' && time <= '20:30' ? 63 : time >= '21:00' ? 42 : 34;
  return hashString(`${date}|${time}|${table.id}`) % 100 < pressure ? 'reserved' : 'available';
};

export const occupancy = (date: string, time: string, guests: number, demoPreview = false) => {
  const compatible = TABLES.filter(t => t.cap >= guests);
  if (!compatible.length) return 100;
  const reserved = compatible.filter(table => tableState({ table, date, time, guests, demoPreview }) === 'reserved').length;
  return Math.round((reserved / compatible.length) * 100);
};
