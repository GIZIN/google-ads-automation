'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import FileUpload from '@/components/FileUpload'
import CampaignPreview from '@/components/CampaignPreview'
import ExecutionLog from '@/components/ExecutionLog'
import AuthButton from '@/components/AuthButton'

function HomeContent() {
  const { data: session, status } = useSession()
  const [jsonData, setJsonData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [autoStart, setAutoStart] = useState(false)

  const handleFileUpload = (data: any) => {
    setJsonData(data)
    setLogs([])
  }

  const handleExecute = async (isDryRun: boolean = false) => {
    if (!jsonData) return

    setIsProcessing(true)
    setLogs([])

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            ...jsonData,
            campaigns: jsonData.campaigns.map((campaign: any) => ({
              ...campaign,
              autoStart: autoStart
            }))
          },
          dryRun: isDryRun,
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n').filter(line => line.trim())
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line)
              if (data.log) {
                setLogs(prev => [...prev, data.log])
              }
            } catch (e) {
              console.error('Error parsing log:', e)
            }
          }
        }
      }
    } catch (error) {
      setLogs(prev => [...prev, `エラー: ${error}`])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Google Ads 自動設定ツール
            </h1>
            <div className="flex items-center space-x-4">
              {session && (
                <span className="text-sm text-gray-600">
                  {session.user?.email}
                </span>
              )}
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUpload onFileUpload={handleFileUpload} />
            
            {jsonData && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">実行オプション</h2>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoStart}
                      onChange={(e) => setAutoStart(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      作成後すぐに配信を開始する（上級者向け）
                      {autoStart && (
                        <span className="text-red-600 ml-2">
                          ⚠️ 確認なしで課金が始まります
                        </span>
                      )}
                    </span>
                  </label>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => handleExecute(true)}
                    disabled={!session || isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    確認モード（ドライラン）
                  </button>
                  <button
                    onClick={() => handleExecute(false)}
                    disabled={!session || isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    実行
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {jsonData && <CampaignPreview data={jsonData} />}
            {logs.length > 0 && <ExecutionLog logs={logs} />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <SessionProvider>
      <HomeContent />
    </SessionProvider>
  )
}