import { NextResponse } from "next/server";
import { sessions } from "@/lib/store";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.delete("sessionId");
  return response;
}
