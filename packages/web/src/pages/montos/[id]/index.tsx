import { format } from "date-fns";
import { Layout } from "../../../layout";

type Monto = {
  id: string;
  homyo: string;
  firstName: string;
  lastName: string;
  ingou: string;
  dateOfDeath?: Date;
  address: string;
  nextNenki?: Date;
};

const Monto = (monto: Monto) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-2">
      <a href="/montos" className="text-blue-600 hover:underline">
        ← 門徒一覧に戻る
      </a>
    </div>
    <div className="items-center mb-6">
      <h1 className="text-2xl font-bold">門徒詳細</h1>
    </div>
    <div className="items-center p-6 rounded-lg shadow">
      <div className="text-xl mb-4 font-bold">性</div>
      <div className="text-xl mb-4">{monto.lastName}</div>
      <div className="text-xl mb-4 font-bold">名</div>
      <div className="text-xl mb-4">{monto.firstName}</div>
      <div className="text-xl mb-4 font-bold">電話番号</div>
      <div className="text-xl mb-4">ダミーの電話番号</div>
      <div className="text-xl mb-4 font-bold">性別</div>
      <div className="text-xl mb-4">ダミーの性別</div>
      <div className="text-xl mb-4 font-bold">住所</div>
      <div className="text-xl mb-4">{monto.address}</div>
      <div className="text-xl mb-4 font-bold">法名</div>
      <div className="text-xl mb-4">{monto.homyo}</div>
      <div className="text-xl mb-4 font-bold">院号</div>
      <div className="text-xl mb-4">{monto.homyo}</div>
      <div className="text-xl mb-4 font-bold">命日</div>
      <div className="text-xl mb-4">
        {monto.dateOfDeath ? format(monto.dateOfDeath, "yyyy年MM月dd日") : "-"}
      </div>
      <div className="text-xl mb-2 font-bold">次回年忌</div>
      <div className="text-xl mb-2">
        {monto.nextNenki ? format(monto.nextNenki, "yyyy年MM月dd日") : "-"}
      </div>
    </div>
  </div>
);

const Content = (props: Monto) => (
  <Layout>
    <Monto {...props} />
  </Layout>
);

export default Content;
