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
                <td className="px-6 py-4 whitespace-nowrap">{firstName}</td>
                <td className="px-6 py-4">{lastName}</td>
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
