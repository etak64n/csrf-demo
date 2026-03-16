"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface TransferRecord {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
}

interface UserData {
  username: string;
  balance: number;
  transfers: TransferRecord[];
}

function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });
  }, [router]);

  if (!user) {
    return <div className="loading">読み込み中...</div>;
  }

  const success = searchParams.get("success");
  const error = searchParams.get("error");

  return (
    <div className="container">
      <div className="header">
        <h1>SecureBank</h1>
        <form action="/api/logout" method="POST">
          <button type="submit" className="btn-secondary">
            ログアウト
          </button>
        </form>
      </div>

      {success === "1" && (
        <div className="alert-success">送金が完了しました</div>
      )}
      {error === "insufficient" && (
        <div className="alert-error">残高が不足しています</div>
      )}
      {error === "invalid" && (
        <div className="alert-error">入力内容を確認してください</div>
      )}

      <div className="card">
        <h3>ようこそ {user.username} さん</h3>
        <div className="balance">¥{user.balance.toLocaleString()}</div>
      </div>

      <div className="card">
        <h3>送金</h3>
        <form action="/api/transfer" method="POST">
          <label htmlFor="to">送金先ユーザー名</label>
          <input id="to" name="to" type="text" placeholder="例: bob" required />

          <label htmlFor="amount">金額（円）</label>
          <input id="amount" name="amount" type="number" min="1" required />

          <button type="submit">送金する</button>
        </form>
      </div>

      <div className="card">
        <h3>取引履歴</h3>
        {user.transfers.length === 0 ? (
          <p className="muted">取引履歴はありません</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>日時</th>
                <th>種別</th>
                <th>相手</th>
                <th>金額</th>
              </tr>
            </thead>
            <tbody>
              {user.transfers.map((t, i) => {
                const isSend = t.from === user.username;
                return (
                  <tr key={i}>
                    <td>{new Date(t.timestamp).toLocaleString("ja-JP")}</td>
                    <td>{isSend ? "送金" : "受取"}</td>
                    <td>{isSend ? t.to : t.from}</td>
                    <td className={isSend ? "negative" : "positive"}>
                      {isSend ? "-" : "+"}¥{t.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="loading">読み込み中...</div>}>
      <Dashboard />
    </Suspense>
  );
}
