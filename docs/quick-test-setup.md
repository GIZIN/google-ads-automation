# すぐにアプリをテストする方法

## オプション1: モックモードで動作確認

開発者トークンなしでUIと基本機能をテストできます。

### 1. モックモードの実装

`app/api/campaigns/create/route.ts`を以下のように修正：

```typescript
// ファイルの先頭に追加
const IS_MOCK_MODE = process.env.GOOGLE_DEVELOPER_TOKEN === 'TEST_DEVELOPER_TOKEN'

// API処理部分を条件分岐
if (IS_MOCK_MODE) {
  // モックレスポンスを返す
  controller.enqueue(encoder.encode(JSON.stringify({ log: '🔧 モックモードで実行中' }) + '\n'))
  // シミュレーション処理...
} else {
  // 実際のAPI呼び出し
}
```

### 2. NextAuth Secretの生成

ターミナルで実行：
```bash
openssl rand -base64 32
```

生成された文字列を`.env.local`の`NEXTAUTH_SECRET=`に設定

### 3. アプリの起動

```bash
npm run dev
```

http://localhost:3000 にアクセス

## オプション2: MCCアカウントの作成

1. [Google Ads Manager Accounts](https://ads.google.com/intl/ja_jp/home/tools/manager-accounts/)にアクセス
2. 「管理用アカウントを作成」をクリック
3. 必要情報を入力して作成
4. APIセンターにアクセス可能になります

## オプション3: Google Ads Scriptsで代替

認証不要でキャンペーンを自動作成：

1. Google Ads管理画面 → ツール → スクリプト
2. JSONデータをスクリプトに貼り付けて実行
3. 認証やAPIトークン不要

## 現在の状況でできること

- ✅ UIの確認（ファイルアップロード、プレビュー）
- ✅ JSONバリデーション
- ✅ Google認証フロー（ログイン/ログアウト）
- ❌ 実際のキャンペーン作成（MCCアカウントが必要）

モックモードでUIの動作確認から始めることをお勧めします。