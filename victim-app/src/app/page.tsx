export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="container">
      <div className="card">
        <h1>SecureBank</h1>
        <h2>オンラインバンキング</h2>

        {searchParams.error && (
          <div className="alert-error">
            ユーザー名またはパスワードが間違っています
          </div>
        )}

        <form action="/api/login" method="POST">
          <label htmlFor="username">ユーザー名</label>
          <input id="username" name="username" type="text" required />

          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" required />

          <button type="submit">ログイン</button>
        </form>

        <div className="info">
          テストアカウント
          <br />
          alice / alice123
          <br />
          bob / bob123
        </div>
      </div>
    </div>
  );
}
