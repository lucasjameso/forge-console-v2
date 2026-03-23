import { useState } from 'react'
import { motion } from 'framer-motion'
import Markdown from 'react-markdown'
import {
  Database,
  Workflow,
  Globe,
  MessageSquare,
  Cpu,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info,
  Wrench,
  Lightbulb,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { usePageFeedback } from '@/hooks/usePageFeedback'
import { INTEGRATION_ICONS } from '@/lib/icons'
import { getPageColorVar } from '@/lib/colors'
import { formatRelativeTime } from '@/lib/utils'

// ---- Integration types and data ----

const ENV_LABELS: Record<string, string> = {
  VITE_SUPABASE_URL: 'Database URL',
  VITE_SUPABASE_ANON_KEY: 'API Key',
  VITE_N8N_URL: 'Automation Server URL',
  VITE_N8N_API_KEY: 'API Key',
  VITE_CF_ACCOUNT_ID: 'Account ID',
  VITE_SLACK_WEBHOOK_URL: 'Webhook URL',
  VITE_ANTHROPIC_API_KEY: 'API Key',
}

const DASHBOARD_URLS: Record<string, string> = {
  Supabase: 'https://supabase.com/dashboard',
  n8n: 'https://n8n.iac-solutions.io',
  Cloudflare: 'https://dash.cloudflare.com',
  Slack: 'https://slack.com/workspace',
  'Claude API': 'https://console.anthropic.com',
}

interface Integration {
  name: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  connected: boolean
  envVars: { key: string; set: boolean }[]
}

function getConnectionStatus(integration: Integration): 'connected' | 'partial' | 'disconnected' {
  const setCount = integration.envVars.filter(e => e.set).length
  if (setCount === integration.envVars.length) return 'connected'
  if (setCount > 0) return 'partial'
  return 'disconnected'
}

const statusConfig = {
  connected: {
    borderClass: 'border-l-4 border-l-[hsl(var(--status-success))]',
    badgeVariant: 'success' as const,
    badgeLabel: 'Connected',
    iconColor: 'text-[hsl(var(--status-success))]',
  },
  partial: {
    borderClass: 'border-l-4 border-l-[hsl(var(--status-warning))]',
    badgeVariant: 'warning' as const,
    badgeLabel: 'Partial',
    iconColor: 'text-[hsl(var(--status-warning))]',
  },
  disconnected: {
    borderClass: 'border-l-4 border-l-[hsl(var(--status-error))]',
    badgeVariant: 'error' as const,
    badgeLabel: 'Disconnected',
    iconColor: 'text-[hsl(var(--text-tertiary))]',
  },
}

const integrations: Integration[] = [
  {
    name: 'Supabase',
    description: 'Database, auth, and real-time subscriptions',
    icon: Database,
    connected: isSupabaseConfigured,
    envVars: [
      { key: 'VITE_SUPABASE_URL', set: Boolean(import.meta.env.VITE_SUPABASE_URL) },
      { key: 'VITE_SUPABASE_ANON_KEY', set: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) },
    ],
  },
  {
    name: 'n8n',
    description: 'Workflow automation and task dispatching',
    icon: Workflow,
    connected: Boolean(import.meta.env.VITE_N8N_URL && import.meta.env.VITE_N8N_API_KEY),
    envVars: [
      { key: 'VITE_N8N_URL', set: Boolean(import.meta.env.VITE_N8N_URL) },
      { key: 'VITE_N8N_API_KEY', set: Boolean(import.meta.env.VITE_N8N_API_KEY) },
    ],
  },
  {
    name: 'Cloudflare',
    description: 'Pages hosting and tunnel management',
    icon: Globe,
    connected: Boolean(import.meta.env.VITE_CF_ACCOUNT_ID),
    envVars: [
      { key: 'VITE_CF_ACCOUNT_ID', set: Boolean(import.meta.env.VITE_CF_ACCOUNT_ID) },
    ],
  },
  {
    name: 'Slack',
    description: 'Notifications and content approval flow',
    icon: MessageSquare,
    connected: Boolean(import.meta.env.VITE_SLACK_WEBHOOK_URL),
    envVars: [
      { key: 'VITE_SLACK_WEBHOOK_URL', set: Boolean(import.meta.env.VITE_SLACK_WEBHOOK_URL) },
    ],
  },
  {
    name: 'Claude API',
    description: 'AI-powered brain dump parsing and task generation',
    icon: Cpu,
    connected: Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY),
    envVars: [
      { key: 'VITE_ANTHROPIC_API_KEY', set: Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY) },
    ],
  },
]

