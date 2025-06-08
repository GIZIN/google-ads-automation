'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const handleAuth = async () => {
    if (session) {
      await signOut()
    } else {
      await signIn('google')
    }
  }

  return (
    <button
      onClick={handleAuth}
      disabled={isLoading}
      className={`px-4 py-2 rounded font-medium transition-colors ${
        session
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50`}
    >
      {isLoading ? '処理中...' : session ? 'ログアウト' : 'Google Adsにログイン'}
    </button>
  )
}