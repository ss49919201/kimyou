const Error404 = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">404エラー</h1>
      <h2 className="mb-2">指定のページが存在しません。</h2>
      <a href="/" className="text-blue-600 hover:underline">
        ←お品書きに戻る
      </a>
    </div>
  </div>
);

export default Error404;
