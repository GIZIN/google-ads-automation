# Google Ads 自動設定アプリ セットアップガイド

## 1. Google Cloud Console設定

### OAuth 2.0 クライアントの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成または選択
3. 「APIとサービス」→「認証情報」へ移動
4. 「認証情報を作成」→「OAuth クライアント ID」を選択
5. アプリケーションの種類：「ウェブアプリケーション」を選択
6. 以下を設定：
   - 名前：任意（例：Google Ads Automation）
   - 承認済みのJavaScriptオリジン：`http://localhost:3000`
   - 承認済みのリダイレクトURI：`http://localhost:3000/api/auth/callback/google`
7. 作成後、クライアントIDとクライアントシークレットをメモ

### Google Ads APIの有効化
1. 「APIとサービス」→「ライブラリ」へ移動
2. 「Google Ads API」を検索して有効化

## 2. Google Ads開発者トークンの取得

1. [Google Ads](https://ads.google.com/)にログイン
2. 「ツールと設定」→「APIセンター」へアクセス
3. 開発者トークンを申請
   - **初回申請時は「テストアカウント専用」トークンが発行されます**
   - 本番アカウントで使用するには「Basic Access」申請が必要

### 開発者トークンのアクセスレベル

| レベル | 使用可能アカウント | 申請方法 |
|-------|-----------------|---------|
| Test Account Only | テストアカウントのみ | 自動発行（即時） |
| Basic Access | 本番アカウント | 申請フォーム提出（数日） |
| Standard Access | 大規模利用 | 追加審査必要 |

**重要**: 初めての場合は、まずテストアカウントで動作確認してから本番申請することを推奨

### Basic Access申請手順（本番利用に必須）

1. MCCアカウントにログイン
2. APIセンター（https://ads.google.com/aw/apicenter）にアクセス
3. 「Apply for Basic Access」ボタンをクリック
4. 申請フォームに以下を記入：
   - **Contact Email**: あなたのメールアドレス
   - **Use Case**: Internal tool for automated campaign management
   - **Monthly API Operations**: Less than 10,000
   - **Number of Accounts**: 1-10
   - **Description**: 
     ```
     JSON-based campaign automation tool for internal use.
     Automates creation of campaigns, ad groups, keywords, and ads.
     ```

5. 申請を送信
6. **承認期間**: 通常1-3営業日
7. 承認メールが届いたら、本番アカウントで使用開始

**注意**: Basic Access申請なしでは、本番アカウントでこのツールは使用できません

## 3. 環境変数の設定

`.env.local`ファイルを以下のように更新：

```
GOOGLE_CLIENT_ID=取得したクライアントID
GOOGLE_CLIENT_SECRET=取得したクライアントシークレット
GOOGLE_DEVELOPER_TOKEN=取得した開発者トークン
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ランダムな文字列（下記コマンドで生成）
```

NextAuth Secretの生成：
```bash
openssl rand -base64 32
```

## 4. テストユーザーの追加（重要）

OAuth認証を使用するには、テストユーザーの登録が必要です：

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 「APIとサービス」→「OAuth同意画面」を選択
3. 「テストユーザー」セクションを確認
4. 「+ ADD USERS」ボタンをクリック
5. 使用するGoogleアカウントのメールアドレスを追加
6. 「保存」をクリック

**注意**: 
- テストユーザーとして登録されていないと、「エラー 403: access_denied」が表示されます
- 初回ログイン時に「このアプリは Google で確認されていません」という警告が表示されますが、これは正常です
  - 「詳細」→「ads（安全ではないページ）に移動」をクリックして続行

## 5. アプリケーションの起動

```bash
npm run dev
```

http://localhost:3000 にアクセスして使用開始

## 6. 初回ログイン時の手順

1. 「Google Adsにログイン」ボタンをクリック
2. Googleアカウントでログイン
3. **「このアプリは Google で確認されていません」の警告画面が表示される**
   - これは開発中のアプリでは正常な動作です
   - 「詳細」をクリック
   - 「ads（安全ではないページ）に移動」をクリック
4. アプリが要求する権限を確認
   - Google Adsへのアクセス権限
   - プロフィール情報の読み取り
5. 「続行」をクリックして許可

**注意**: この警告は、アプリがGoogleの審査を受けていないために表示されます。自社利用の場合は問題ありません。

## 注意事項

- 本番環境では`NEXTAUTH_URL`を実際のドメインに変更
- Google Ads APIの利用には料金は発生しませんが、広告費は別途発生します
- テストアカウントでの動作確認を推奨
- API利用制限に注意（1日あたりのリクエスト数制限あり）