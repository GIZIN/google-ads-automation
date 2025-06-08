import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { GoogleAdsApi, enums } from 'google-ads-api'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const session = await getServerSession(authOptions)
        controller.enqueue(encoder.encode(JSON.stringify({ log: `セッション情報: ${JSON.stringify(session ? {email: session.user?.email, hasToken: !!session.accessToken, hasRefresh: !!session.refreshToken} : null)}` }) + '\n'))
        
        if (!session || !session.refreshToken) {
          controller.enqueue(encoder.encode(JSON.stringify({ log: 'エラー: 認証が必要です。再度ログインしてください。' }) + '\n'))
          controller.close()
          return
        }

        const { config, dryRun } = await request.json()
        
        controller.enqueue(encoder.encode(JSON.stringify({ log: `${dryRun ? 'ドライラン' : '実行'}モードで開始します` }) + '\n'))
        
        // Google Ads API クライアントの初期化
        const client = new GoogleAdsApi({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
        })

        controller.enqueue(encoder.encode(JSON.stringify({ log: `Customer ID: ${config.accountId.replace(/-/g, '')}` }) + '\n'))
        controller.enqueue(encoder.encode(JSON.stringify({ log: `Refresh token length: ${session.refreshToken?.length || 0}` }) + '\n'))
        
        const customer = client.Customer({
          customer_id: config.accountId.replace(/-/g, ''),
          refresh_token: session.refreshToken as string,
        })

        for (const campaignConfig of config.campaigns) {
          controller.enqueue(encoder.encode(JSON.stringify({ log: `キャンペーン "${campaignConfig.name}" を処理中...` }) + '\n'))
          
          if (!dryRun) {
            // キャンペーンの作成
            const campaign = {
              name: campaignConfig.name,
              advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
              status: campaignConfig.autoStart ? enums.CampaignStatus.ENABLED : enums.CampaignStatus.PAUSED,
              campaign_budget: {
                amount_micros: campaignConfig.dailyBudget * 1000000,
                delivery_method: enums.BudgetDeliveryMethod.STANDARD,
              },
              start_date: campaignConfig.startDate.replace(/-/g, ''),
              geo_target_type_setting: {
                positive_geo_target_type: enums.PositiveGeoTargetType.PRESENCE,
              },
            }

            try {
              const campaignOperation = {
                create: campaign,
              }

              const { results } = await customer.campaigns.create([campaignOperation])
              const campaignResourceName = results[0].resource_name
              
              controller.enqueue(encoder.encode(JSON.stringify({ log: `✓ キャンペーン作成完了: ${campaignResourceName}` }) + '\n'))

              // 広告グループの作成
              for (const adGroupConfig of campaignConfig.adGroups) {
                controller.enqueue(encoder.encode(JSON.stringify({ log: `  広告グループ "${adGroupConfig.name}" を作成中...` }) + '\n'))
                
                const adGroup = {
                  name: adGroupConfig.name,
                  campaign: campaignResourceName,
                  status: enums.AdGroupStatus.ENABLED,
                  type: enums.AdGroupType.SEARCH_STANDARD,
                }

                const adGroupOperation = {
                  create: adGroup,
                }

                const { results: adGroupResults } = await customer.adGroups.create([adGroupOperation])
                const adGroupResourceName = adGroupResults[0].resource_name
                
                controller.enqueue(encoder.encode(JSON.stringify({ log: `  ✓ 広告グループ作成完了` }) + '\n'))

                // キーワードの作成
                for (const keywordConfig of adGroupConfig.keywords) {
                  const keyword = {
                    ad_group: adGroupResourceName,
                    text: keywordConfig.text,
                    match_type: enums.KeywordMatchType[keywordConfig.matchType],
                    cpc_bid_micros: keywordConfig.bidAmount * 1000000,
                  }

                  await customer.adGroupCriterions.create([{ create: keyword }])
                }
                
                controller.enqueue(encoder.encode(JSON.stringify({ log: `  ✓ キーワード ${adGroupConfig.keywords.length}個を追加` }) + '\n'))

                // 広告の作成
                for (const adConfig of adGroupConfig.ads) {
                  const ad = {
                    ad_group: adGroupResourceName,
                    status: campaignConfig.autoStart ? enums.AdStatus.ENABLED : enums.AdStatus.PAUSED,
                    responsive_search_ad: {
                      headlines: adConfig.headlines.map((headline: string) => ({ text: headline })),
                      descriptions: adConfig.descriptions.map((description: string) => ({ text: description })),
                      final_urls: [adConfig.finalUrl],
                    },
                  }

                  await customer.ads.create([{ create: ad }])
                }
                
                controller.enqueue(encoder.encode(JSON.stringify({ log: `  ✓ 広告 ${adGroupConfig.ads.length}個を作成` }) + '\n'))
              }
            } catch (error: any) {
              const errorMessage = error.message || error.toString()
              const errorDetails = error.errors ? JSON.stringify(error.errors) : ''
              controller.enqueue(encoder.encode(JSON.stringify({ log: `エラー: ${errorMessage}` }) + '\n'))
              if (errorDetails) {
                controller.enqueue(encoder.encode(JSON.stringify({ log: `詳細: ${errorDetails}` }) + '\n'))
              }
              if (error.code) {
                controller.enqueue(encoder.encode(JSON.stringify({ log: `エラーコード: ${error.code}` }) + '\n'))
              }
            }
          } else {
            controller.enqueue(encoder.encode(JSON.stringify({ log: '✓ バリデーション成功' }) + '\n'))
            controller.enqueue(encoder.encode(JSON.stringify({ log: `  - 広告グループ数: ${campaignConfig.adGroups.length}` }) + '\n'))
            
            for (const adGroup of campaignConfig.adGroups) {
              controller.enqueue(encoder.encode(JSON.stringify({ log: `  - "${adGroup.name}": キーワード ${adGroup.keywords.length}個, 広告 ${adGroup.ads.length}個` }) + '\n'))
            }
          }
        }

        controller.enqueue(encoder.encode(JSON.stringify({ log: '処理が完了しました' }) + '\n'))
      } catch (error: any) {
        const errorMessage = error.message || error.toString()
        controller.enqueue(encoder.encode(JSON.stringify({ log: `エラーが発生しました: ${errorMessage}` }) + '\n'))
        if (error.stack) {
          controller.enqueue(encoder.encode(JSON.stringify({ log: `スタックトレース: ${error.stack}` }) + '\n'))
        }
      } finally {
        controller.close()
      }
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}