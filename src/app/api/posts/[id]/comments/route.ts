import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../../../lib/env';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const url = new URL(req.url);
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  const res = await fetch(
    `${publicApiBaseUrl}/api/posts/${id}/comments?page=${page}&limit=${limit}`,
    {
      cache: 'no-store',
      headers: {
        Authorization: req.headers.get('authorization') || '',
      },
    }
  );
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const json = await req.json().catch(() => ({}));
  const res = await fetch(`${publicApiBaseUrl}/api/posts/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.get('authorization') || '',
    },
    body: JSON.stringify(json),
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}
