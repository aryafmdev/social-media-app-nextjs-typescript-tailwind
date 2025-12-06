export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = { email: string; password: string };

type BasicUser = {
  email: string;
  name?: string;
  username?: string;
  phone?: string;
};

function parseToken(raw: Record<string, unknown>): string | undefined {
  const dataProp = raw['data'];
  const nested =
    typeof dataProp === 'object' && dataProp !== null
      ? (dataProp as Record<string, unknown>)
      : undefined;
  const candidate = [
    raw['token'],
    raw['access_token'],
    nested?.['token'],
    nested?.['access_token'],
  ];
  return candidate.find((v) => typeof v === 'string') as string | undefined;
}

function parseUser(
  raw: Record<string, unknown>,
  fallback?: BasicUser
): BasicUser | undefined {
  const userObj = raw['user'];
  if (userObj && typeof userObj === 'object') {
    const u = userObj as Record<string, unknown>;
    const email =
      typeof u['email'] === 'string' ? (u['email'] as string) : fallback?.email;
    const name =
      typeof u['name'] === 'string' ? (u['name'] as string) : fallback?.name;
    const username =
      typeof u['username'] === 'string'
        ? (u['username'] as string)
        : fallback?.username;
    const phone =
      typeof u['phone'] === 'string' ? (u['phone'] as string) : fallback?.phone;
    const result: BasicUser = { email: email ?? '', name, username, phone };
    return result;
  }
  return fallback;
}

function hasMessage(x: unknown): x is { message: string } {
  return !!x && typeof (x as { message?: unknown }).message === 'string';
}

export async function registerUser(
  input: RegisterInput
): Promise<{ token?: string; user?: BasicUser }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const raw: Record<string, unknown> = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error('Register gagal');
  }
  const token = parseToken(raw);
  const user = parseUser(raw, {
    email: input.email,
    name: input.name,
    username: input.username,
    phone: input.phone,
  });
  return { token, user };
}

export async function loginUser(
  input: LoginInput
): Promise<{ token?: string; user?: BasicUser }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const raw: Record<string, unknown> = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (() => {
      const parts: string[] = [];
      const primary = [raw['message'], raw['error'], raw['detail']].find(
        (v) => typeof v === 'string' && (v as string).trim().length > 0
      ) as string | undefined;
      if (primary) parts.push(primary);
      const errorsArr = raw['errors'];
      if (Array.isArray(errorsArr)) {
        for (const e of errorsArr) {
          if (typeof e === 'string') parts.push(e);
          else if (hasMessage(e)) parts.push(e.message);
        }
      }
      return parts.length > 0
        ? `Login gagal: ${parts.join('; ')}`
        : 'Login gagal';
    })();
    throw new Error(msg);
  }
  const token = parseToken(raw);
  const user = parseUser(raw, { email: input.email });
  if (!token) {
    throw new Error('Login gagal: token tidak ditemukan');
  }
  return { token, user };
}
