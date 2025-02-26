const newMonto = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-2">
        <a href="/montos" className="text-blue-600 hover:underline">
          ← 門徒一覧に戻る
        </a>
      </div>
      <div className="items-center mb-6">
        <h1 className="text-2xl font-bold">門徒新規登録</h1>
      </div>
      <form method="post" action="/montos/new">
        <div className="items-center p-6 mb-6 rounded-lg shadow">
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">性</lavel>
            <input
              name="last-name"
              required
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">名</lavel>
            <input
              name="first-name"
              required
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <p className="mb-2 block text-xl font-bold">性別</p>
            <label className="mb-2 block text-xl font-bold">
              <input type="radio" name="gender" value="MALE" checked /> 男
            </label>
            <label className="mb-2 block text-xl font-bold">
              <input type="radio" name="gender" value="FEMALE" /> 女
            </label>
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">住所</lavel>
            <input
              name="address"
              required
              className="w-1/3 px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">電話番号</lavel>
            <p className="mb-2 text-sm">※半角数字で入力してください。</p>
            <p className="mb-2 text-sm">※「-」の入力は不要です。</p>
            <input
              name="phone-number"
              required
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="0[0-9]{5}[0-9]{4}|0[789]0[0-9]{8}"
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">命日</lavel>
            <input
              name="date-of-death"
              type="datetime-local"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">法名</lavel>
            <p className="mb-2 text-sm">※釋〇〇の形式で入力してください。</p>
            <input
              name="homyo"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="釋[\u4E00-\u9FFF]{2}"
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">院号</lavel>
            <p className="mb-2 text-sm">※〇〇院の形式で入力してください。</p>
            <input
              name="ingou"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="[\u4E00-\u9FFF]{2}院"
            />
          </div>
        </div>
        <button
          type="submit"
          class="m-auto block w-32 text-white end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          新規登録
        </button>
      </form>
    </div>
  );
};

export default newMonto;
