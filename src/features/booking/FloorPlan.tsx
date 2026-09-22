import { useEffect, useMemo, useState } from 'react';
import { TABLES } from '../../data';
import { tableState } from '../../lib/availability';
import type { RestaurantFloor, RestaurantTable, RestaurantZone } from '../../types/domain';

const FLOORS: RestaurantFloor[] = ['Ground floor', 'First floor'];

type ZoneConfig = {
  zone: RestaurantZone;
  title: string;
  note: string;
  area: string;
  tone?: 'garden' | 'window' | 'private' | 'bar' | 'balcony';
};

const GROUND_ZONES: ZoneConfig[] = [
  { zone: 'Bar Lounge', title: 'Bar Lounge', note: 'Cocktails · low tables', area: 'bar', tone: 'bar' },
  { zone: 'Chef’s Counter', title: "Chef's Counter", note: 'Open kitchen view', area: 'counter' },
  { zone: 'Main Dining Room', title: 'Main Dining Room', note: 'Central service', area: 'main' },
  { zone: 'Courtyard', title: 'Courtyard', note: 'Garden side', area: 'courtyard', tone: 'garden' },
  { zone: 'Window Salon', title: 'Window Salon', note: 'Street windows', area: 'window', tone: 'window' },
  { zone: 'Stone Room', title: 'Stone Room', note: 'Private dining', area: 'stone', tone: 'private' },
];

const FIRST_ZONES: ZoneConfig[] = [
  { zone: 'Gallery', title: 'Gallery', note: 'Quiet dining', area: 'gallery' },
  { zone: 'Window Salon', title: 'Window Salon', note: 'Upper windows', area: 'salon', tone: 'window' },
  { zone: 'Balcony', title: 'Balcony', note: 'Overlooks the hall', area: 'balcony', tone: 'balcony' },
  { zone: 'Library Dining Room', title: 'Library Dining Room', note: 'Late service', area: 'library' },
  { zone: 'Private Salon', title: 'Private Salon', note: '8–10 guests', area: 'private', tone: 'private' },
];

function TableButton({ table, state, selected, onSelect }: {
  table: RestaurantTable;
  state: 'available' | 'reserved' | undefined;
  selected: boolean;
  onSelect: (table: RestaurantTable) => void;
}) {
  const reserved = state === 'reserved';
  return <button
    type="button"
    className={`reservation-table-v35 ${table.shape} ${reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`}
    disabled={reserved}
    onClick={() => onSelect(table)}
    aria-label={`Table ${table.id}, ${table.zone}, ${table.cap} seats, ${state}`}
  >
    <span className="reservation-table-id">T{String(table.id).padStart(2, '0')}</span>
    <span className="reservation-table-cap">{table.cap} seats</span>
    {reserved && <span className="reservation-table-status" aria-hidden="true">×</span>}
    {selected && <span className="reservation-table-check" aria-hidden="true">✓</span>}
    <span className="reservation-table-tooltip-v35"><b>{table.zone}</b><em>{table.cap} seats</em></span>
  </button>;
}

function ZoneCard({ config, tables, states, selected, onSelect }: {
  config: ZoneConfig;
  tables: RestaurantTable[];
  states: Map<number, 'available' | 'reserved'>;
  selected: number | null;
  onSelect: (table: RestaurantTable) => void;
}) {
  return <section
    className={`floor-zone-v35 floor-zone-${config.area} ${config.tone ? `tone-${config.tone}` : ''}`}
    style={{ gridArea: config.area }}
    aria-label={config.title}
  >
    <header className="floor-zone-head-v35">
      <div>
        <strong>{config.title}</strong>
        <small>{config.note}</small>
      </div>
      <span>{tables.length} table{tables.length === 1 ? '' : 's'}</span>
    </header>
    <div className={`floor-zone-tables-v35 count-${tables.length}`}>
      {tables.map(table => <TableButton
        key={table.id}
        table={table}
        state={states.get(table.id)}
        selected={selected === table.id}
        onSelect={onSelect}
      />)}
    </div>
  </section>;
}

