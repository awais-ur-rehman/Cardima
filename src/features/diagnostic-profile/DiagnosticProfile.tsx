import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useCardimaStore } from "@/store/useCardimaStore"
import { cn } from "@/lib/utils"

export function DiagnosticProfile() {
    const { predictions } = useCardimaStore()

    const items = [
        { key: 'mi', label: 'Myocardial Infarction', color: 'text-red-500', barColor: 'bg-red-500' },
        { key: 'sttc', label: 'ST/T Changes', color: 'text-orange-500', barColor: 'bg-orange-500' },
        { key: 'cd', label: 'Conduction Disturbance', color: 'text-yellow-500', barColor: 'bg-yellow-500' },
        { key: 'hyp', label: 'Hypertrophy', color: 'text-purple-500', barColor: 'bg-purple-500' },
        { key: 'norm', label: 'Normal', color: 'text-green-500', barColor: 'bg-green-500' },
    ] as const

    return (
        <Card className="col-span-full lg:col-span-2 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Diagnostic Profile</CardTitle>
                        <CardDescription>Multi-Pathology Probability Analysis</CardDescription>
                    </div>
                    {predictions.mi > 90 || predictions.cd > 90 ? (
                        <div className="bg-destructive/15 text-destructive text-xs font-bold px-3 py-1 rounded-full animate-pulse border border-destructive/20">
                            CRITICAL RISK DETECTED
                        </div>
                    ) : (
                        <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                            Stable Analysis
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {items.map((item) => {
                    const value = predictions[item.key]
                    return (
                        <div key={item.key} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className={cn("font-medium flex items-center gap-2", item.color)}>
                                    {item.label}
                                </span>
                                <span className="font-mono text-muted-foreground">{value.toFixed(1)}%</span>
                            </div>
                            <Progress value={value} className="h-2" indicatorClassName={item.barColor} />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
