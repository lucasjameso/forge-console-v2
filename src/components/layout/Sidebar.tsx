import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  Layers,
  Share2,
  Activity,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>F</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
              Forge Console
            </div>
            <div style={{ fontSize: 11, color: 'hsl(var(--text-tertiary))', marginTop: 1 }}>
              IAC Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    className={cn('sidebar-nav-item')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      position: 'relative',
                      backgroundColor: isActive ? 'hsl(var(--bg-elevated))' : 'transparent',
                      borderLeft: isActive
                        ? '2px solid hsl(var(--accent-coral))'
                        : '2px solid transparent',
                      paddingLeft: isActive ? 8 : 10,
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: isActive ? 'hsl(var(--accent-coral))' : 'hsl(var(--text-tertiary))',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
                        whiteSpace: 'nowrap',
                      }}
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
        <div style={{ fontSize: 11, color: 'hsl(var(--text-tertiary))' }}>
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
          backgroundColor: 'hsl(var(--bg-surface))',
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

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                width: 260,
                backgroundColor: 'hsl(var(--bg-surface))',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-elevated)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={18} style={{ color: 'hsl(var(--text-tertiary))' }} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
