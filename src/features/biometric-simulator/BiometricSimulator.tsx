import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCardimaStore } from "@/store/useCardimaStore"
import { RotateCcw, Loader2 } from "lucide-react"
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

                setPredictions(response.data.probabilities)
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
        <Card className="shadow-sm border border-white/5 bg-[#121620]/50 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-heading text-white">Biometric Shift</CardTitle>
                        <CardDescription className="text-emerald-500/60">Simulate physiological changes</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isCalculating && <Loader2 className="h-4 w-4 text-emerald-500 animate-spin mr-2" />}
                        <Switch
                            id="simulation-mode"
                            checked={simulation.isSimulating}
                            onCheckedChange={handleToggle}
                            className="data-[state=checked]:bg-emerald-600"
                        />
                        <Label htmlFor="simulation-mode" className="text-xs font-semibold text-white/50">
                            {simulation.isSimulating ? 'ACTIVE' : 'OFF'}
                        </Label>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Weight Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-white/80">Weight Adjustment</Label>
                        <span className="font-mono text-sm bg-white/5 text-emerald-400 px-2 py-1 rounded border border-white/5">
                            {simulation.simulatedWeight} kg
                        </span>
                    </div>
                    <Slider
                        disabled={!simulation.isSimulating}
                        value={[simulation.simulatedWeight]}
                        min={40}
                        max={150}
                        step={1}
                        onValueChange={(vals) => setSimulation({ simulatedWeight: vals[0] })}
                        className="[&_.range-thumb]:h-4 [&_.range-thumb]:w-4 [&_.range-track]:bg-white/10 [&_.range-range]:bg-emerald-500"
                    />
                </div>

                {/* Age Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-white/80">Age Projection</Label>
                        <span className="font-mono text-sm bg-white/5 text-emerald-400 px-2 py-1 rounded border border-white/5">
                            {simulation.simulatedAge} yrs
                        </span>
                    </div>
                    <Slider
                        disabled={!simulation.isSimulating}
                        value={[simulation.simulatedAge]}
                        min={18}
                        max={100}
                        step={1}
                        onValueChange={(vals) => setSimulation({ simulatedAge: vals[0] })}
                        className="[&_.range-thumb]:h-4 [&_.range-thumb]:w-4 [&_.range-track]:bg-white/10 [&_.range-range]:bg-emerald-500"
                    />
                </div>

                {/* Reset Action */}
                {simulation.isSimulating && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4 gap-2 text-white/40 hover:text-white hover:bg-white/5"
                        onClick={resetSimulation}
                    >
                        <RotateCcw className="h-3 w-3" />
                        Reset Baseline
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