// ---- Integration Card ----

function IntegrationCard({ integration, index }: { integration: Integration; index: number }) {
  const brandKey = integration.name.toLowerCase().replace(/\s+api$/i, '')
  const BrandIcon = INTEGRATION_ICONS[brandKey]
  const FallbackIcon = integration.icon
  const Icon = BrandIcon ?? FallbackIcon

  const connStatus = getConnectionStatus(integration)
  const config = statusConfig[connStatus]
  const dashUrl = DASHBOARD_URLS[integration.name]

  const [testResult, setTestResult] = useState<{ status: string; ms?: number } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  async function handleTest() {
    setIsTesting(true)
    setTestResult(null)
    const start = performance.now()
    try {
      if (integration.name === 'Supabase' && isSupabaseConfigured) {
        const { error } = await supabase.from('projects').select('id').limit(1)
        const ms = Math.round(performance.now() - start)
        if (error) {
          setTestResult({ status: `Failed: ${error.message}`, ms })
        } else {
          setTestResult({ status: 'Healthy', ms })
        }
      } else {
        setTestResult({ status: 'Test not available' })
      }
    } catch {
      const ms = Math.round(performance.now() - start)
      setTestResult({ status: 'Failed: timeout', ms })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={`p-6 flex flex-col gap-3.5 ${config.borderClass}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${
              connStatus === 'connected'
                ? 'bg-[hsl(var(--status-success-bg))]'
                : 'bg-[hsl(var(--bg-elevated))]'
            }`}>
              <Icon size={18} className={config.iconColor} />
            </div>
            <div>
              <h3 className="text-card-title text-[hsl(var(--text-primary))] m-0">
                {integration.name}
              </h3>
              <span className="text-caption">{integration.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connStatus === 'connected' && <CheckCircle size={14} className="text-[hsl(var(--status-success))]" />}
            {connStatus === 'disconnected' && <XCircle size={14} className="text-[hsl(var(--status-error))]" />}
            <Badge variant={config.badgeVariant}>{config.badgeLabel}</Badge>
          </div>
        </div>

        {/* Env vars with human-readable labels */}
        <TooltipProvider>
          <div className="flex flex-col gap-1.5">
            {integration.envVars.map(env => (
              <div key={env.key} className="flex items-center gap-2">
                {env.set ? (
                  <CheckCircle size={13} className="text-[hsl(var(--status-success))]" />
                ) : (
                  <XCircle size={13} className="text-[hsl(var(--text-tertiary))]" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-caption cursor-help">
                      {ENV_LABELS[env.key] ?? env.key}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <code className="text-[11px]">{env.key}</code>
                  </TooltipContent>
                </Tooltip>
                <span className="text-caption text-[hsl(var(--text-tertiary))]">
                  {env.set ? 'Set' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </TooltipProvider>

        {/* Test button + result */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleTest} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test'}
          </Button>
          {testResult && (
            <span className={`text-[12px] ${
              testResult.status === 'Healthy'
                ? 'text-[hsl(var(--status-success))]'
                : testResult.status === 'Test not available'
                  ? 'text-[hsl(var(--text-tertiary))]'
                  : 'text-[hsl(var(--status-error))]'
            }`}>
              {testResult.status}{testResult.ms !== undefined ? `, ${testResult.ms}ms` : ''}
            </span>
          )}
        </div>

        {/* Dashboard link */}
        {dashUrl && (
          <a
            href={dashUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-[hsl(var(--accent-coral))] no-underline flex items-center gap-1 mt-auto"
          >
            Open dashboard
            <ExternalLink size={11} />
          </a>
        )}
      </Card>
    </motion.div>
  )
}

// ---- Feedback Log ----

type FeedbackFilter = 'all' | 'open' | 'done'

const PAGE_COLOR_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  projects: 'projects',
  'brain dump': 'brain-dump',
  'brain-dump': 'brain-dump',
  'content pipeline': 'content-pipeline',
  'content-pipeline': 'content-pipeline',
  'social media': 'social-media',
  'social-media': 'social-media',
  'activity log': 'activity-log',
  'activity-log': 'activity-log',
  settings: 'settings',
}

function normalizePageKey(page: string): string {
  return PAGE_COLOR_MAP[page.toLowerCase()] ?? 'settings'
}

function FeedbackLog() {
  const [filter, setFilter] = useState<FeedbackFilter>('open')
  const queryFilter = filter === 'all' ? undefined : filter
  const { data: allFeedback } = usePageFeedback()
  const { data: filteredFeedback, isLoading } = usePageFeedback(queryFilter)

  const allItems = allFeedback ?? []
  const items = filteredFeedback ?? []

  const openCount = allItems.filter(i => i.status === 'open' || i.status === 'in_progress').length
  const doneCount = allItems.filter(i => i.status === 'done').length

  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filters: { key: FeedbackFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: allItems.length },
    { key: 'open', label: 'Open', count: openCount },
    { key: 'done', label: 'Done', count: doneCount },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-[13px] border-none cursor-pointer transition-all ${
              filter === f.key
                ? 'bg-[hsl(var(--bg-surface))] text-[hsl(var(--text-primary))] font-semibold shadow-sm'
                : 'bg-transparent text-[hsl(var(--text-tertiary))] font-normal'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* All addressed message */}
      {openCount === 0 && allItems.length > 0 && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success))] text-[13px]">
          All feedback has been addressed
        </div>
      )}

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <span className="text-caption">Loading feedback...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 px-6 text-center">
            <span className="text-body text-[hsl(var(--text-tertiary))]">
              {filter === 'all' ? 'No feedback yet. Use the coral button on any page to submit.' : `No ${filter} feedback.`}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item, idx) => {
              const isDone = item.status === 'done'
              const isExpanded = expandedId === item.id
              const pageKey = normalizePageKey(item.page)
              const pageColor = getPageColorVar(pageKey)
              const isFix = item.feedback_type === 'fix'

              return (
                <div
                  key={item.id}
                  className={`cursor-pointer transition-colors hover:bg-[hsl(var(--bg-elevated))] ${
                    idx < items.length - 1 ? 'border-b border-[hsl(var(--border-subtle))]' : ''
                  } ${isFix ? 'border-l-2 border-l-[hsl(var(--status-warning))]' : 'border-l-2 border-l-[hsl(var(--accent-navy))]'}`}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* Collapsed row */}
                  <div className={`px-4 py-2.5 flex items-center gap-2 ${isDone ? 'opacity-60' : ''}`}>
                    {isFix ? (
                      <Wrench size={12} className="text-[hsl(var(--status-error))] shrink-0" />
                    ) : (
                      <Lightbulb size={12} className="text-[hsl(var(--status-info))] shrink-0" />
                    )}
                    <span
                      className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        color: pageColor,
                        backgroundColor: pageColor.replace(')', ', 0.12)').replace('hsl(', 'hsla('),
                      }}
                    >
                      {item.page}
                    </span>
                    <span className={`text-body-sm flex-1 truncate ${isDone ? 'line-through' : ''} text-[hsl(var(--text-primary))]`}>
                      {item.content.split('\n')[0]}
                    </span>
                    <Badge variant={item.status === 'done' ? 'success' : item.status === 'in_progress' ? 'warning' : 'neutral'}>
                      {item.status === 'in_progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                    <span className="text-[12px] text-[hsl(var(--text-tertiary))] shrink-0">
                      {formatRelativeTime(item.created_at)}
                    </span>
                    {isExpanded ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-3 pl-9">
                      <div className="text-body-sm text-[hsl(var(--text-primary))] leading-relaxed [&_p]:my-1 [&_ul]:pl-4 [&_ul]:my-1 [&_li]:my-0.5 [&_code]:bg-[hsl(var(--bg-elevated))] [&_code]:px-1 [&_code]:rounded [&_code]:text-[12px]">
                        <Markdown>{item.content}</Markdown>
                      </div>
                      {isDone && item.resolution && (
                        <p className="mt-2 text-caption text-[hsl(var(--status-success))] italic">
                          Resolution: {item.resolution}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

// ---- System Info ----

function SystemInfo() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <span className="text-body">Application</span>
          <span className="text-body font-medium text-[hsl(var(--text-primary))]">Forge Console v2</span>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between">
          <span className="text-body">Version</span>
          <span className="text-body font-medium text-[hsl(var(--text-primary))]">v2.0</span>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between">
          <span className="text-body">Environment</span>
          <Badge variant={import.meta.env.PROD ? 'success' : 'neutral'}>
            {import.meta.env.PROD ? 'Production' : 'Development'}
          </Badge>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between">
          <span className="text-body">Organization</span>
          <span className="text-body font-medium text-[hsl(var(--text-primary))]">IAC Solutions</span>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between">
          <span className="text-body">Stack</span>
          <span className="text-body font-medium text-[hsl(var(--text-primary))]">React + TypeScript + Supabase + Cloudflare Pages</span>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between">
          <span className="text-body">Data Mode</span>
          <Badge variant={isSupabaseConfigured ? 'success' : 'warning'}>
            {isSupabaseConfigured ? 'Live (Supabase)' : 'Mock Data'}
          </Badge>
        </div>
        <div className="border-t border-[hsl(var(--border-subtle))]" />
        <div className="flex justify-between items-center">
          <span className="text-body">Repository</span>
          <a
            href="https://github.com/lucasoliver/forge-console-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-[hsl(var(--accent-coral))] no-underline flex items-center gap-1"
          >
            GitHub
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </Card>
  )
}

// ---- Settings Page ----

export function Settings() {
  return (
    <PageShell title="Settings" subtitle="Configure integrations and preferences.">
      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="preferences" disabled>Preferences</TabsTrigger>
          <TabsTrigger value="data" disabled>Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration, idx) => (
              <IntegrationCard key={integration.name} integration={integration} index={idx} />
            ))}
          </div>

          {/* Supabase setup instructions */}
          {!isSupabaseConfigured && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="p-6 border-l-[3px] border-l-[hsl(var(--status-warning))] bg-[hsl(var(--status-warning-bg))]">
                <div className="flex items-start gap-2.5">
                  <Info size={16} className="text-[hsl(var(--status-warning))] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-body font-medium text-[hsl(var(--text-primary))] mb-1.5 mt-0">
                      Running with mock data
                    </p>
                    <p className="text-body-sm text-[hsl(var(--text-secondary))] m-0 leading-relaxed">
                      To connect to a live database, add your Supabase credentials to the .env.local file and restart the dev server. Run the schema from supabase/schema.sql to create the required tables.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackLog />
        </TabsContent>

        <TabsContent value="system">
          <SystemInfo />
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-8 text-center">
            <span className="text-body text-[hsl(var(--text-tertiary))]">Coming soon</span>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card className="p-8 text-center">
            <span className="text-body text-[hsl(var(--text-tertiary))]">Coming soon</span>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
