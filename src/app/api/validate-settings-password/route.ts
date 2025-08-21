/**
 * Settings Password Validation API Route
 * Securely validates admin access to advanced settings
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password }: { password?: string } = body

    // Security: Check settings password on server-side
    const REQUIRED_SETTINGS_PASSWORD = "Dvir123"
    const isValid = password === REQUIRED_SETTINGS_PASSWORD

    return NextResponse.json({
      valid: isValid
    })

  } catch (error) {
    console.error('Settings password validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    )
  }
}
