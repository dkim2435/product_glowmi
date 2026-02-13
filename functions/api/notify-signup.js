const ALLOWED_ORIGINS = [
  'https://glowmi.org',
  'https://www.glowmi.org',
  'http://localhost:5173',
]

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || ''
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin') || ''
  const headers = corsHeaders(origin)

  try {
    const { name } = await context.request.json()

    if (!name || typeof name !== 'string') {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const safeName = name.trim().slice(0, 100)

    const webhookUrl = context.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: 'Webhook not configured' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🎉 새 가입자: ${safeName}`,
      }),
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    })
  }
}
