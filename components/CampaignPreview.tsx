'use client'

interface CampaignPreviewProps {
  data: any
}

export default function CampaignPreview({ data }: CampaignPreviewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">設定内容プレビュー</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">アカウントID</p>
          <p className="font-mono">{data.accountId}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">キャンペーン数</p>
          <p>{data.campaigns.length}</p>
        </div>

        {data.campaigns.map((campaign: any, index: number) => (
          <div key={index} className="border-t pt-4">
            <h3 className="font-semibold">{campaign.name}</h3>
            
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <span className="text-gray-600">日予算:</span> ¥{campaign.dailyBudget.toLocaleString()}
              </div>
              <div>
                <span className="text-gray-600">開始日:</span> {campaign.startDate}
              </div>
              <div>
                <span className="text-gray-600">地域:</span> {campaign.locations.join(', ')}
              </div>
              <div>
                <span className="text-gray-600">広告グループ数:</span> {campaign.adGroups.length}
              </div>
            </div>

            {campaign.adGroups.map((adGroup: any, agIndex: number) => (
              <div key={agIndex} className="ml-4 mt-2 p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">{adGroup.name}</p>
                <p className="text-xs text-gray-600">
                  キーワード: {adGroup.keywords.length}個 / 広告: {adGroup.ads.length}個
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}