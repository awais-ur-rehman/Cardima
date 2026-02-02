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
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full border-2 border-destructive/20 bg-background">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">
                        Critical Error
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        The application encountered an unexpected state and cannot continue.
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10 text-left">
                    <p className="font-mono text-xs text-destructive break-all">
                        {errorMessage}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-input hover:bg-muted"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reload Application
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
