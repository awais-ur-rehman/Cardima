import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
    const error = useRouteError()
    const navigate = useNavigate()
    let errorMessage: string

    if (isRouteErrorResponse(error)) {
        errorMessage = error.statusText || error.data?.message || 'Unknown Error'
    } else if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === 'string') {
        errorMessage = error
    } else {
        errorMessage = 'An unexpected error occurred'
    }

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full border-2 border-rose-500/50 bg-[#050505]">
                        <AlertCircle className="h-10 w-10 text-rose-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
                        Critical Error
                    </h1>
                    <p className="text-white/60 text-sm">
                        The application encountered an unexpected state and cannot continue.
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/20 text-left">
                    <p className="font-mono text-xs text-rose-200/80 break-all">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-white/10 hover:bg-white/5 hover:text-white"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reload Application
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
