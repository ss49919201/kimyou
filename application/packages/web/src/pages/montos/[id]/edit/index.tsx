import { format } from "date-fns";
import { Button } from "../../../components/Button";
import { tz } from "@date-fns/tz";

type Monto = {
  id: string;
  homyo?: string;
  firstName: string;
  lastName: string;
  ingou?: string;
  dateOfDeath?: Date;
  address: string;
  nextNenki?: Date;
  phoneNumber: string;
  gender: string;
};

const editMonto = (monto: Monto) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-2">
        <a href="/montos" className="text-blue-600 hover:underline">
          ← 門徒一覧に戻る
        </a>
      </div>
      <div className="items-center mb-6">
        <h1 className="text-2xl font-bold">門徒編集</h1>
      </div>
      <p className="text-2xl font-bold text-red-900">
        ※デモ環境のため、編集結果は反映されません。
      </p>
      <form method="post" action={`/montos/${monto.id}/edit`}>
        <div className="items-center p-6 mb-6 rounded-lg shadow">
          <div className="text-xl mb-4 font-bold">性</div>
          <div className="text-xl mb-4">{monto.lastName}</div>
          <div className="text-xl mb-4 font-bold">名</div>
          <div className="text-xl mb-4">{monto.firstName}</div>
          <div className="text-xl mb-4 font-bold">性別</div>
          <div className="text-xl mb-4">{monto.gender}</div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">住所</lavel>
            <input
              name="address"
              required
              className="w-1/3 px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={monto.address}
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
              value={monto.phoneNumber}
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">命日</lavel>
            <input
              name="date-of-death"
              type="date"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={
                monto.dateOfDeath
                  ? format(monto.dateOfDeath, "yyyy-MM-dd", {
                      in: tz("Asia/Tokyo"),
                    })
                  : ""
              }
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">法名</lavel>
            <p className="mb-2 text-sm">※釋〇〇の形式で入力してください。</p>
            <input
              name="homyo"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="釋[\u4E00-\u9FFF]{2}"
              value={monto.homyo}
            />
          </div>
          <div className="mb-4">
            <lavel className="mb-2 block text-xl font-bold">院号</lavel>
            <p className="mb-2 text-sm">※〇〇院の形式で入力してください。</p>
            <input
              name="ingou"
              className="px-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              pattern="[\u4E00-\u9FFF]{2}院"
              value={monto.ingou}
            />
          </div>
        </div>
        <Button color="green">更新</Button>
      </form>
    </div>
  );
};

export default editMonto;
