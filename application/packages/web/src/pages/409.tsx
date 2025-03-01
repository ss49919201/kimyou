const Error409 = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">409エラー</h1>
      <h2 className="mb-2">
        処理の競合が発生しました。時間を置いて再度お試しください。
      </h2>
      <a href="/" className="text-blue-600 hover:underline">
        ←お品書きに戻る
      </a>
    </div>
  </div>
);

export default Error409;
