import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useCardimaStore } from "@/store/useCardimaStore"
import { AlertTriangle, PhoneCall } from "lucide-react"

export function EmergencyMonitor() {
    const { predictions } = useCardimaStore()

    // Critical threshold logic
    const isCritical = predictions.MI > 90 || predictions.CD > 90

    // Determine the specific danger
    const dangerType = predictions.MI > 90 ? "Acute Myocardial Infarction Detected" :
        predictions.CD > 90 ? "Critical Conduction Disturbance" : "Unknown Critical State"

    return (
        <AlertDialog open={isCritical}>
            <AlertDialogContent className="border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/10">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-bold text-destructive">CRITICAL ALERT</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-foreground font-medium text-lg">
                        High-confidence prediction: {dangerType}
                    </AlertDialogDescription>
                    <AlertDialogDescription>
                        Immediate clinical intervention recommended. The AI model has detected output probabilities exceeding 90% for a life-threatening condition.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                        Dismiss Verification
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90 gap-2">
                        <PhoneCall className="h-4 w-4" />
                        Contact Emergency Response
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
