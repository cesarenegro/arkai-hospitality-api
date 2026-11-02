import { database } from '@/lib/db';
import { noCache } from '@/lib/booking';

export async function GET() {
  try {
    const sql = database();
    const rows = await sql`SELECT id, name, description, max_guests, bed_type, view_type, amenities, image_name FROM rooms ORDER BY display_order`;
    return noCache({ demo: true, rooms: rows });
  } catch (error) {
    console.error('Rooms lookup failed', error instanceof Error ? error.message : 'unknown');
    return noCache({ error: 'Room catalogue unavailable' }, 503);
  }
}
