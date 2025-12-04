import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../../lib/env';

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const res = await fetch(`${publicApiBaseUrl}/api/users/${params.username}`, {
    headers: { Authorization: req.headers.get('authorization') || '' },
    cache: 'no-store',
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}
