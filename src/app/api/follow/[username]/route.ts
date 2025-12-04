import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../../lib/env';

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const res = await fetch(`${publicApiBaseUrl}/api/follow/${params.username}`, {
    method: 'POST',
    headers: { Authorization: req.headers.get('authorization') || '' },
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const res = await fetch(`${publicApiBaseUrl}/api/follow/${params.username}`, {
    method: 'DELETE',
    headers: { Authorization: req.headers.get('authorization') || '' },
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}
