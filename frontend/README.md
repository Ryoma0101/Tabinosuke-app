## 開発環境のセットアップ

### 前提条件

- Node.js (バージョンは`.nvmrc`ファイルを参照)
- npm または yarn

### 手順

1. リポジトリをクローンします。

    ```sh
    git clone https://github.com/yourusername/tabinosuke-app.git
    cd tabinosuke-app
    ```

2. 必要なパッケージをインストールします。

    ```sh
    cd frontend
    npm install
    ```

3. 開発サーバーを起動します。

    ```sh
    npm run dev
    ```

4. ブラウザで以下のURLにアクセスします。

    ```
    http://localhost:3000
    ```
## ディレクトリ構造
## 主なファイルとディレクトリ

- **frontend/src/app**: アプリケーションの主要なページとコンポーネント
- **frontend/public**: 公開用の静的ファイル
- **frontend/tailwind.config.ts**: Tailwind CSSの設定ファイル
- **frontend/next.config.ts**: Next.jsの設定ファイル
- **frontend/vercel.json**: Vercelのデプロイ設定
