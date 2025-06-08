# クイックスタートチェックリスト

## 本番環境で使用するための必須手順

### ✅ 1. Google Cloud Console設定
- [ ] プロジェクト作成
- [ ] OAuth 2.0クライアントID作成
- [ ] リダイレクトURI設定: `http://localhost:3000/api/auth/callback/google`
- [ ] テストユーザー追加

### ✅ 2. Google Ads MCC設定
- [ ] MCCアカウント作成
- [ ] APIセンターで開発者トークン取得
- [ ] **Basic Access申請**（本番利用に必須）

### ✅ 3. アプリケーション設定
- [ ] `.env.local`ファイル作成
- [ ] 環境変数設定:
  - GOOGLE_CLIENT_ID
  - GOOGLE_CLIENT_SECRET
  - GOOGLE_DEVELOPER_TOKEN
  - NEXTAUTH_SECRET

### ✅ 4. 動作確認
- [ ] `npm install`実行
- [ ] `npm run dev`でサーバー起動
- [ ] Google認証ログイン確認
- [ ] JSONファイルアップロード確認

## ⚠️ 重要な注意点

1. **初回トークンはテスト専用**
   - 本番アカウントでは使用不可
   - Basic Access申請が必要

2. **Basic Access未申請の場合**
   - エラー: `DEVELOPER_TOKEN_NOT_APPROVED`
   - 解決: APIセンターから申請

3. **申請承認まで（1-3日）の代替案**
   - Google Ads Scripts使用
   - 手動でキャンペーン作成
   - テストアカウントで練習

## 🚀 本番運用開始の条件
- ✅ Basic Access承認済み
- ✅ 本番アカウントID設定
- ✅ 動作テスト完了