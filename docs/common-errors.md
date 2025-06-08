# よくあるエラーと解決方法

## 0. DEVELOPER_TOKEN_NOT_APPROVED

**エラーメッセージ**:
```
The developer token is only approved for use with test accounts
```

**原因**: 開発者トークンがテストアカウント専用

**解決方法**:
1. テストアカウントを作成して使用
2. または、Google Ads APIセンターで「Basic Access」を申請
3. 申請承認後、本番アカウントで使用可能に

## 1. エラー 403: access_denied

**原因**: テストユーザーとして登録されていない

**解決方法**:
1. Google Cloud Console → OAuth同意画面
2. テストユーザーにメールアドレスを追加

## 2. 「このアプリは Google で確認されていません」

**原因**: 開発中のアプリのため（正常）

**解決方法**:
1. 「詳細」をクリック
2. 「ads（安全ではないページ）に移動」をクリック
3. 権限を許可

## 3. ポート3000が使用中

**原因**: 別のアプリが3000番ポートを使用

**解決方法**:
```bash
# ポート3000を使用しているプロセスを終了
lsof -ti:3000 | xargs kill -9
```

## 4. Tailwind CSSエラー

**原因**: Tailwind CSS v4とNext.jsの互換性問題

**解決方法**:
```bash
npm uninstall tailwindcss
npm install tailwindcss@3
```

## 5. API認証エラー

**原因**: 環境変数が正しく設定されていない

**解決方法**:
`.env.local`ファイルを確認:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_DEVELOPER_TOKEN
- NEXTAUTH_SECRET

すべて正しく設定されているか確認