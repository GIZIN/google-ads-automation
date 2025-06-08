'use client'

import { useState, useCallback } from 'react'

interface FileUploadProps {
  onFileUpload: (data: any) => void
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [error, setError] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = async (file: File) => {
    setError('')
    
    if (!file.name.endsWith('.json')) {
      setError('JSONファイルのみアップロード可能です')
      return
    }

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // 基本的なバリデーション
      if (!data.accountId || !data.campaigns || !Array.isArray(data.campaigns)) {
        setError('JSONファイルの形式が正しくありません')
        return
      }

      onFileUpload(data)
    } catch (err) {
      setError('JSONファイルの解析に失敗しました')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">設定ファイルアップロード</h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        <p className="mt-2 text-sm text-gray-600">
          JSONファイルをドラッグ&ドロップ
        </p>
        <p className="text-xs text-gray-500">または</p>
        
        <label className="mt-2 cursor-pointer">
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            ファイルを選択
          </span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => {
            const template = {
              accountId: "123-456-7890",
              campaigns: [{
                name: "キャンペーン名",
                dailyBudget: 5000,
                startDate: new Date().toISOString().split('T')[0],
                locations: ["東京都"],
                adGroups: [{
                  name: "広告グループ名",
                  keywords: [
                    { text: "キーワード", matchType: "PHRASE", bidAmount: 100 }
                  ],
                  ads: [{
                    headlines: ["見出し1", "見出し2", "見出し3"],
                    descriptions: ["説明文1", "説明文2"],
                    finalUrl: "https://example.com"
                  }]
                }]
              }]
            }
            
            const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'google-ads-template.json'
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          テンプレートをダウンロード
        </button>
      </div>
    </div>
  )
}