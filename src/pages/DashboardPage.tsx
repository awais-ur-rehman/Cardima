import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DiagnosticProfile } from '@/features/diagnostic-profile/DiagnosticProfile'
import { BiometricSimulator } from '@/features/biometric-simulator/BiometricSimulator'
import { WaveformViewer } from '@/features/waveform-viewer/WaveformViewer'
import { EmergencyMonitor } from '@/features/emergency-alert/EmergencyMonitor'
import { useCardimaStore } from '@/store/useCardimaStore'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Activity, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { patients, setPatientData, setPredictions, resetSimulation } = useCardimaStore()

    // Find patient from real store
    const patient = patients.find(p => p._id === id)

    // Sync Store with Patient Data on Load
    useEffect(() => {
        if (!patient) return

        if (patient.demographics) {
            setPatientData({
                age: patient.demographics.age,
                weight: patient.demographics.weight,
                height: patient.demographics.height,
                sex: patient.demographics.sex as 'M' | 'F'
            })
            resetSimulation()
        }
        if (patient.diagnostic_probabilities) {
            setPredictions(patient.diagnostic_probabilities)
        }
    }, [patient, setPatientData, setPredictions, resetSimulation])

    if (!id || !patient) {
        return (
            <MainLayout>
                <div className="h-full flex flex-col items-center justify-center space-y-4 min-h-[60vh] text-center">
                    <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-white/20" />
                    </div>
                    <h2 className="text-xl font-semibold text-white/80">No Patient Selected</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Select a patient from the registry to view clinical analytics and real-time telemetry.
                    </p>
                    <Button
                        onClick={() => navigate('/patients')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white mt-4"
                    >
                        <Search className="mr-2 h-4 w-4" />
                        Go to Registry
                    </Button>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <EmergencyMonitor />

            {/* Patient Context Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold tracking-tight text-white">{patient.name || 'Unknown Patient'}</h1>
                        <Badge variant="outline" className="font-mono border-white/10 text-white/50">{(patient._id || '').slice(0, 8)}</Badge>
                        <Badge className={patient.status === 'Critical' ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}>
                            {(patient.status || 'UNKNOWN').toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/40">
                        <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            {patient.demographics?.age || '--'} yrs / {patient.demographics?.sex || '-'}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            Last Exam: {patient.last_ecg_date ? new Date(patient.last_ecg_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Activity className="h-3.5 w-3.5" />
                            Risk: {patient.predicted_risk_level || 'Unknown'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 min-h-[600px]">
                {/* Left Column: Diagnostics (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <DiagnosticProfile />
                    <BiometricSimulator patientId={patient._id} />
                </div>

                {/* Right Column: Waveforms & Files (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <WaveformViewer />
                </div>
            </div>
        </MainLayout>
    )
}
