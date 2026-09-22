import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

type Bindings = { DB: D1Database; ASSETS: Fetcher; DEMO_TTL_HOURS: string };
const app = new Hono<{ Bindings: Bindings }>();
app.use('/api/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] }));
app.get('/api/health', c => c.json({ ok: true, service: 'onix-api' }));

const ttlMs = (env: Bindings) => Number(env.DEMO_TTL_HOURS || '24') * 3_600_000;
const sessionSchema = z.object({ sessionId: z.string().min(8).max(80) });

const guestRegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(128),
});
const guestLoginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(128),
});
const SERVICE_WORDS = ['OBSIDIAN','EMBER','VELVET','CINDER','SAFFRON','JUNIPER','ONYX','NOCTURNE','CEDAR','VERBENA','GARNET','VESPER'];
const randomServiceWord = () => SERVICE_WORDS[Math.floor(Math.random() * SERVICE_WORDS.length)];
const bytesToBase64 = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};
const passwordHash = async (password: string, salt: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt:new TextEncoder().encode(salt), iterations:100_000 }, key, 256);
  return bytesToBase64(new Uint8Array(bits));
};
const makeMemberId = () => String(Math.floor(100000 + Math.random() * 900000));



app.post('/api/auth/register', zValidator('json', guestRegisterSchema), async c => {
  const body = c.req.valid('json');
  const email = body.email.toLowerCase();
  const existing = await c.env.DB.prepare('SELECT id,expires_at FROM demo_guest_accounts WHERE email=?').bind(email).first<{id:string;expires_at:number}>();
  if (existing && existing.expires_at > Date.now()) return c.json({ code:'ACCOUNT_EXISTS', message:'An ONIX account with this email already exists.' }, 409);
  if (existing) await c.env.DB.prepare('DELETE FROM demo_guest_accounts WHERE email=?').bind(email).run();
  const now = Date.now();
  const expiresAt = now + ttlMs(c.env);
  const salt = crypto.randomUUID();
  const hash = await passwordHash(body.password, salt);
  const profile = { name:body.name.trim(), email, memberId:makeMemberId(), serviceWord:randomServiceWord(), lifetimeSpend:0, membershipThreshold:5000 };
  await c.env.DB.prepare('INSERT INTO demo_guest_accounts (id,email,name,password_hash,password_salt,profile,created_at,expires_at) VALUES (?,?,?,?,?,?,?,?)')
    .bind(crypto.randomUUID(), email, profile.name, hash, salt, JSON.stringify(profile), now, expiresAt).run();
  return c.json({ profile, expiresAt }, 201);
});

app.post('/api/auth/login', zValidator('json', guestLoginSchema), async c => {
  const body = c.req.valid('json');
  const email = body.email.toLowerCase();
  const row = await c.env.DB.prepare('SELECT password_hash,password_salt,profile,expires_at FROM demo_guest_accounts WHERE email=?')
    .bind(email).first<{password_hash:string;password_salt:string;profile:string;expires_at:number}>();
  if (!row || row.expires_at <= Date.now()) {
    if (row) await c.env.DB.prepare('DELETE FROM demo_guest_accounts WHERE email=?').bind(email).run();
    return c.json({ code:'ACCOUNT_NOT_FOUND', message:"We couldn't find an ONIX account with that email." }, 404);
  }
  const hash = await passwordHash(body.password, row.password_salt);
  if (hash !== row.password_hash) return c.json({ code:'INVALID_PASSWORD', message:"The password doesn't match this account." }, 401);
  return c.json({ profile:JSON.parse(row.profile), expiresAt:row.expires_at });
});

app.post('/api/demo/session', zValidator('json', sessionSchema), async c => {
  const { sessionId } = c.req.valid('json');
  const now = Date.now();
  const expiresAt = now + ttlMs(c.env);
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_sessions (id,created_at,expires_at) VALUES (?,?,?)')
    .bind(sessionId, now, expiresAt).run();
  return c.json({ sessionId, expiresAt });
});

app.get('/api/demo/:sessionId/menu', async c => {
  const rows = await c.env.DB.prepare('SELECT id,payload FROM demo_menu_items WHERE session_id=? ORDER BY id')
    .bind(c.req.param('sessionId')).all<{ id: number; payload: string }>();
  return c.json(rows.results.map(row => JSON.parse(row.payload)));
});

app.put('/api/demo/:sessionId/menu/:id', async c => {
  const sessionId = c.req.param('sessionId');
  const id = Number(c.req.param('id'));
  const payload = await c.req.json();
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_menu_items (session_id,id,payload,updated_at) VALUES (?,?,?,?)')
    .bind(sessionId, id, JSON.stringify(payload), Date.now()).run();
  return c.json({ ok: true });
});

app.delete('/api/demo/:sessionId/menu/:id', async c => {
  await c.env.DB.prepare('DELETE FROM demo_menu_items WHERE session_id=? AND id=?')
    .bind(c.req.param('sessionId'), Number(c.req.param('id'))).run();
  return c.json({ ok: true });
});

app.get('/api/demo/:sessionId/reservations', async c => {
  const rows = await c.env.DB.prepare('SELECT payload FROM demo_reservations WHERE session_id=? ORDER BY created_at DESC')
    .bind(c.req.param('sessionId')).all<{ payload: string }>();
  return c.json(rows.results.map(row => JSON.parse(row.payload)));
});

