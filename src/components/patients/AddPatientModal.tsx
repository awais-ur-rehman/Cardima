import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCardimaStore } from '@/store/useCardimaStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

const patientSchema = z.object({
    name: z.string().min(2, "Name is required"),
    age: z.number().min(0).max(120),
    sex: z.enum(['Male', 'Female']),
    height: z.number().min(0).max(300),
    weight: z.number().min(0).max(500),
})

type PatientFormValues = z.infer<typeof patientSchema>

export function AddPatientModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [checklist, setChecklist] = useState<{ question: string; is_relevant: boolean }[]>([])
    const [checklistAnswers, setChecklistAnswers] = useState<Record<number, string>>({})
    const [currentPatientId, setCurrentPatientId] = useState<string | null>(null)

    // Workflow state
    const [step, setStep] = useState<'form' | 'processing' | 'checklist' | 'success'>('form')
    const [progress, setProgress] = useState(0)
    const [processingStage, setProcessingStage] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const addPatient = useCardimaStore(state => state.addPatient)

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            sex: 'Male',
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const resetModal = () => {
        setStep('form')
        setProgress(0)
        setFile(null)
        setChecklist([])
        setChecklistAnswers({})
        setCurrentPatientId(null)
        form.reset()
    }

    const simulateProcessing = async (data: PatientFormValues) => {
        if (!file) {
            toast.error("Please upload an ECG file to proceed")
            return
        }

        setStep('processing')

        try {
            // Stage 1: Uploading
            setProcessingStage("Preparing upload...")
            const formData = new FormData()
            formData.append('mrn', `P-${Math.floor(Math.random() * 100000)}`)
            formData.append('name', data.name)
            formData.append('age', data.age.toString())
            formData.append('sex', data.sex === 'Male' ? 'M' : 'F')
            formData.append('height', data.height.toString())
            formData.append('weight', data.weight.toString())
            formData.append('file', file)

            setProcessingStage("Uploading ECG data...")
            setProgress(30)

            setProcessingStage("Extracting waveforms & Running Inference...")
            setProgress(60)

            const response = await api.post('/patients', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            const patientData = response.data.patient
            setCurrentPatientId(patientData._id)
            addPatient(patientData)

            // Check for validation checklist
            if (patientData.ai_analysis?.validation_checklist?.length > 0) {
                setChecklist(patientData.ai_analysis.validation_checklist)
                setStep('checklist')
                return
            }

            setProcessingStage("Finalizing analysis...")
            setProgress(100)
            await new Promise(r => setTimeout(r, 500))

            setStep('success')

            setTimeout(() => {
                setOpen(false)
                resetModal()
                toast.success("Patient registered successfully")
            }, 1200)

        } catch (error: any) {
            console.error(error)
            setStep('form')
            setProcessingStage('')
            setProgress(0)
            toast.error(error.response?.data?.message || "Failed to process patient data")
        }
    }

    const onSubmit = (data: PatientFormValues) => {
        simulateProcessing(data)
    }

    const submitChecklist = async () => {
        if (!currentPatientId) return
        setStep('processing')
        setProcessingStage("Updating analysis...")
        setProgress(70)
        try {
            // Mock submission
            await new Promise(r => setTimeout(r, 800))
            setStep('success')
            setTimeout(() => {
                setOpen(false)
                resetModal()
            }, 1000)
        } catch (e) { console.error(e) }
    }


    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetModal()
            setOpen(val)
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-white text-slate-900 sm:max-w-[600px] p-0 gap-0 overflow-hidden border-none shadow-2xl rounded-xl">
                <AnimatePresence mode="wait">
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <DialogTitle className="text-xl font-bold text-slate-900 font-heading tracking-tight">
                                    New Patient Intake
                                </DialogTitle>
                            </div>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                                {/* Upload Zone */}
                                <div className="space-y-3">
                                    <label
                                        className={cn(
                                            "flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden",
                                            file
                                                ? "border-[#0059b2] bg-blue-50/30"
                                                : "border-gray-200 hover:border-[#0059b2]/50 hover:bg-gray-50 bg-white"
                                        )}
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                                                file ? "bg-[#0059b2] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-[#0059b2]"
                                            )}>
                                                {file ? <FileText className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                                            </div>

                                            {file ? (
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-[#0059b2]">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB • Ready to upload</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        Drop ECG (XML/DICOM) here to Auto-Fill
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        or click to browse from computer
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" accept=".xml,.dcm" onChange={handleFileChange} />
                                    </label>

                                    {/* File Status Bar */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-white border border-gray-200 flex items-center justify-center text-[#0059b2]">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-900">ECG File</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {file ? "SELECTED" : "NO FILE SELECTED"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                                            file ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-500"
                                        )}>
                                            {file ? "Ready" : "Pending"}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</Label>
                                        <Input
                                            placeholder="Enter patient's full name"
                                            {...form.register("name")}
                                            className="h-11 bg-white border-gray-200 focus:border-[#0059b2] focus:ring-1 focus:ring-[#0059b2]/20 text-slate-900 font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="- -"
                                                    {...form.register("age", { valueAsNumber: true })}
                                                    className="h-11 bg-white border-gray-200 focus:border-[#0059b2] text-slate-900 font-medium pr-10"
                                                />
                                                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400 pointer-events-none">YRS</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Height</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="- -"
                                                    {...form.register("height", { valueAsNumber: true })}
                                                    className="h-11 bg-white border-gray-200 focus:border-[#0059b2] text-slate-900 font-medium pr-10"
                                                />
                                                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400 pointer-events-none">CM</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight</Label>
                                            <div className="relative">
                                                <Input
                                                    type="number"
                                                    placeholder="- -"
                                                    {...form.register("weight", { valueAsNumber: true })}
                                                    className="h-11 bg-white border-gray-200 focus:border-[#0059b2] text-slate-900 font-medium pr-10"
                                                />
                                                <span className="absolute right-3 top-3.5 text-xs font-bold text-gray-400 pointer-events-none">KG</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="pt-2 flex items-center justify-end gap-3 mt-auto">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        className="h-11 px-6 text-slate-600 font-bold hover:bg-gray-100"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-11 px-6 bg-[#0059b2] hover:bg-[#004a94] text-white font-bold shadow-lg shadow-blue-500/20"
                                    >
                                        Analyze & Save
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Reuse Processing / Checklist / Success steps basically as is but styled cleaner */}
                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white h-[600px] flex flex-col items-center justify-center p-8 space-y-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#0059b2]/20 blur-2xl rounded-full"></div>
                                <Loader2 className="h-16 w-16 text-[#0059b2] animate-spin relative z-10" />
                            </div>
                            <div className="space-y-3 text-center w-full max-w-sm">
                                <h3 className="font-heading font-bold text-xl text-slate-900">{processingStage}</h3>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0059b2] transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Please wait while our AI analyzes the ECG waveforms.</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 'checklist' && (
                        <motion.div
                            key="checklist"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white flex flex-col h-full"
                        >
                            <div className="p-6 border-b border-gray-100 bg-indigo-50/50">
                                <h4 className="text-indigo-900 font-bold text-lg flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                                    </div>
                                    AI Validation Required
                                </h4>
                                <p className="text-sm text-indigo-700/80 mt-2 font-medium">
                                    The AI has flagged potential factors. Please verify to refine the diagnosis.
                                </p>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto space-y-5">
                                {checklist.map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <Label className="text-slate-800 font-bold text-sm">{item.question}</Label>
                                        <Input
                                            placeholder="Provide details..."
                                            className="bg-gray-50 border-gray-200 text-slate-900 focus:bg-white"
                                            value={checklistAnswers[idx] || ''}
                                            onChange={(e) => setChecklistAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <Button onClick={submitChecklist} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md">
                                    Update Evaluation
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white h-[600px] flex flex-col items-center justify-center p-8 text-center space-y-6"
                        >
                            <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center border-4 border-emerald-100">
                                <CheckCircle className="h-12 w-12 text-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold font-heading text-slate-900">Analysis Complete</h3>
                                <p className="text-slate-500 font-medium">Patient successfully added to registry.</p>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
