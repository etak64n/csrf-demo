export interface User {
  password: string;
  balance: number;
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
}

// ユーザーデータ（インメモリ）
export const users: Record<string, User> = {
  alice: { password: "alice123", balance: 100000 },
  bob: { password: "bob123", balance: 50000 },
};

// セッション管理（sessionId → username）
export const sessions = new Map<string, string>();

// 送金履歴
export const transfers: Transfer[] = [];
