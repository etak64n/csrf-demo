import { NextResponse } from "next/server";
import { users, sessions, transfers } from "@/lib/store";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const username = sessions.get(sessionId);
  if (!username || !users[username]) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userTransfers = transfers
    .filter((t) => t.from === username || t.to === username)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return NextResponse.json({
    username,
    balance: users[username].balance,
    transfers: userTransfers,
  });
}
