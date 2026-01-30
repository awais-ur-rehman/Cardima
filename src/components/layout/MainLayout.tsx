import type { ReactNode } from 'react'

interface MainLayoutProps {
    children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
            {/* Sidebar Placeholder */}
            <aside className="w-64 border-r border-border bg-card/50 hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Cardima AI</h1>
                    <p className="text-xs text-muted-foreground mt-1">Clinical Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <div className="px-2 py-1.5 text-sm font-medium rounded-md bg-secondary/50 text-secondary-foreground">
                        Dashboard
                    </div>
                    <div className="px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/20 hover:text-foreground cursor-pointer transition-colors">
                        Patients
                    </div>
                    <div className="px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/20 hover:text-foreground cursor-pointer transition-colors">
                        Analysis
                    </div>
                    <div className="px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary/20 hover:text-foreground cursor-pointer transition-colors">
                        Settings
                    </div>
                </nav>
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            DR
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Dr. J. Doe</p>
                            <p className="text-xs text-muted-foreground">Cardiology</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm z-10">
                    <h2 className="text-lg font-semibold">Patient Analysis: Case #4829</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">v2.1.0-beta</span>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