app.post('/api/demo/:sessionId/reservations', async c => {
  const payload = await c.req.json<Record<string, unknown>>();
  const id = String(payload.id ?? crypto.randomUUID());
  const now = Date.now();
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_reservations (id,session_id,payload,created_at,expires_at) VALUES (?,?,?,?,?)')
    .bind(id, c.req.param('sessionId'), JSON.stringify({ ...payload, id }), now, now + ttlMs(c.env)).run();
  return c.json({ ok: true, id });
});

app.put('/api/demo/:sessionId/reservations/:id', async c => {
  const sessionId = c.req.param('sessionId');
  const id = c.req.param('id');
  const payload = await c.req.json<Record<string, unknown>>();
  const current = await c.env.DB.prepare('SELECT created_at,expires_at FROM demo_reservations WHERE id=? AND session_id=?')
    .bind(id, sessionId).first<{ created_at: number; expires_at: number }>();
  const now = Date.now();
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_reservations (id,session_id,payload,created_at,expires_at) VALUES (?,?,?,?,?)')
    .bind(id, sessionId, JSON.stringify({ ...payload, id }), current?.created_at ?? now, current?.expires_at ?? now + ttlMs(c.env)).run();
  return c.json({ ok: true });
});

app.delete('/api/demo/:sessionId/reservations/:id', async c => {
  await c.env.DB.prepare('DELETE FROM demo_reservations WHERE session_id=? AND id=?')
    .bind(c.req.param('sessionId'), c.req.param('id')).run();
  return c.json({ ok: true });
});

app.get('/api/demo/:sessionId/tables', async c => {
  const rows = await c.env.DB.prepare('SELECT slot_key,state FROM demo_table_overrides WHERE session_id=? ORDER BY slot_key')
    .bind(c.req.param('sessionId')).all<{ slot_key: string; state: string }>();
  return c.json(Object.fromEntries(rows.results.map(row => [row.slot_key, row.state])));
});

app.put('/api/demo/:sessionId/tables/:slotKey', async c => {
  const body = await c.req.json<{ state: 'available' | 'reserved' | null }>();
  const sessionId = c.req.param('sessionId');
  const slotKey = decodeURIComponent(c.req.param('slotKey'));
  if (body.state === null) {
    await c.env.DB.prepare('DELETE FROM demo_table_overrides WHERE session_id=? AND slot_key=?').bind(sessionId, slotKey).run();
  } else {
    await c.env.DB.prepare('INSERT OR REPLACE INTO demo_table_overrides (session_id,slot_key,state,updated_at) VALUES (?,?,?,?)')
      .bind(sessionId, slotKey, body.state, Date.now()).run();
  }
  return c.json({ ok: true });
});

app.get('/api/demo/:sessionId/inquiries', async c => {
  const rows = await c.env.DB.prepare('SELECT payload FROM demo_inquiries WHERE session_id=? ORDER BY created_at DESC')
    .bind(c.req.param('sessionId')).all<{ payload: string }>();
  return c.json(rows.results.map(row => JSON.parse(row.payload)));
});

app.post('/api/demo/:sessionId/inquiries', async c => {
  const payload = await c.req.json<Record<string, unknown>>();
  const id = String(payload.id ?? crypto.randomUUID());
  const now = Date.now();
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_inquiries (id,session_id,payload,created_at,expires_at) VALUES (?,?,?,?,?)')
    .bind(id, c.req.param('sessionId'), JSON.stringify({ ...payload, id }), now, now + ttlMs(c.env)).run();
  return c.json({ ok: true, id });
});

app.put('/api/demo/:sessionId/inquiries/:id', async c => {
  const sessionId = c.req.param('sessionId');
  const id = c.req.param('id');
  const payload = await c.req.json<Record<string, unknown>>();
  const current = await c.env.DB.prepare('SELECT created_at,expires_at FROM demo_inquiries WHERE id=? AND session_id=?')
    .bind(id, sessionId).first<{ created_at: number; expires_at: number }>();
  const now = Date.now();
  await c.env.DB.prepare('INSERT OR REPLACE INTO demo_inquiries (id,session_id,payload,created_at,expires_at) VALUES (?,?,?,?,?)')
    .bind(id, sessionId, JSON.stringify({ ...payload, id }), current?.created_at ?? now, current?.expires_at ?? now + ttlMs(c.env)).run();
  return c.json({ ok: true });
});

app.delete('/api/demo/:sessionId/inquiries/:id', async c => {
  await c.env.DB.prepare('DELETE FROM demo_inquiries WHERE session_id=? AND id=?')
    .bind(c.req.param('sessionId'), c.req.param('id')).run();
  return c.json({ ok: true });
});

app.delete('/api/demo/:sessionId', async c => {
  await c.env.DB.prepare('DELETE FROM demo_sessions WHERE id=?').bind(c.req.param('sessionId')).run();
  return c.json({ ok: true });
});

app.notFound(async c => c.env.ASSETS.fetch(c.req.raw));

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    const now = Date.now();
    ctx.waitUntil(Promise.all([
      env.DB.prepare('DELETE FROM demo_inquiries WHERE expires_at < ?').bind(now).run(),
      env.DB.prepare('DELETE FROM demo_reservations WHERE expires_at < ?').bind(now).run(),
      env.DB.prepare('DELETE FROM demo_sessions WHERE expires_at < ?').bind(now).run(),
      env.DB.prepare('DELETE FROM demo_guest_accounts WHERE expires_at < ?').bind(now).run(),
    ]));
  },
};
