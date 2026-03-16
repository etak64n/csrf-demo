import { NextResponse } from "next/server";
import { users, sessions, transfers } from "@/lib/store";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = sessions.get(sessionId);
  if (!username || !users[username]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const to = formData.get("to") as string;
  const amount = parseInt(formData.get("amount") as string, 10);

  if (!to || !amount || amount <= 0) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid", request.url),
      303
    );
  }

  if (to === username) {
    return NextResponse.redirect(
      new URL("/dashboard?error=invalid", request.url),
      303
    );
  }

  // 送金先が未登録でも受け取れる（デモ用）
  if (!users[to]) {
    users[to] = { password: "", balance: 0 };
  }

  if (users[username].balance < amount) {
    return NextResponse.redirect(
      new URL("/dashboard?error=insufficient", request.url),
      303
    );
  }

  // 送金実行（CSRF トークンの検証なし = 脆弱）
  users[username].balance -= amount;
  users[to].balance += amount;
  transfers.push({
    from: username,
    to,
    amount,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.redirect(
    new URL("/dashboard?success=1", request.url),
    303
  );
}
