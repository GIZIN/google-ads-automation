# キャンペーンの自動開始設定

## 現在の仕様

デフォルトでは安全のため、すべてのキャンペーンは**一時停止（PAUSED）**状態で作成されます。

## 自動開始を有効にする方法

### 方法1: JSONで制御（推奨）

JSONファイルに`autoStart`フラグを追加：

```json
{
  "accountId": "XXX-XXX-XXXX",
  "campaigns": [{
    "name": "キャンペーン名",
    "autoStart": true,  // 追加
    "dailyBudget": 5000,
    ...
  }]
}
```

### 方法2: コードを変更

`app/api/campaigns/create/route.ts`の48行目を変更：

```typescript
// 変更前
status: enums.CampaignStatus.PAUSED,

// 変更後（自動開始）
status: campaignConfig.autoStart ? enums.CampaignStatus.ENABLED : enums.CampaignStatus.PAUSED,
```

### 方法3: グローバル設定

環境変数で制御：
```
AUTO_START_CAMPAIGNS=true
```

## 推奨事項

1. **初回は必ず一時停止で作成**
   - 設定ミスによる予期せぬ課金を防ぐ
   - 広告内容の最終確認

2. **段階的な開始**
   - まず小予算でテスト
   - 問題なければ本格稼働

3. **通知設定**
   - 予算アラートを設定
   - 異常な消費を検知

## 現在の安全機能

- ✅ デフォルトで一時停止
- ✅ ドライランモードで事前確認
- ✅ 実行ログで作成内容を確認
- ✅ 日予算の上限設定