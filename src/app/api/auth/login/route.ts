import { NextResponse } from "next/server";
import { z } from "zod";
import { publicApiBaseUrl } from "../../../../lib/env";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
  if (publicApiBaseUrl) {
    const res = await fetch(`${publicApiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  }
  return NextResponse.json({ token: "mock-token", message: "Login success" }, { status: 200 });
}
