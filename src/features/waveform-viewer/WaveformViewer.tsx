import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react"

export function WaveformViewer() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [zoom, setZoom] = useState(1)

    // Simulated 12-lead Data Generation (placeholder for real data)
    // In a real app, this would come from the ONNX model input or file upload
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#f8f9fa' // Paper background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw Grid (ECG Paper)
        const drawGrid = (step: number, color: string, lineWidth: number) => {
            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
            for (let x = 0; x < canvas.width; x += step * zoom) {
                ctx.moveTo(x, 0)
                ctx.lineTo(x, canvas.height)
            }
            for (let y = 0; y < canvas.height; y += step * zoom) {
                ctx.moveTo(0, y)
                ctx.lineTo(canvas.width, y)
            }
            ctx.stroke()
        }

        // Small boxes (1mm) - 5px at standard zoom
        drawGrid(10, '#e9ecef', 0.5)
        // Big boxes (5mm) - 25px at standard zoom
        drawGrid(50, '#dee2e6', 1)

        // Draw Dummy Signals for 12 Leads
        const leads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
        const leadHeight = canvas.height / 4
        const leadWidth = canvas.width / 3

        ctx.strokeStyle = '#212529'
        ctx.lineWidth = 1.5
        ctx.lineJoin = 'round'

        leads.forEach((lead, i) => {
            const col = Math.floor(i / 4)
            const row = i % 4

            const startX = col * leadWidth
            const startY = row * leadHeight + (leadHeight / 2) // Center of the lead row

            // Label
            ctx.fillStyle = '#000'
            ctx.font = '12px sans-serif'
            ctx.fillText(lead, startX + 10, row * leadHeight + 20)

            // Plot Signal
            ctx.beginPath()
            for (let x = 0; x < leadWidth; x += 2) {
                // Simulate QRS complex and noise
                const noise = (Math.random() - 0.5) * 5
                const beat = Math.sin(x * 0.05) * 20 * (Math.random() > 0.95 ? 3 : 0) // Random QRS-ish spike
                const wave = Math.sin(x * 0.02) * 10 + beat + noise

                const plotX = startX + x
                const plotY = startY - wave

                if (x === 0) ctx.moveTo(plotX, plotY)
                else ctx.lineTo(plotX, plotY)
            }
            ctx.stroke()
        })

    }, [zoom])

    return (
        <Card className="col-span-full shadow-md border-blue-900/20">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>12-Lead Waveform</CardTitle>
                        <CardDescription>Real-time ECG visualization (500Hz)</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-lg border border-border bg-white relative h-[400px]">
                    <canvas
                        ref={canvasRef}
                        width={1200}
                        height={400}
                        className="w-full h-full object-contain cursor-crosshair"
                    />
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>Speed: 25mm/s</span>
                    <span>Gain: 10mm/mV</span>
                    <span>Filter: 0.05-150Hz</span>
                </div>
            </CardContent>
        </Card>
    )
}
