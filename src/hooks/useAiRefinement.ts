import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AiRefinementResult } from '@/types/database'

interface RefinementInput {
  caption: string
  action: 'refine' | 'hashtags'
}

type RefinementOutput = AiRefinementResult | { hashtags: string[] }

export function useAiRefinement() {
  return useMutation<RefinementOutput, Error, RefinementInput>({
    mutationFn: async ({ caption, action }) => {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

      if (!apiKey) {
        throw new Error('VITE_ANTHROPIC_API_KEY is not configured')
      }

      const systemPrompt =
        action === 'refine'
          ? `You are a LinkedIn content editor for a thought-leadership brand. Analyze the following caption and return 2-3 incremental improvement suggestions. Return JSON only, no markdown fencing.

Format:
{
  "suggestions": [
    {
      "type": "tighten" | "strengthen" | "cut" | "restructure" | "cta",
      "description": "what to change and why",
      "original": "the original text segment",
      "revised": "the improved text segment"
    }
  ],
  "char_count": <total character count of caption>,
  "in_range": <true if 1200-1600 chars>,
  "range_note": "brief note about length"
}`
          : `You are a LinkedIn hashtag strategist. Analyze the following caption and suggest 5-8 relevant hashtags for maximum reach and engagement. Return JSON only, no markdown fencing.

Format:
{ "hashtags": ["#hashtag1", "#hashtag2", ...] }`

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nCaption:\n${caption}`,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.content?.[0]?.text ?? '{}'

      let jsonStr = content.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?\s*```$/, '')
      }

      return JSON.parse(jsonStr) as RefinementOutput
    },
    onError: (error: Error) => {
      toast.error('AI refinement failed', { description: error.message })
    },
  })
}
