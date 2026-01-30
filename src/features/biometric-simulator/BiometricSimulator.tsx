import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCardimaStore } from "@/store/useCardimaStore"
import { RotateCcw } from "lucide-react"

export function BiometricSimulator() {
    const { simulation, setSimulation, resetSimulation } = useCardimaStore()

    const handleToggle = (checked: boolean) => {
        setSimulation({ isSimulating: checked })
        if (!checked) resetSimulation()
    }

    return (
        <Card className="shadow-sm border-blue-900/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Biometric Shift</CardTitle>
                        <CardDescription>Simulate physiological changes</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="simulation-mode"
                            checked={simulation.isSimulating}
                            onCheckedChange={handleToggle}
                        />
                        <Label htmlFor="simulation-mode" className="text-xs font-semibold">
                            {simulation.isSimulating ? 'ACTIVE' : 'OFF'}
                        </Label>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Weight Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Weight Adjustment</Label>
                        <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">
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
                        className="[&_.range-thumb]:h-4 [&_.range-thumb]:w-4"
                    />
                </div>

                {/* Age Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">Age Projection</Label>
                        <span className="font-mono text-sm bg-secondary px-2 py-1 rounded">
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
                    />
                </div>

                {/* Reset Action */}
                {simulation.isSimulating && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 gap-2 text-muted-foreground hover:text-foreground"
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
