const Content = () => (
  <div className="min-h-screen flex items-center justify-center">
    <ul className="text-2xl font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      <li className="w-full px-8 py-4 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
        <a href="/montos" className="text-blue-600 hover:underline">
          門徒一覧
        </a>
      </li>
      <li className="w-full px-8 py-4 border-b border-gray-200 dark:border-gray-600">
        <a href="/homyos/generate" className="text-blue-600 hover:underline">
          法名生成
        </a>
      </li>
    </ul>
  </div>
);

export default Content;
