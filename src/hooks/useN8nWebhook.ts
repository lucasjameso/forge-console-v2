import { useCallback } from 'react'

interface WebhookPayload {
  action: 'approved' | 'rejected'
  post_title: string
  scheduled_date: string | null
  platform: string
  rejection_reason?: string
}

export function useN8nWebhook() {
  const fireWebhook = useCallback(async (payload: WebhookPayload) => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined

    if (!webhookUrl) return

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (err) {
      console.warn('n8n webhook failed (fire-and-forget):', err)
    }
  }, [])

  return { fireWebhook }
}
