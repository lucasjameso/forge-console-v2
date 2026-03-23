import {
  SiFacebook, SiInstagram, SiTiktok, SiYoutube,
  SiX, SiMedium, SiReddit,
  SiSupabase, SiCloudflare, SiAnthropic, SiN8n,
} from '@icons-pack/react-simple-icons'
import type { ComponentType, SVGAttributes } from 'react'

interface IconProps extends SVGAttributes<SVGSVGElement> {
  size?: number
  color?: string
  className?: string
}

export const PLATFORM_ICONS: Record<string, ComponentType<IconProps>> = {
  // LinkedIn not available in @icons-pack/react-simple-icons -- use Lucide Linkedin fallback
  facebook: SiFacebook,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  x: SiX,
  twitter: SiX,
  medium: SiMedium,
  reddit: SiReddit,
  // Amazon not available in @icons-pack/react-simple-icons -- use Lucide ExternalLink fallback
}
// Note: LinkedIn, Amazon, Beehiiv, Gumroad, Goodreads are not in this package.
// For missing icons, the consuming component should fall back to Lucide icons.

export const INTEGRATION_ICONS: Record<string, ComponentType<IconProps>> = {
  supabase: SiSupabase,
  cloudflare: SiCloudflare,
  // Slack not available in @icons-pack/react-simple-icons -- use Lucide MessageSquare fallback
  anthropic: SiAnthropic,
  claude: SiAnthropic,
  n8n: SiN8n,
}
