import { Layout } from "../../layout";

type MontosWithPage = {
  totalCount: number;
  values: {
    id: string;
    homyo: string;
    firstName: string;
    lastName: string;
    ingou: string;
    dateOfDeath: string;
    address: string;
  }[];
};

const MontoList = ({ values: montos }: MontosWithPage) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">門徒一覧</h1>
    </div>

    <form method="get" action="/montos" class="max-w-md mb-6">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div class="relative flex">
        <input
          type="search"
          name="last-name"
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="門徒名を入力してください"
        />
        <div class="w-4"></div>
        <button
          type="submit"
          class="w-32 text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          検索
        </button>
      </div>
    </form>

    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              性
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              院号
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              法名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              命日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              住所
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {montos.map(
            ({
              id,
              firstName,
              lastName,
              ingou,
              homyo,
              dateOfDeath,
              address,
            }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{ingou}</td>
                <td className="px-6 py-4 whitespace-nowrap">{homyo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dateOfDeath}</td>
                <td className="px-6 py-4 whitespace-nowrap">{address}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Content = (props: MontosWithPage) => (
  <Layout>
    <MontoList {...props} />
  </Layout>
);

export default Content;
