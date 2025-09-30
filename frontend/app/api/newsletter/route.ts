import {NextRequest, NextResponse} from 'next/server'

/**
 * Newsletter subscription API endpoint
 *
 * Supports multiple email providers via environment variables:
 * - NEWSLETTER_PROVIDER: 'resend' | 'convertkit' | 'mailchimp' | 'buttondown' | 'mailerlite'
 * - Provider-specific API keys
 *
 * Example .env.local:
 * NEWSLETTER_PROVIDER=mailerlite
 * MAILERLITE_API_KEY=your_key
 * MAILERLITE_GROUP_ID=your_group_id (optional)
 */

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function subscribeToResend(email: string) {
  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    throw new Error('Resend API key or audience ID not configured')
  }

  const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to subscribe')
  }

  return await response.json()
}

async function subscribeToConvertKit(email: string) {
  const apiKey = process.env.CONVERTKIT_API_KEY
  const formId = process.env.CONVERTKIT_FORM_ID

  if (!apiKey || !formId) {
    throw new Error('ConvertKit API key or form ID not configured')
  }

  const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: apiKey,
      email,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to subscribe')
  }

  return await response.json()
}

async function subscribeToMailchimp(email: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX // e.g., 'us1'

  if (!apiKey || !audienceId || !serverPrefix) {
    throw new Error('Mailchimp API key, audience ID, or server prefix not configured')
  }

  const response = await fetch(
    `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed',
      }),
    },
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.title || 'Failed to subscribe')
  }

  return await response.json()
}

async function subscribeToButtondown(email: string) {
  const apiKey = process.env.BUTTONDOWN_API_KEY

  if (!apiKey) {
    throw new Error('Buttondown API key not configured')
  }

  const response = await fetch('https://api.buttondown.email/v1/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    },
    body: JSON.stringify({
      email,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to subscribe')
  }

  return await response.json()
}

async function subscribeToMailerLite(email: string) {
  const apiKey = process.env.MAILERLITE_API_KEY
  const groupId = process.env.MAILERLITE_GROUP_ID

  if (!apiKey) {
    throw new Error('MailerLite API key not configured')
  }

  const body: any = {
    email,
  }

  // Add to specific group if provided
  if (groupId) {
    body.groups = [groupId]
  }

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to subscribe')
  }

  return await response.json()
}

export async function POST(request: NextRequest) {
  try {
    const {email} = await request.json()

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({error: 'Please provide a valid email address'}, {status: 400})
    }

    const provider = process.env.NEWSLETTER_PROVIDER || 'none'

    // Subscribe based on provider
    switch (provider) {
      case 'resend':
        await subscribeToResend(email)
        break
      case 'convertkit':
        await subscribeToConvertKit(email)
        break
      case 'mailchimp':
        await subscribeToMailchimp(email)
        break
      case 'buttondown':
        await subscribeToButtondown(email)
        break
      case 'mailerlite':
        await subscribeToMailerLite(email)
        break
      case 'none':
        // No provider configured - log to console for development
        console.log('Newsletter signup (no provider configured):', email)
        break
      default:
        return NextResponse.json({error: 'Newsletter provider not configured'}, {status: 500})
    }

    return NextResponse.json({
      message: 'Successfully subscribed! Check your email to confirm.',
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    return NextResponse.json(
      {error: errorMessage},
      {status: 500},
    )
  }
}