import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WaveformViewerProps {
    patientId?: string;
}

export function WaveformViewer({ patientId = 'demo' }: WaveformViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let offset = 0;
        const speed = 2; // px per frame

        // 12 Leads Layout: 4 rows x 3 cols
        const leads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
        const rows = 4;
        const cols = 3;

        const render = () => {
            if (!canvas) return;
            const width = canvas.width = canvas.clientWidth * window.devicePixelRatio;
            const height = canvas.height = canvas.clientHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

            // Clear
            ctx.fillStyle = '#121620'; // Match card bg or transparent
            ctx.clearRect(0, 0, width, height);

            // Calculate grid
            const clientW = canvas.clientWidth;
            const clientH = canvas.clientHeight;
            const cellW = clientW / cols;
            const cellH = clientH / rows;

            // Draw Grid
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.5;

            // Vertical lines
            for (let i = 1; i < cols; i++) {
                ctx.beginPath();
                ctx.moveTo(i * cellW, 0);
                ctx.lineTo(i * cellW, clientH);
                ctx.stroke();
            }
            // Horizontal lines
            for (let i = 1; i < rows; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * cellH);
                ctx.lineTo(clientW, i * cellH);
                ctx.stroke();
            }

            // Draw Signals
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#6ee7b7'; // Emerald-300
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            offset += isPlaying ? speed : 0;

            leads.forEach((lead, index) => {
                const r = Math.floor(index / cols);
                const c = index % cols;
                const xBase = c * cellW;
                const yBase = r * cellH + (cellH / 2); // Center of cell

                ctx.save();
                ctx.beginPath();
                ctx.rect(xBase, r * cellH, cellW, cellH);
                ctx.clip(); // Clip to cell

                ctx.beginPath();

                // Draw simulated ECG
                for (let x = 0; x < cellW; x += 2) {
                    const t = (x + offset + (index * 100)) % 500; // Time variable
                    let y = 0;

                    // Simulate complex
                    // P wave
                    if (t > 50 && t < 100) y -= Math.sin((t - 50) / 50 * Math.PI) * 5;
                    // QRS
                    if (t > 120 && t < 130) y += 5;
                    if (t > 130 && t < 140) y -= 30; // R
                    if (t > 140 && t < 150) y += 8;
                    // T wave
                    if (t > 200 && t < 300) y -= Math.sin((t - 200) / 100 * Math.PI) * 8;

                    // Random noise
                    y += (Math.random() - 0.5) * 2;

                    if (x === 0) ctx.moveTo(xBase + x, yBase + y);
                    else ctx.lineTo(xBase + x, yBase + y);
                }
                ctx.stroke();
                ctx.restore();

                // Draw Label
                ctx.font = '10px monospace';
                ctx.fillStyle = '#10b981';
                ctx.fillText(lead, xBase + 8, r * cellH + 16);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying]);

    return (
        <Card className="border border-white/5 bg-[#121620]/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5 space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-400" />
                        12-Lead Real-time Telemetry
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-emerald-500/50">
                        Signal Quality: 98% | 500Hz | ID: {patientId}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/10 font-mono text-[10px]">
                        LIVE
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[500px]">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ width: '100%', height: '100%' }}
                />
            </CardContent>
        </Card>
    );
}
