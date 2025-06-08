'use client'

interface ExecutionLogProps {
  logs: string[]
}

export default function ExecutionLog({ logs }: ExecutionLogProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">実行ログ</h2>
      
      <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500">ログがありません</div>
        )}
      </div>
    </div>
  )
}