function FloorFixtures({ floor }: { floor: RestaurantFloor }) {
  return <aside className="floor-fixtures-v35" style={{ gridArea: 'fixtures' }} aria-label="Access and circulation">
    <div className="floor-fixture-v35 stairs-fixture-v35">
      <div className="fixture-icon-v35" aria-hidden="true">↕</div>
      <div><strong>Stairs</strong><small>{floor === 'Ground floor' ? 'Up to first floor' : 'Down to ground floor'}</small></div>
    </div>
    {floor === 'Ground floor' && <div className="floor-fixture-v35 entrance-fixture-v35">
      <div className="fixture-icon-v35" aria-hidden="true">↗</div>
      <div><strong>Main entrance</strong><small>Host stand</small></div>
    </div>}
    {floor === 'First floor' && <div className="floor-fixture-v35 landing-fixture-v35">
      <div className="fixture-icon-v35" aria-hidden="true">◇</div>
      <div><strong>Landing</strong><small>Floor circulation</small></div>
    </div>}
  </aside>;
}

function MobileArchitecture({ floor }: { floor: RestaurantFloor }) {
  if (floor === 'Ground floor') return <div className="mobile-floor-architecture-v47" aria-hidden="true">
    <div className="mobile-room-v47 room-g-bar"><span>Bar Lounge</span></div>
    <div className="mobile-room-v47 room-g-counter"><span>Chef's Counter</span></div>
    <div className="mobile-room-v47 room-g-main"><span>Main Dining</span></div>
    <div className="mobile-room-v47 room-g-courtyard"><span>Courtyard</span></div>
    <div className="mobile-room-v47 room-g-window"><span>Window</span></div>
    <div className="mobile-room-v47 room-g-stone"><span>Stone Room</span></div>
    <div className="mobile-stairs-v47"><b>↑</b><i/><i/><i/><i/></div>
    <div className="mobile-entry-v47">Entrance</div>
  </div>;

  return <div className="mobile-floor-architecture-v47" aria-hidden="true">
    <div className="mobile-room-v47 room-f-gallery"><span>Gallery</span></div>
    <div className="mobile-room-v47 room-f-salon"><span>Window Salon</span></div>
    <div className="mobile-room-v47 room-f-balcony"><span>Balcony</span></div>
    <div className="mobile-room-v47 room-f-library"><span>Library Dining</span></div>
    <div className="mobile-room-v47 room-f-private"><span>Private</span></div>
    <div className="mobile-stairs-v47 first"><b>↓</b><i/><i/><i/><i/></div>
  </div>;
}

const MOBILE_TABLE_POSITIONS: Record<number, { x: number; y: number }> = {
  // Ground floor — deliberately aligned to the current mobile blueprint.
  // Bar Lounge: three equal circles with equal wall/gap spacing; T04 centred below.
  1:{x:8.2,y:23.5}, 2:{x:18.5,y:23.5}, 3:{x:28.8,y:23.5}, 4:{x:18.5,y:35.5},
  // Chef's Counter: one optically centred, evenly spaced row.
  5:{x:45.5,y:18}, 6:{x:55,y:18}, 7:{x:64.5,y:18},
  8:{x:47,y:47}, 9:{x:60,y:47}, 10:{x:73,y:47},
  11:{x:47,y:69}, 12:{x:60,y:69}, 13:{x:73,y:69},
  14:{x:13,y:77}, 15:{x:25,y:77},
  16:{x:92.5,y:26}, 17:{x:92.5,y:42}, 18:{x:92.5,y:82},

  // First floor — kept inside the room boundaries rather than reusing old desktop coordinates.
  19:{x:11,y:23}, 20:{x:24,y:23}, 21:{x:11,y:49}, 22:{x:24,y:49}, 23:{x:18,y:76},
  24:{x:46,y:23}, 25:{x:59,y:23}, 26:{x:46,y:43}, 27:{x:59,y:43}, 28:{x:52.5,y:55},
  29:{x:81,y:23}, 30:{x:91,y:23}, 31:{x:86,y:36},
  32:{x:68,y:73}, 33:{x:79,y:73}, 34:{x:74,y:82},
  35:{x:91,y:64}, 36:{x:91,y:80},
};

