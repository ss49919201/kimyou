const Error500 = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">500エラー</h1>
      <h2 className="mb-2">予期しないエラーが発生しました。</h2>
      <a href="/" className="text-blue-600 hover:underline">
        ←お品書きに戻る
      </a>
    </div>
  </div>
);

export default Error500;
