import { noCache } from '@/lib/booking';

export async function GET() {
  return noCache({ status: 'ok', service: 'arkai-hospitality-api' });
}
