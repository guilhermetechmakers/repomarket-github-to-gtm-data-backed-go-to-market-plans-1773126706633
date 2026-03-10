import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import { cn } from '@/lib/utils'

const footerLinks = {
  Product: [
    { to: '/pricing', label: 'Pricing' },
    { to: '/help', label: 'Help' },
    { to: '/demo', label: 'Demo Report' },
  ],
  Legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/cookies', label: 'Cookie Policy' },
  ],
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        'border-t border-border bg-card mt-auto',
        className
      )}
    >
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
              <Github className="h-5 w-5 text-accent" />
              RepoMarket
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              GitHub to evidence-backed GTM strategy.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RepoMarket. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
