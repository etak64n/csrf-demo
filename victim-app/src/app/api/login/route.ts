import { NextResponse } from "next/server";
import { users, sessions } from "@/lib/store";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = users[username];
  if (!user || user.password !== password) {
    return NextResponse.redirect(new URL("/?error=1", request.url), 303);
  }

  const sessionId = randomUUID();
  sessions.set(sessionId, username);

  const response = NextResponse.redirect(
    new URL("/dashboard", request.url),
    303
  );
  response.cookies.set("sessionId", sessionId, {
    httpOnly: true,
    path: "/",
    // SameSite を指定していない = ブラウザのデフォルト (Lax) に依存
    // localhost 同士は same-site 扱いのため、CSRF が成立する
  });
  return response;
}
