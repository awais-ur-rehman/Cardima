import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCardimaStore } from '@/store/useCardimaStore'
import { toast } from 'sonner'

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useCardimaStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
        toast.info("Logged out successfully")
    }

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'MD'

    return (
        <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-emerald-500/30">

            {/* Sidebar - No Border, Emerald Text Logo */}
            <aside className="w-64 bg-[#022b22] flex flex-col shrink-0 z-20 relative">
                <div className="p-6">
                    <div className="flex items-center gap-2">
                        {/* Just Text as requested */}
                        <h1 className="text-xl font-heading font-bold tracking-tight text-emerald-500">Cardima AI</h1>
                        <span className="text-[10px] text-emerald-500/40 uppercase tracking-widest font-semibold mt-1">PRO</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <NavItem to="/patients" icon={Users} label="Patient Registry" />
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Clinical Dashboard" />

                    <div className="pt-6 mt-6 mx-2 border-t border-white/5">
                        <div className="px-2 text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">System</div>
                        <NavItem to="/settings" icon={Settings} label="Configuration" />
                    </div>
                </nav>

                <div className="p-4 mx-3 mb-3 mt-auto">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500">
                            {initials}
                        </div>
                        <div className="text-sm overflow-hidden min-w-0">
                            <p className="font-medium truncate text-white/80">{user?.name || "Dr. Guest"}</p>
                            <p className="text-xs text-white/30 truncate">Cardiology Lead</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-xs text-white/40 hover:text-rose-400 transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                        <LogOut className="h-3 w-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-[#050505]">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 overflow-y-auto p-6 scroll-smooth"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    )
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                // Active State: Black BG, White Text, Green Icon
                isActive
                    ? "bg-black text-white shadow-lg shadow-emerald-900/10"
                    : "text-white/40 hover:text-white hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-emerald-500" : "text-white/40 group-hover:text-white")} />
                    <span>{label}</span>
                </>
            )}
        </NavLink>
    )
}
