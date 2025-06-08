# 認証なしの代替案

## 方法1: Google Ads Editorを使用
1. Google Ads Editorをダウンロード
2. CSVファイルで一括インポート
3. JSONの代わりにCSV形式を使用

## 方法2: Google Ads Scripts
1. Google Ads管理画面で「ツール」→「スクリプト」
2. JavaScriptでキャンペーンを自動作成
3. 認証不要（既にログイン済みのため）

```javascript
// Google Ads Script例
function main() {
  const campaignData = {
    name: "新しいキャンペーン",
    budget: 5000
  };
  
  const campaign = AdWordsApp.campaigns().newCampaignBuilder()
    .withName(campaignData.name)
    .withBudget(campaignData.budget)
    .build();
}
```

## 方法3: 手動API keyのみ（非推奨）
- ユーザーに手動でリフレッシュトークンを取得してもらう
- 設定ファイルに直接トークンを記載
- セキュリティリスクが高い