import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  Layers,
  Share2,
  Activity,
  Settings,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, route: '/' },
  { label: 'Projects', icon: FolderKanban, route: '/projects' },
  { label: 'Brain Dump', icon: Brain, route: '/brain-dump' },
  { label: 'Content Pipeline', icon: Layers, route: '/pipeline' },
  { label: 'Social Media', icon: Share2, route: '/social' },
  { label: 'Activity Log', icon: Activity, route: '/activity' },
  { label: 'Settings', icon: Settings, route: '/settings' },
] as const

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()

  return (
    <>
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid hsl(var(--border-subtle))',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'hsl(var(--accent-coral))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span className="text-body" style={{ color: 'white', fontWeight: 700 }}>F</span>
          </div>
          <div>
            <div className="text-body" style={{ fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
              Forge Console
            </div>
            <div className="text-[11px]" style={{ color: 'hsl(var(--text-tertiary))', marginTop: 1 }}>
              IAC Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.route === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.route)

            return (
              <li key={item.route}>
                <NavLink
                  to={item.route}
                  style={{ textDecoration: 'none', display: 'block' }}
                  onClick={onNavigate}
                >
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'group flex items-center gap-2.5 py-2 px-2.5 rounded-lg cursor-pointer relative transition-colors duration-150',
                      isActive
                        ? 'bg-[hsl(var(--bg-elevated))]'
                        : 'hover:bg-[hsl(var(--bg-elevated))]'
                    )}
                    style={{
                      borderLeft: '2px solid',
                      borderLeftColor: isActive
                        ? 'hsl(var(--accent-coral))'
                        : 'transparent',
                      paddingLeft: 8,
                    }}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        'flex-shrink-0',
                        isActive
                          ? 'text-[hsl(var(--accent-coral))]'
                          : 'text-[hsl(var(--text-tertiary))] group-hover:text-[hsl(var(--text-secondary))]'
                      )}
                    />
                    <span
                      className={cn(
                        'text-body-sm whitespace-nowrap',
                        isActive
                          ? 'text-[hsl(var(--text-primary))] font-semibold'
                          : 'text-[hsl(var(--text-secondary))] font-normal group-hover:text-[hsl(var(--text-primary))]'
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid hsl(var(--border-subtle))',
          flexShrink: 0,
        }}
      >
        <div className="text-caption text-[hsl(var(--text-tertiary))]">
          v2.0.0 &middot; March 2026
        </div>
      </div>
    </>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="sidebar-desktop"
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          backgroundColor: 'hsl(var(--bg-sidebar))',
          borderRight: '1px solid hsl(var(--border-subtle))',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 10,
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile hamburger button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        style={{
          display: 'none',
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 20,
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: 'hsl(var(--bg-surface))',
          border: '1px solid hsl(var(--border-default))',
          boxShadow: 'var(--shadow-card)',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Menu size={18} style={{ color: 'hsl(var(--text-primary))' }} />
      </button>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] p-0 bg-[hsl(var(--bg-sidebar))]" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
