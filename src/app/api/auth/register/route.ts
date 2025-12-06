import { NextResponse } from "next/server";
import { z } from "zod";
import { publicApiBaseUrl } from "../../../../lib/env";

const RegisterSchema = z
  .object({
    name: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(8),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  if (publicApiBaseUrl) {
    const res = await fetch(`${publicApiBaseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const json = await res.json().catch(() => ({}));
    return NextResponse.json(json, { status: res.status });
  }
  const { name, username, email, phone } = parsed.data;
  return NextResponse.json({ message: "Registered", user: { name, username, email, phone } }, { status: 201 });
}
