# Tabinosuke-app
# enguildハッカソン

# バックエンド
## 使用言語
<img src="https://img.shields.io/badge/-Python-3776AB.svg?logo=python&style=plastic">

## 使用フレームワーク
<img src="https://img.shields.io/badge/-Django-092E20.svg?logo=django&style=plastic">

## ローカルセットアップ

`backend`ディレクトリに`.env`ファイルを作成し、以下の環境変数を設定してください。

- **`google_api_key`**: 
  - **説明**: Google APIを利用するためのAPIキーです。
  - **設定方法**: Google Cloud PlatformでAPIキーを取得し、ここに設定します。

- **`DB_USER`**: 
  - **説明**: データベースにアクセスするためのユーザー名です。
  - **設定方法**: データベースのユーザー名を指定します。

- **`DB_PASSWORD`**: 
  - **説明**: データベースユーザーのパスワードです。
  - **設定方法**: データベースのパスワードを指定します。

- **`DB_NAME`**: 
  - **説明**: 使用するデータベースの名前です。
  - **設定方法**: データベースの名前を指定します。

- **`DJANGO_SUPERUSER_USERNAME`**: 
  - **説明**: Django管理サイトのスーパーユーザーのユーザー名です。
  - **設定方法**: スーパーユーザーのユーザー名を指定します。

- **`DJANGO_SUPERUSER_EMAIL`**: 
  - **説明**: Django管理サイトのスーパーユーザーのメールアドレスです。
  - **設定方法**: スーパーユーザーのメールアドレスを指定します。

- **`DJANGO_SUPERUSER_PASSWORD`**: 
  - **説明**: Django管理サイトのスーパーユーザーのパスワードです。
  - **設定方法**: スーパーユーザーのパスワードを指定します。

- **`DJANGO_SECRET_KEY`**: 
  - **説明**: Djangoアプリケーションのセキュリティキーです。
  - **設定方法**: ランダムな文字列を使用してください。

- **`DJANGO_ALLOWED_HOSTS`**: 
  - **説明**: アプリケーションがアクセスを許可するホスト名のリストです。
  - **設定方法**: カンマで区切って指定します。

- **`DJANGO_DEBUG`**: 
  - **説明**: デバッグモードを有効にするかどうかを指定します。
  - **設定方法**: 本番環境では`False`に設定します。

DockerとDocker-composeを、以下のサイトを参考にして、インストールしてください。

[**`Docker公式ドキュメント`**](https://docs.docker.com/get-docker/)

[**`Docker-Compose公式ドキュメント`**](https://docs.docker.com/compose/install/)



### Macの場合

1. **Docker Desktopのインストール**

   Docker Desktopをインストールして起動します。Docker DesktopにはDocker Composeが含まれています。

   - [Docker Desktop for Macのインストールガイド](https://docs.docker.com/desktop/install/mac-install/)

2. **プロジェクトの立ち上げ**

   `backend`ディレクトリ直下で以下のコマンドを実行して、Dockerコンテナをビルドし、立ち上げます。

   ```bash
   docker-compose up --build
   ```

   このコマンドにより、DjangoアプリケーションとPostgreSQLデータベースがコンテナ内で起動します。

### Windowsの場合

1. **Docker Desktopのインストール**

   Docker Desktopをインストールして起動します。Docker DesktopにはDocker Composeが含まれています。

   - [Docker Desktop for Windowsのインストールガイド](https://docs.docker.com/desktop/install/windows-install/)

2. **プロジェクトの立ち上げ**

   `backend`ディレクトリ直下で以下のコマンドを実行して、Dockerコンテナをビルドし、立ち上げます。

   ```cmd
   docker-compose up --build
   ```

   このコマンドにより、DjangoアプリケーションとPostgreSQLデータベースがコンテナ内で起動します。



## エンドポイント

### 基本情報

- **ベースURL**: [**`localhost:8000/`**](#)
- **認証方式**: 無し
- **コンテンツ形式**: `application/json`
- **エンコーディング**: `UTF-8`

### エンドポイント一覧

| エンドポイント | 許可されたメソッド | 機能要件 |
| --- | --- | --- |
| `/search-placename` | GET, POST | スポット名を検索 |
| `/two-place-distance` | GET, POST | 二つの場所の距離、所用時間を表示 |
| `/schedule-adjust` | POST | スケジュールの短縮 |
| `/save` | POST | スケジュールの保存 |
| `/load/<uuid:uuid>` | GET | スケジュールの読込 |

## API仕様

### スポット検索API (`/search-placename`)

- **概要**: ユーザーが入力したスポット名に対してGoogle Places APIを使用し、検索結果上位5件を取得
- **リクエスト**
  - **GET**: `place_name`パラメータを指定
  - **POST**: JSONボディで`place_name`を指定
- **レスポンス**: 検索結果の場所名と住所

### 距離・所要時間取得API (`/two-place-distance`)

- **概要**: 2地点間の距離と所要時間をGoogle Maps APIを用いて算出
- **リクエスト**
  - **GET/POST**: `place_from`, `place_to`, `mode`を指定
- **レスポンス**: 距離と所要時間

### スケジュール短縮API (`/schedule-adjust`)

- **概要**: 入力されたスケジュールリストに対し、短縮後のスケジュールリストを出力
- **リクエスト**: JSONボディでスケジュールデータを指定
- **レスポンス**: 短縮後のスケジュールデータ

### スケジュールの保存 (`/save`)

- **メソッド**: POST
- **リクエスト**: スケジュールデータをJSONで送信
- **レスポンス**: 保存されたスケジュールのUUID

### スケジュールの読み込み (`/load/<uuid:uuid>`)

- **メソッド**: GET
- **リクエスト**: スケジュールのUUIDを指定
- **レスポンス**: スケジュールデータ

## モデル

### StartPoint

- **フィールド**: `id`, `location`, `departure_datetime`, `travel_method_to_next`
- **説明**: 旅行プランの開始地点を表す

### FinalPoint

- **フィールド**: `id`, `location`, `arrival_datetime`
- **説明**: 旅行プランの最終地点を表す

### TravelPlan

- **フィールド**: `id`, `plan_name`, `start_point`, `final_point`
- **説明**: 旅行プラン全体を表す

### ViaPoint

- **フィールド**: `id`, `index`, `plan`, `location`, `arrival_datetime`, `priority`, `departure_datetime`, `travel_method_to_next`
- **説明**: 旅行プランの経由地点を表す

## シリアライザー


### シリアライザーの例

`TravelPlan`モデルのシリアライザーの例

```python
from rest_framework import serializers
from .models import TravelPlan, StartPoint, FinalPoint, ViaPoint

class StartPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartPoint
        fields = '__all__'

class FinalPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalPoint
        fields = '__all__'

class ViaPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViaPoint
        fields = '__all__'

class TravelPlanSerializer(serializers.ModelSerializer):
    start_point = StartPointSerializer()
    final_point = FinalPointSerializer()
    via_points = ViaPointSerializer(many=True)

    class Meta:
        model = TravelPlan
        fields = '__all__'
```
