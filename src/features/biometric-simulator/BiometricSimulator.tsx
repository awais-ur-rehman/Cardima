import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCardimaStore } from "@/store/useCardimaStore"
import { Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { toast } from "sonner"

export function BiometricSimulator({ patientId }: { patientId?: string }) {
    const { simulation, setSimulation, resetSimulation, setPredictions } = useCardimaStore()
    const [isCalculating, setIsCalculating] = useState(false)

    const debouncedAge = useDebounce(simulation.simulatedAge, 500)
    const debouncedWeight = useDebounce(simulation.simulatedWeight, 500)

    const handleToggle = (checked: boolean) => {
        setSimulation({ isSimulating: checked })
        if (!checked) resetSimulation()
    }

    // Real Inference Effect
    useEffect(() => {
        if (!simulation.isSimulating || !patientId) return

        const runInference = async () => {
            setIsCalculating(true)
            try {
                const response = await api.post('/inference/simulate', {
                    patient_id: patientId,
                    weight: debouncedWeight,
                    age: debouncedAge
                })

                const { probabilities } = response.data
                const scaledPredictions = {
                    MI: (probabilities.MI || 0) * 100,
                    STTC: (probabilities.STTC || 0) * 100,
                    CD: (probabilities.CD || 0) * 100,
                    HYP: (probabilities.HYP || 0) * 100,
                    NORM: (probabilities.NORM || 0) * 100,
                }

                setPredictions(scaledPredictions)
                toast.info("Risk Profile Updated", { duration: 1000, position: 'bottom-right' })
            } catch (error) {
                console.error("Simulation failed", error)
                toast.error("Failed to run simulation")
            } finally {
                setIsCalculating(false)
            }
        }

        runInference()

    }, [debouncedAge, debouncedWeight, simulation.isSimulating, patientId, setPredictions])

    return (
        <Card className="shadow-sm border border-border bg-card text-card-foreground h-full flex flex-col">
            <CardHeader className="shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-heading text-foreground">Biometric Shift</CardTitle>
                        <CardDescription className="text-primary/80">Simulate physiological changes</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        {simulation.isSimulating && (
                            <button
                                onClick={resetSimulation}
                                className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-colors"
                            >
                                Reset
                            </button>
                        )}
                        <div className="flex items-center space-x-2">
                            {isCalculating && <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />}
                            <Switch
                                id="simulation-mode"
                                checked={simulation.isSimulating}
                                onCheckedChange={handleToggle}
                                className="data-[state=checked]:bg-primary"
                            />
                            <Label htmlFor="simulation-mode" className="text-[10px] font-bold text-muted-foreground uppercase">
                                {simulation.isSimulating ? 'Active' : 'Off'}
                            </Label>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 py-4 flex-1">
                {/* Weight Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weight Adjustment</Label>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-bold text-primary">
                                {simulation.simulatedWeight}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70 font-bold uppercase">kg</span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Slider
                            disabled={!simulation.isSimulating}
                            value={[simulation.simulatedWeight]}
                            min={40}
                            max={150}
                            step={1}
                            onValueChange={(vals) => setSimulation({ simulatedWeight: vals[0] })}
                            className="[&_.range-thumb]:h-5 [&_.range-thumb]:w-5 [&_.range-thumb]:bg-background [&_.range-thumb]:border-[2px] [&_.range-thumb]:border-primary [&_.range-track]:bg-secondary [&_.range-range]:bg-primary h-2"
                        />
                    </div>
                </div>

                {/* Age Slider */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Age Projection</Label>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-bold text-primary">
                                {simulation.simulatedAge}
                            </span>
                            <span className="text-[10px] text-muted-foreground/70 font-bold uppercase">yrs</span>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Slider
                            disabled={!simulation.isSimulating}
                            value={[simulation.simulatedAge]}
                            min={18}
                            max={100}
                            step={1}
                            onValueChange={(vals) => setSimulation({ simulatedAge: vals[0] })}
                            className="[&_.range-thumb]:h-5 [&_.range-thumb]:w-5 [&_.range-thumb]:bg-background [&_.range-thumb]:border-[2px] [&_.range-thumb]:border-primary [&_.range-track]:bg-secondary [&_.range-range]:bg-primary h-2"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
