import { NextRequest } from 'next/server';
import { publicApiBaseUrl } from '../../../lib/env';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let body: BodyInit;
  if (contentType.includes('multipart/form-data')) {
    const incoming = await req.formData();
    const form = new FormData();
    for (const [key, value] of incoming.entries()) {
      if (typeof value === 'string') {
        form.append(key, value);
      } else if (value instanceof File) {
        form.append(key, value, value.name);
      } else {
        form.append(key, value as Blob, 'upload.bin');
      }
    }
    body = form as unknown as BodyInit;
  } else {
    const json = await req.json();
    const form = new FormData();
    if (json.image) form.append('image', json.image);
    if (json.caption) form.append('caption', json.caption);
    body = form as unknown as BodyInit;
  }
  const res = await fetch(`${publicApiBaseUrl}/api/posts`, {
    method: 'POST',
    headers: { Authorization: req.headers.get('authorization') || '' },
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
