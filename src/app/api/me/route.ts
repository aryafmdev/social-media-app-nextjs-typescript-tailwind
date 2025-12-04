import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../lib/env';

export async function GET(req: NextRequest) {
  const res = await fetch(`${publicApiBaseUrl}/api/me`, {
    headers: {
      Authorization: req.headers.get('authorization') || '',
    },
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

export async function PATCH(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let body: FormData | string | undefined = undefined;
  const headers: Record<string, string> = {
    Authorization: req.headers.get('authorization') || '',
  };
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    body = form;
  } else {
    const json = await req.json();
    body = JSON.stringify(json);
    headers['content-type'] = 'application/json';
  }
  const res = await fetch(`${publicApiBaseUrl}/api/me`, {
    method: 'PATCH',
    headers,
    body,
  });
  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
    },
  });
}
