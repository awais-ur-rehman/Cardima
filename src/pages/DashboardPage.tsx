import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { DiagnosticProfile } from '@/features/diagnostic-profile/DiagnosticProfile'
import { BiometricSimulator } from '@/features/biometric-simulator/BiometricSimulator'
// import { WaveformViewer } from '@/features/waveform-viewer/WaveformViewer'
import { useCardimaStore } from '@/store/useCardimaStore'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Activity, Search, CheckCircle2 } from 'lucide-react'
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
            // Scale probabilities from 0-1 to 0-100 for UI
            const scaledPredictions = {
                MI: (patient.diagnostic_probabilities.MI || 0) * 100,
                STTC: (patient.diagnostic_probabilities.STTC || 0) * 100,
                CD: (patient.diagnostic_probabilities.CD || 0) * 100,
                HYP: (patient.diagnostic_probabilities.HYP || 0) * 100,
                NORM: (patient.diagnostic_probabilities.NORM || 0) * 100,
            }
            setPredictions(scaledPredictions)
        }
    }, [patient, setPatientData, setPredictions, resetSimulation])

    if (!id || !patient) {
        return (
            <MainLayout>
                <div className="h-full flex flex-col items-center justify-center space-y-4 min-h-[60vh] text-center">
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">No Patient Selected</h2>
                    <p className="text-muted-foreground max-w-sm">
                        Select a patient from the registry to view clinical analytics and real-time telemetry.
                    </p>
                    <Button
                        onClick={() => navigate('/patients')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
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
            <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
                {/* Patient Context Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-border pb-6 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">{patient.name || 'Unknown Patient'}</h1>
                            <Badge variant="outline" className="font-mono bg-background text-muted-foreground">{(patient._id || '').slice(0, 8)}</Badge>
                            <Badge className={patient.predicted_risk_level?.toUpperCase() === 'HIGH' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}>
                                {(patient.predicted_risk_level?.toUpperCase() === 'HIGH' ? 'CRITICAL' :
                                    patient.predicted_risk_level?.toUpperCase() === 'MEDIUM' ? 'MONITORING' :
                                        'STABLE')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4 text-primary" />
                                <span className="font-medium text-foreground">{patient.demographics?.age || '--'}</span> yrs / <span className="font-medium text-foreground">{patient.demographics?.sex || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-primary" />
                                Last Exam: <span className="font-medium text-foreground">{patient.last_ecg_date ? new Date(patient.last_ecg_date).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {/* <div className="flex items-center gap-1.5">
                                <Activity className="h-4 w-4 text-primary" />
                                Risk: {patient.predicted_risk_level || 'Unknown'}
                            </div> */}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    {/* Top Row: Diagnostics and Biometrics */}
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12 shrink-0">
                        <div className="lg:col-span-6">
                            <DiagnosticProfile patient={patient} />
                        </div>
                        <div className="lg:col-span-6">
                            <BiometricSimulator patientId={patient._id} />
                        </div>
                    </div>

                    {/* Bottom Row: AI Analysis (Replaces Waveform) */}
                    <div className="flex-1 min-h-0 grid gap-6 grid-cols-1 lg:grid-cols-2 pb-6">
                        {/* Narrative Report */}
                        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 overflow-y-auto shadow-sm">
                            <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                AI Narrative Analysis
                            </h3>
                            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                                {patient.ai_analysis?.narrative_report ? (
                                    <p>{patient.ai_analysis.narrative_report}</p>
                                ) : (
                                    <p className="italic text-muted-foreground/50">No narrative report generated for this patient.</p>
                                )}
                            </div>
                        </div>

                        {/* Recommended Tests */}
                        <div className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                                Recommended Clinical Actions
                            </h3>
                            {patient.ai_analysis?.recommended_tests && patient.ai_analysis.recommended_tests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.ai_analysis.recommended_tests.map((test, i) => (
                                        <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1.5 text-sm font-medium">
                                            {test}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground/50 italic text-sm">No additional specific tests recommended at this time.</p>
                            )}

                            {/* <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-3">Previous ECG Waveforms</p>
                                <div className="opacity-50 pointer-events-none grayscale">
                                     <WaveformViewer patientId={patient._id} />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
