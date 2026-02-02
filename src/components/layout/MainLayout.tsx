import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Activity, FileText, History, Settings, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCardimaStore } from '@/store/useCardimaStore'
// toast removed

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const location = useLocation()
    const { user } = useCardimaStore()

    return (
        <div className="flex h-screen w-full bg-[#f4f7fa] text-foreground overflow-hidden font-sans">

            {/* Sidebar - Dark Blue Theme */}
            <aside className="w-[280px] bg-[#002B5C] flex flex-col shrink-0 z-20 relative shadow-xl">
                {/* Brand Header */}
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
                            <Activity className="h-5 w-5 text-[#002B5C]" />
                        </div>
                        <h1 className="text-xl font-heading font-bold tracking-tight text-white">Cardima <span className="text-blue-300 font-normal">V2</span></h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <NavItem to="/patients" icon={Users} label="Patient Registry" />
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Analysis Workspace" />
                    <NavItem to="/history" icon={History} label="Risk History" />
                    <NavItem to="/reports" icon={FileText} label="Reports" />
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mx-4 mb-6 mt-auto border-t border-white/10 pt-6">
                    <div className="space-y-1 mb-6">
                        <NavItem to="/support" icon={ChevronRight} label="Support" variant="ghost" />
                        <NavItem to="/settings" icon={Settings} label="Settings" variant="ghost" />
                    </div>

                    <div className="flex items-center gap-3 px-2 py-3 bg-[#0d3b6e] rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <img src="https://github.com/shadcn.png" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-white truncate">{user?.name || "Dr. Sarah Smith"}</p>
                            <p className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Cardiologist</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-[#f4f7fa]">
                {/* Global Header (Optional - usually part of the page, but can be here if global) */}
                {/* We'll leave the page-specific header to the page component as per screenshot structure */}

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 overflow-y-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}

function NavItem({ to, icon: Icon, label, variant = 'default' }: { to: string; icon: any; label: string, variant?: 'default' | 'ghost' }) {
    if (variant === 'ghost') {
        return (
            <NavLink
                to={to}
                className={
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 group rounded-lg text-blue-200 hover:text-white hover:translate-x-1"
                }
            >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </NavLink>
        )
    }

    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                // Active State: Primary Blue with glow
                isActive
                    ? "bg-[#0059b2] text-white shadow-lg shadow-blue-900/20"
                    : "text-blue-100/70 hover:text-white hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white" : "text-blue-300/70 group-hover:text-white")} />
                    <span className="tracking-wide">{label}</span>
                </>
            )}
        </NavLink>
    )
}
