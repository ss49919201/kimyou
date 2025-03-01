import { Gender } from "../../domain/model/monto";
import { Button } from "../components/Button";

type MontosWithPage = {
  totalCount: number;
  values: {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: Gender;
  }[];
};

const MontoList = ({ values: montos }: MontosWithPage) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-2">
      <a href="/" className="text-blue-600 hover:underline">
        ← お品書きに戻る
      </a>
    </div>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">門徒一覧</h1>
    </div>

    <div className="flex justify-between mb-6">
      <form method="get" action="/montos" className="max-w-md relative flex">
        <label
          for="default-search"
          className="text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <input
          type="search"
          name="last-name"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="門徒の性を入力してください"
        />
        <div className="w-4"></div>
        <Button color="blue">検索</Button>
      </form>
      <a
        href="/montos/new"
        className="flex justify-center items-center text-white end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        新規登録
      </a>
    </div>

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
              電話番号
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              性別
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              住所
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {montos.map(
            ({ id, firstName, lastName, address, phoneNumber, gender }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{firstName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {gender === "MALE" ? "男" : "女"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`montos/${id}`}
                    className="w-32 text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    詳細
                  </a>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const Content = (props: MontosWithPage) => <MontoList {...props} />;

export default Content;
