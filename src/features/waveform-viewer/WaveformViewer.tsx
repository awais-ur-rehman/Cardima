import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

interface WaveformViewerProps {
    patientId?: string;
}

interface LeadData {
    [key: string]: number[];
}

interface SignalResponse {
    patientId: string;
    samplingRate: number;
    leads: LeadData;
}

export function WaveformViewer({ patientId = 'demo' }: WaveformViewerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [signalData, setSignalData] = useState<SignalResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!patientId || patientId === 'demo') return;

        const fetchSignal = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/patients/${patientId}/signal`);
                setSignalData(response.data);
            } catch (error) {
                console.error('Failed to fetch ECG signal:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSignal();
    }, [patientId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !signalData) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const leadsOrder = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
        const rows = leadsOrder.length;

        const pointWidth = 2;
        const leadValues = Object.values(signalData.leads);
        if (leadValues.length === 0) return;

        const maxPoints = Math.max(...leadValues.map(l => l.length));
        const totalWidth = Math.max(containerRef.current?.clientWidth || 0, maxPoints * pointWidth);
        const rowHeight = 100;
        const totalHeight = rows * rowHeight;

        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;
        ctx.scale(dpr, dpr);

        // Styling
        canvas.style.width = `${totalWidth}px`;
        canvas.style.height = `${totalHeight}px`;

        // Clear - Use explicit light bg for canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Draw Grid
        ctx.strokeStyle = '#E2E8F0'; // Divider Mist
        ctx.lineWidth = 0.5;

        // Horizontal grid lines
        for (let i = 0; i <= rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * rowHeight);
            ctx.lineTo(totalWidth, i * rowHeight);
            ctx.stroke();
        }

        // Draw Signals
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#0059b2'; // Clinical Blue
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        leadsOrder.forEach((leadKey, index) => {
            const data = signalData.leads[leadKey];
            if (!data) return;

            const yBase = index * rowHeight + (rowHeight / 2);
            ctx.beginPath();

            data.forEach((val, i) => {
                const x = i * pointWidth;
                const y = yBase - (val * 40); // Scaling factor for visibility
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Label
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillStyle = '#1E293B'; // Deep Charcoal
            ctx.fillText(leadKey, 12, index * rowHeight + 24);
        });

    }, [signalData]);

    return (
        <Card className="shadow-none border border-border bg-card text-card-foreground overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border space-y-0 shrink-0">
                <div className="space-y-1">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Clinical 12-Lead Telemetry
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-primary/60">
                        {isLoading ? 'Retrieving Signal...' : signalData ? `Sampling: ${signalData.samplingRate}Hz | Mode: High-Fidelity` : 'No Signal Data'}
                    </CardDescription>
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground bg-muted font-mono text-[10px]">
                    STATIC REVIEW
                </Badge>
            </CardHeader>
            <CardContent className="p-0 relative flex-1 overflow-x-auto overflow-y-auto" ref={containerRef}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-sm">
                        Loading high-fidelity signal data...
                    </div>
                ) : !signalData ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground/50 font-mono text-sm">
                        Select a clinical record to visualize telemetry
                    </div>
                ) : (
                    <canvas
                        ref={canvasRef}
                    />
                )}
            </CardContent>
        </Card>
    );
}
