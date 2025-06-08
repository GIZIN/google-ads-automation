import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(new URL('/api/auth/signin', process.env.NEXTAUTH_URL))
}