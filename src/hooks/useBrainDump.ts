import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockBrainDumps } from '@/data/mock'
import type { BrainDump, ParsedBrainDump } from '@/types/database'

export function useBrainDumps() {
  return useQuery<BrainDump[]>({
    queryKey: ['brain-dumps'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockBrainDumps
      const { data, error } = await supabase
        .from('brain_dumps')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as BrainDump[]
    },
  })
}

async function parseBrainDumpWithClaude(text: string): Promise<ParsedBrainDump> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    // Fallback: simple local parsing
    const lines = text.split(/[.!?\n]+/).filter(l => l.trim())
    return {
      summary: `${lines.length} item(s) captured from brain dump.`,
      tasks: lines.map(line => ({
        description: line.trim(),
        project: 'unassigned',
        priority: 'medium' as const,
        deadline: null,
      })),
    }
  }

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
          content: `Parse the following brain dump into structured tasks. For each task, determine the most likely project (ridgeline, clarity, or forge), priority (high/medium/low), and any deadline mentioned. Return JSON only, no markdown.

Format:
{"summary": "...", "tasks": [{"description": "...", "project": "...", "priority": "high|medium|low", "deadline": "YYYY-MM-DD or null"}]}

Brain dump:
${text}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`)
  }

  const result = await response.json()
  const content = result.content?.[0]?.text ?? '{}'

  try {
    return JSON.parse(content) as ParsedBrainDump
  } catch {
    return {
      summary: 'Could not parse response from Claude.',
      tasks: [{ description: text, project: 'unassigned', priority: 'medium', deadline: null }],
    }
  }
}

export function useSubmitBrainDump() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (rawText: string) => {
      const parsed = await parseBrainDumpWithClaude(rawText)

      if (isSupabaseConfigured) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('brain_dumps')
          .insert({
            raw_text: rawText,
            parsed_output: parsed,
            status: 'processed',
          })
        if (error) throw error
      }

      return { rawText, parsed }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['brain-dumps'] })
    },
  })
}
