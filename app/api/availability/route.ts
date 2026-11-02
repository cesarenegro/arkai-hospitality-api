import { database } from '@/lib/db';
import { searchSchema, nightsBetween, noCache } from '@/lib/booking';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = searchSchema.safeParse(params);
  if (!parsed.success) return noCache({ error: 'Invalid search criteria', details: parsed.error.flatten() }, 400);
  const input = parsed.data;
  let nights: number;
  try { nights = nightsBetween(input.checkIn, input.checkOut); }
  catch { return noCache({ error: 'Stay must be 1–30 nights' }, 400); }
  if (input.checkIn < new Date().toISOString().slice(0, 10)) return noCache({ error: 'Check-in cannot be in the past' }, 400);

  try {
    const sql = database();
    const results = await sql`
      SELECT r.id, r.name, r.max_guests, r.currency, r.nightly_rate_cents,
        r.inventory - COALESCE((SELECT SUM(b.room_count)::int FROM bookings b
          WHERE b.room_id = r.id AND b.check_in < ${input.checkOut}::date
          AND b.check_out > ${input.checkIn}::date), 0) AS remaining_rooms
      FROM rooms r WHERE r.max_guests >= ${input.adults + input.children}
      ORDER BY r.display_order`;
    return noCache({ demo: true, checkIn: input.checkIn, checkOut: input.checkOut, nights,
      rooms: results.map(r => ({ ...r, available: Number(r.remaining_rooms) >= input.rooms,
        nightlyRateCents: Number(r.nightly_rate_cents), currency: r.currency,
        remainingRooms: Number(r.remaining_rooms),
        totalCents: Number(r.nightly_rate_cents) * nights * input.rooms,
        priceNote: 'Illustrative demo rate; taxes and service fees not included' })) });
  } catch (error) {
    console.error('Availability lookup failed', error instanceof Error ? error.message : 'unknown');
    return noCache({ error: 'Availability service unavailable' }, 503);
  }
}
