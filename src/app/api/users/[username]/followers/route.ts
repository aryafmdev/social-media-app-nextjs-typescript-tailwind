import { NextRequest } from "next/server";
import { publicApiBaseUrl } from "../../../../../lib/env";

export async function GET(req: NextRequest, context: { params: Promise<{ username: string }> }) {
  const { username } = await context.params;
  const url = new URL(req.url);
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "20";
  const res = await fetch(`${publicApiBaseUrl}/api/users/${username}/followers?page=${page}&limit=${limit}`, {
    headers: { Authorization: req.headers.get("authorization") || "" },
    cache: "no-store",
  });
  const data = await res.text();
  return new Response(data, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}
