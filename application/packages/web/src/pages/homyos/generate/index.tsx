import { Button } from "../../components/Button";

const GenerateHomyo = ({ homyos }: { homyos: string[] }) => (
  <div className="max-w-6xl mx-auto p-6">
    <div className="mb-2">
      <a href="/" className="text-blue-600 hover:underline">
        ← お品書きに戻る
      </a>
    </div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">法名生成</h1>
    </div>
    <div className="flex justify-between items-center mb-6">
      <p className="text-l">名前を入力すると、AIが法名を生成します。</p>
    </div>

    <form method="get" action="/homyos/generate" className="max-w-md mb-6">
      <label
        for="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Generate
      </label>
      <div className="relative flex">
        <input
          type="search"
          name="first-name"
          id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="名前を入力してください"
        />
        <div className="w-4"></div>
        <Button color="blue">生成</Button>
      </div>
    </form>

    {homyos.length > 0 ? (
      <div>
        <p className="mb-4">AIが生成した法名は...</p>
        <div className="flex justify-between items-center mb-6 text-xl">
          <ul>
            {homyos.map((homyo) => (
              <li className="mb-2">{homyo}</li>
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <></>
    )}
  </div>
);

const Content = (props: { homyos: string[] }) => <GenerateHomyo {...props} />;

export default Content;
