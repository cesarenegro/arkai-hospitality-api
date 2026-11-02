import { z } from 'zod';

export const searchSchema = z.object({
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  adults: z.coerce.number().int().min(1).max(12),
  children: z.coerce.number().int().min(0).max(12).default(0),
  rooms: z.coerce.number().int().min(1).max(5).default(1)
}).refine(v => v.checkOut > v.checkIn, { message: 'checkOut must be after checkIn' });

export function nightsBetween(start: string, end: string) {
  const days = (Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / 86400000;
  if (!Number.isInteger(days) || days < 1 || days > 30) throw new Error('Stay must be 1–30 nights');
  return days;
}

export function moneyTotal(rateCents: number, nights: number, rooms: number) {
  return rateCents * nights * rooms;
}

export function noCache(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
