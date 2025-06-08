function main() {
  // キャンペーンの作成
  var campaign = AdsApp.newCampaignBuilder()
    .withName('高速開発サービス_検索_202406')
    .withBudget(2900)
    .withStatus('PAUSED')  // 一時停止で作成
    .build()
    .getResult();
  
  // 広告グループの作成
  var adGroup = campaign.newAdGroupBuilder()
    .withName('1dayプロトタイプ訴求')
    .withCpc(1.5)
    .build()
    .getResult();
  
  // キーワードの追加
  var keywords = [
    'アプリ開発 最短',
    'プロトタイプ 1日',
    'MVP開発 高速'
  ];
  
  keywords.forEach(function(keyword) {
    adGroup.newKeywordBuilder()
      .withText(keyword)
      .build();
  });
  
  // レスポンシブ検索広告の作成
  var ad = adGroup.newAd().responsiveSearchAdBuilder()
    .addHeadline('アプリ開発最短1日で完成')
    .addHeadline('明日の会議に間に合います')
    .addHeadline('Claude AI活用の高速開発')
    .addDescription('アイデアを24時間でプロトタイプに。初回相談無料。')
    .addDescription('従来6ヶ月かかる開発を1週間で。')
    .withFinalUrl('https://fastdev-landing.vercel.app/')
    .build()
    .getResult();
  
  Logger.log('キャンペーン作成完了: ' + campaign.getName());
}