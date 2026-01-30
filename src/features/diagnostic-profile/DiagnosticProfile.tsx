import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useCardimaStore } from "@/store/useCardimaStore"
import { cn } from "@/lib/utils"
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react"

export function DiagnosticProfile() {
    const { predictions } = useCardimaStore()

    const items = [
        { key: 'MI', label: 'Myocardial Infarction', color: 'text-rose-300', barColor: 'bg-rose-400', glow: '' },
        { key: 'STTC', label: 'ST/T Abnormality', color: 'text-amber-200', barColor: 'bg-amber-400', glow: '' },
        { key: 'CD', label: 'Conduction Disturbance', color: 'text-orange-200', barColor: 'bg-orange-300', glow: '' },
        { key: 'HYP', label: 'Hypertrophy', color: 'text-purple-300', barColor: 'bg-purple-400', glow: '' },
        { key: 'NORM', label: 'Normal Sinus Rhythm', color: 'text-emerald-300', barColor: 'bg-emerald-400', glow: '' },
    ] as const

    const isCritical = predictions.MI > 90 || predictions.CD > 90

    return (
        <Card className="shadow-lg border-white/5 bg-[#121620]/80 backdrop-blur-md relative overflow-hidden">
            {/* Top gradient line */}
            <div className={cn("absolute top-0 left-0 right-0 h-1", isCritical ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]" : "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]")} />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-heading tracking-wide text-white/90 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-400" />
                            DIAGNOSTIC ANALYSIS
                        </CardTitle>
                    </div>
                    {isCritical ? (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3" />
                            CRITICAL DETECTED
                        </div>
                    ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3" />
                            STABLE
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex justify-between items-end h-[200px] gap-2">
                    {items.map((item) => {
                        const value = predictions[item.key]
                        return (
                            <div key={item.key} className="flex flex-col items-center gap-3 w-1/5 group">
                                <span className={cn("font-mono text-xs  px-1.5 py-0.5 rounded mb-auto", value > 50 ? "bg-white/10 text-white" : "text-white/30")}>
                                    {(value).toFixed(0)}%
                                </span>

                                <div className="h-[120px] w-full max-w-[24px] bg-black/40 rounded-full relative overflow-hidden border border-white/5 flex items-end">
                                    <div
                                        className={cn("w-full rounded-full transition-all duration-1000 ease-out", item.barColor, value > 10 && item.glow, value > 80 && "animate-pulse")}
                                        style={{ height: `${value}%` }}
                                    />
                                </div>

                                <span className={cn("text-[10px] text-center font-medium leading-tight h-8 flex items-center justify-center transition-colors duration-300", value > 50 ? "text-white" : "text-white/50")}>
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
