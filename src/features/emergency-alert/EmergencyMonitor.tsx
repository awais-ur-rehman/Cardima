import { AlertTriangle, PhoneCall } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useCardimaStore } from "@/store/useCardimaStore"

export function EmergencyMonitor() {
    const { predictions } = useCardimaStore()

    // Critical threshold logic
    const isCritical = (predictions.MI || 0) > 90 || (predictions.CD || 0) > 90

    if (!isCritical) return null

    // Determine the specific danger
    const dangerType = (predictions.MI || 0) > 90 ? "Acute Myocardial Infarction Detected" :
        (predictions.CD || 0) > 90 ? "Critical Conduction Disturbance" : "Unknown Critical State"

    return (
        <Alert variant="destructive" className="mb-6 border-rose-500/50 bg-rose-500/10 text-rose-200 animate-in fade-in slide-in-from-top-4 duration-500 shadow-lg shadow-rose-500/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 animate-pulse mt-1">
                        <AlertTriangle className="h-6 w-6 text-rose-500" />
                    </div>
                    <div className="space-y-1">
                        <AlertTitle className="text-xl font-bold text-rose-500 flex items-center gap-2">
                            CRITICAL CLINICAL ALERT
                        </AlertTitle>
                        <AlertDescription className="text-rose-100 font-medium text-base">
                            High-confidence prediction: {dangerType}
                        </AlertDescription>
                        <AlertDescription className="text-rose-200/60 text-sm">
                            Immediate clinical intervention recommended. Probabilities exceed 90% for a life-threatening condition.
                        </AlertDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-500 text-white gap-2 h-10 px-6 font-bold shadow-lg shadow-rose-500/20 border-none transition-all active:scale-95">
                        <PhoneCall className="h-4 w-4" />
                        EMERGENCY RESPONSE
                    </Button>
                </div>
            </div>
        </Alert>
    )
}
