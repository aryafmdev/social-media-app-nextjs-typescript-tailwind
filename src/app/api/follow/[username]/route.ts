import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../../lib/env';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const res = await fetch(`${publicApiBaseUrl}/api/follow/${username}`, {
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
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  const res = await fetch(`${publicApiBaseUrl}/api/follow/${username}`, {
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
