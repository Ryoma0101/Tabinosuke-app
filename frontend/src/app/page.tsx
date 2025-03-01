import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Tabinosuke</h1>
        <p className="text-gray-600 text-center mb-6">
          これはテスト用の画面です。
          <br />
          下記のボタンから各画面に遷移できます。
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/input"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center transition-colors"
          >
            入力画面へ（デモ用）
          </Link>
          <Link
            href="/confirm"
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 text-center transition-colors"
          >
            確認画面へ（デモ用）
          </Link>
        </div>
        <p className="text-sm text-gray-500 text-center mt-6">
          ※これはテストです。
        </p>
      </div>
    </main>
  );
}
