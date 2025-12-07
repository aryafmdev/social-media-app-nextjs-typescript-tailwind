import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../../lib/env';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const res = await fetch(`${publicApiBaseUrl}/api/comments/${id}`, {
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
