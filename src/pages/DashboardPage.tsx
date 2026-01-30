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
            <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
                {/* Patient Context Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-4 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold tracking-tight text-white">{patient.name || 'Unknown Patient'}</h1>
                            <Badge variant="outline" className="font-mono border-white/10 text-white/50">{(patient._id || '').slice(0, 8)}</Badge>
                            <Badge className={patient.predicted_risk_level?.toUpperCase() === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border-rose-500/20' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'}>
                                {(patient.predicted_risk_level?.toUpperCase() === 'HIGH' ? 'CRITICAL' :
                                    patient.predicted_risk_level?.toUpperCase() === 'MEDIUM' ? 'MONITORING' :
                                        'STABLE')}
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
                    <div className="flex-1 min-h-0 grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {/* Narrative Report */}
                        <div className="bg-[#121620]/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 overflow-y-auto">
                            <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-emerald-400" />
                                AI Narrative Analysis
                            </h3>
                            <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed">
                                {patient.ai_analysis?.narrative_report ? (
                                    <p>{patient.ai_analysis.narrative_report}</p>
                                ) : (
                                    <p className="italic text-white/30">No narrative report generated for this patient.</p>
                                )}
                            </div>
                        </div>

                        {/* Recommended Tests */}
                        <div className="bg-[#121620]/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
                            <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                                Recommended Clinical Actions
                            </h3>
                            {patient.ai_analysis?.recommended_tests && patient.ai_analysis.recommended_tests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {patient.ai_analysis.recommended_tests.map((test, i) => (
                                        <Badge key={i} variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 px-3 py-1.5 text-sm font-medium">
                                            {test}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/30 italic text-sm">No additional specific tests recommended at this time.</p>
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
