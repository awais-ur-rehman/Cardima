import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useCardimaStore, type Patient } from "@/store/useCardimaStore"
import { cn } from "@/lib/utils"
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react"

export function DiagnosticProfile({ patient }: { patient?: Patient }) {
    const { predictions } = useCardimaStore()

    const items = [
        { key: 'MI', label: 'MI', fullLabel: 'Myocardial Infarction', color: 'text-rose-600', barColor: 'bg-rose-500' },
        { key: 'STTC', label: 'ST/T', fullLabel: 'ST/T Abnormality', color: 'text-amber-600', barColor: 'bg-amber-500' },
        { key: 'CD', label: 'CD', fullLabel: 'Conduction Disturbance', color: 'text-orange-600', barColor: 'bg-orange-500' },
        { key: 'HYP', label: 'HYP', fullLabel: 'Hypertrophy', color: 'text-purple-600', barColor: 'bg-purple-500' },
        { key: 'NORM', label: 'NORM', fullLabel: 'Normal Sinus Rhythm', color: 'text-emerald-600', barColor: 'bg-emerald-500' },
    ] as const

    const isCritical = predictions.MI > 90 || predictions.CD > 90

    return (
        <Card className="shadow-sm border-border bg-card text-card-foreground relative overflow-hidden h-full">
            <CardHeader className="pb-4 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-heading tracking-wide text-foreground flex items-center gap-2">
                            <Activity className="h-4 w-4 text-primary" />
                            DIAGNOSTIC ANALYSIS
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {patient?.verdict && (
                            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase">
                                Verdict: {patient.verdict}
                            </div>
                        )}
                        {isCritical ? (
                            <div className="bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                <AlertTriangle className="h-3 w-3" />
                                CRITICAL DETECTED
                            </div>
                        ) : (
                            <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3" />
                                STABLE
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex justify-between items-end h-[200px] gap-2">
                    {items.map((item) => {
                        const value = predictions[item.key]
                        return (
                            <div key={item.key} className="flex flex-col items-center gap-3 w-1/5 group">
                                <span className={cn("font-mono text-xs  px-1.5 py-0.5 rounded mb-auto", value > 50 ? "bg-muted text-foreground font-bold" : "text-muted-foreground")}>
                                    {(value).toFixed(0)}%
                                </span>

                                <div className="h-[120px] w-full max-w-[24px] bg-secondary rounded-full relative overflow-hidden border border-border flex items-end">
                                    <div
                                        className={cn("w-full rounded-full transition-all duration-500", item.barColor)}
                                        style={{ height: `${value}%` }}
                                    />
                                </div>

                                <span className={cn("text-[10px] text-center font-bold tracking-tighter uppercase h-4 flex items-center justify-center", value > 50 ? "text-foreground" : "text-muted-foreground")}>
                                    {item.label}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