function MobileTableButton({ table, state, selected, onSelect }: {
  table: RestaurantTable;
  state: 'available' | 'reserved' | undefined;
  selected: boolean;
  onSelect: (table: RestaurantTable) => void;
}) {
  const reserved = state === 'reserved';
  const position = MOBILE_TABLE_POSITIONS[table.id] ?? { x: table.x, y: table.y };
  const narrow = ['Window Salon','Stone Room','Private Salon'].includes(table.zone);
  return <button
    type="button"
    className={`mobile-table-v47 ${table.shape} ${narrow ? 'narrow-zone' : ''} ${reserved ? 'reserved' : ''} ${selected ? 'selected' : ''}`}
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    disabled={reserved}
    onClick={() => onSelect(table)}
    aria-label={`Table ${table.id}, ${table.zone}, ${table.cap} seats, ${state}`}
  >
    <span>T{String(table.id).padStart(2, '0')}</span>
    {reserved && <i aria-hidden="true">×</i>}
    {selected && <b aria-hidden="true">✓</b>}
  </button>;
}

export function FloorPlan({ date, time, guests, selected, onSelect, demoPreview = false }: { date: string; time: string; guests: number; selected: number | null; onSelect: (table: RestaurantTable) => void; demoPreview?: boolean }) {
  const selectedTable = TABLES.find(t => t.id === selected);
  const [floor, setFloor] = useState<RestaurantFloor>(selectedTable?.floor ?? 'Ground floor');
  useEffect(() => { if (selectedTable) setFloor(selectedTable.floor); }, [selectedTable]);

  const states = useMemo(() => new Map(TABLES.map(t => [t.id, tableState({ table: t, date, time, guests, demoPreview })])), [date, time, guests, demoPreview]);
  const counts = (target: RestaurantFloor) => {
    const floorTables = TABLES.filter(t => t.floor === target);
    const free = floorTables.filter(t => states.get(t.id) === 'available').length;
    return { total: floorTables.length, free };
  };
  const visibleTables = TABLES.filter(t => t.floor === floor);
  const currentCount = counts(floor);
  const totalFree = TABLES.filter(t => states.get(t.id) === 'available').length;
  const zones = floor === 'Ground floor' ? GROUND_ZONES : FIRST_ZONES;

  return <>
    <div className="floor-switch floor-switch-v18 floor-switch-v35" role="tablist" aria-label="Restaurant floors">
      {FLOORS.map(item => {
        const c = counts(item);
        return <button type="button" key={item} className={floor === item ? 'active' : ''} onClick={() => setFloor(item)} role="tab" aria-selected={floor === item}>
          <span>{item}</span><small>{c.free} available · {c.total} tables</small>
        </button>;
      })}
    </div>

    <div className="floor-plan-head floor-plan-head-v18 floor-plan-head-v35">
      <div><small>{floor}</small><strong>Choose an exact table</strong></div>
      <p>Room outlines show how tables relate to each space. Tap or click any available table to select it.</p>
    </div>

    <div className="legend legend-v18 legend-v35" aria-label="Table availability legend">
      <span><i className="legend-dot" /> Available</span>
      <span><i className="legend-dot busy" /> Reserved</span>
      <span><i className="legend-dot selected" /> Your selection</span>
    </div>

    <div className={`floor-plan-v35 ${floor === 'Ground floor' ? 'ground-layout-v35' : 'first-layout-v35'}`}>
      {zones.map(config => <ZoneCard
        key={config.zone}
        config={config}
        tables={visibleTables.filter(table => table.zone === config.zone)}
        states={states}
        selected={selected}
        onSelect={onSelect}
      />)}
      <FloorFixtures floor={floor} />
    </div>

    <div className="mobile-floor-shell-v47" aria-label={`${floor} table plan`}>
      <div className={`mobile-floor-canvas-v47 ${floor === 'Ground floor' ? 'ground' : 'first'}`}>
        <div className="mobile-floor-inner-v48">
          <MobileArchitecture floor={floor} />
          {visibleTables.map(table => <MobileTableButton
            key={table.id}
            table={table}
            state={states.get(table.id)}
            selected={selected === table.id}
            onSelect={onSelect}
          />)}
        </div>
      </div>
      <div className="mobile-plan-tip-v47">Tap a table to select it · room and capacity appear below</div>
    </div>

    <div className="floor-meta floor-meta-v18 floor-meta-v35"><strong>{currentCount.free}</strong> compatible tables on this floor · <strong>{totalFree}</strong> available across both floors for {guests} guest{guests === 1 ? '' : 's'}.</div>
  </>;
}
