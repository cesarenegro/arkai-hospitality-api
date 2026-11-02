import { database } from '@/lib/db';
import { searchSchema, nightsBetween, noCache } from '@/lib/booking';
import { z } from 'zod';

const quoteSchema = searchSchema.safeExtend({ roomId: z.string().min(1).max(80) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return noCache({ error: 'Invalid JSON' }, 400); }
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return noCache({ error: 'Invalid request', details: parsed.error.flatten() }, 400);
  const input = parsed.data;
  let nights: number;
  try { nights = nightsBetween(input.checkIn, input.checkOut); }
  catch { return noCache({ error: 'Stay must be 1–30 nights' }, 400); }
  if (input.checkIn < new Date().toISOString().slice(0, 10)) return noCache({ error: 'Check-in cannot be in the past' }, 400);

  try {
    const sql = database();
    const rows = await sql`
      SELECT r.id, r.name, r.currency, r.nightly_rate_cents,
        r.inventory - COALESCE((SELECT SUM(b.room_count)::int FROM bookings b
          WHERE b.room_id = r.id AND b.check_in < ${input.checkOut}::date
          AND b.check_out > ${input.checkIn}::date), 0) AS remaining_rooms
      FROM rooms r WHERE r.id = ${input.roomId} AND r.max_guests >= ${input.adults + input.children}`;
    const room = rows[0];
    if (!room) return noCache({ error: 'Room not found or occupancy exceeded' }, 404);
    if (Number(room.remaining_rooms) < input.rooms) return noCache({ error: 'Insufficient availability' }, 409);
    return noCache({ demo: true, roomId: room.id, roomName: room.name, checkIn: input.checkIn,
      checkOut: input.checkOut, nights, roomCount: input.rooms, currency: room.currency,
      nightlyRateCents: Number(room.nightly_rate_cents),
      subtotalCents: Number(room.nightly_rate_cents) * nights * input.rooms,
      taxesAndFeesCents: null, totalCents: null,
      note: 'Illustrative quote only. Taxes and fees are not configured; this is not a booking.' });
  } catch (error) {
    console.error('Quote failed', error instanceof Error ? error.message : 'unknown');
    return noCache({ error: 'Quote service unavailable' }, 503);
  }
}
