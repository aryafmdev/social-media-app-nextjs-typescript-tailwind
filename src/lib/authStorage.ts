export function saveAuth(token?: string, user?: { email: string; name?: string; username?: string; phone?: string }) {
  if (typeof window === "undefined") return;
  const data = JSON.stringify({ token, user });
  window.localStorage.setItem("sociality_auth", data);
}

export function loadAuth(): { token?: string; user?: { email: string; name?: string; username?: string; phone?: string } } | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = window.localStorage.getItem("sociality_auth");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("sociality_auth");
}

