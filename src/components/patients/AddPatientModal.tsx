import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCardimaStore } from '@/store/useCardimaStore'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from "@/components/ui/progress"

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
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
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

    const simulateProcessing = async (data: PatientFormValues) => {
        if (!file) return

        setStep('processing')

        try {
            // Stage 1: Uploading (Simulated visuals for now, but real req preparation)
            setProcessingStage("Preparing upload...")
            const formData = new FormData()
            formData.append('mrn', `P-${Math.floor(Math.random() * 100000)}`) // Auto-generate MRN
            formData.append('name', data.name)
            formData.append('age', data.age.toString())
            formData.append('sex', data.sex === 'Male' ? 'M' : 'F')
            formData.append('height', data.height.toString())
            formData.append('weight', data.weight.toString())
            formData.append('file', file)

            setProcessingStage("Uploading ECG data...")
            setProgress(30)

            // Stage 2: Processing (The API wait)
            // We can't easily split upload/extract/infer unless we use XHR events or separate endpoints.
            // For one-shot, we pretend these steps happen while awaiting.

            setProcessingStage("Extracting waveforms & Running Inference...")
            setProgress(60)

            const response = await api.post('/patients', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })

            setProcessingStage("Finalizing analysis...")
            setProgress(100)
            await new Promise(r => setTimeout(r, 500)) // Short pause for UX

            setStep('success')

            // Add returned patient to store
            addPatient(response.data.patient)

            setTimeout(() => {
                setOpen(false)
                setStep('form')
                setProgress(0)
                setFile(null)
                form.reset()
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
        if (!file) {
            toast.error("Please upload an ECG file to proceed with analysis")
            return
        }
        simulateProcessing(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="bg-[#050505] border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="font-heading">
                        {step === 'form' ? 'Register New Patient' : 'Processing Clinical Data'}
                    </DialogTitle>
                </DialogHeader>

                <AnimatePresence mode="wait">
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                {/* Basic Info */}
                                <div className="grid gap-2">
                                    <Label className="text-white/70">Full Name</Label>
                                    <Input {...form.register("name")} className="bg-white/5 border-white/10 text-white" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-white/70">Age</Label>
                                        <Input type="number" {...form.register("age", { valueAsNumber: true })} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-white/70">Sex</Label>
                                        <select {...form.register("sex")} className="h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-emerald-500/50">
                                            <option value="Male" className="bg-[#1a1d24]">Male</option>
                                            <option value="Female" className="bg-[#1a1d24]">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label className="text-white/70">Height (cm)</Label>
                                        <Input type="number" {...form.register("height", { valueAsNumber: true })} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-white/70">Weight (kg)</Label>
                                        <Input type="number" {...form.register("weight", { valueAsNumber: true })} className="bg-white/5 border-white/10 text-white" />
                                    </div>
                                </div>

                                {/* File Upload Dropzone */}
                                <div className="grid gap-2">
                                    <Label className="text-white/70">ECG Data Source (XML / DICOM)</Label>
                                    {!file ? (
                                        <label className="flex flex-col items-center justify-center h-24 border border-dashed border-white/20 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                            <Upload className="h-5 w-5 text-white/40 mb-2" />
                                            <span className="text-xs text-white/40">Click to upload patient ECG file</span>
                                            <input type="file" className="hidden" accept=".xml,.dcm" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="flex items-center justify-between p-3 border border-emerald-500/30 bg-emerald-500/10 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-emerald-400" />
                                                <span className="text-sm text-emerald-100">{file.name}</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} className="h-6 w-6 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20">
                                                ×
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white w-full">
                                        Analyze & Register
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-12 flex flex-col items-center justify-center space-y-6"
                        >
                            <div className="relative">
                                <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-emerald-500/20" />
                            </div>
                            <div className="space-y-2 text-center w-full max-w-xs">
                                <h3 className="font-heading font-medium text-lg">{processingStage}</h3>
                                <Progress value={progress} className="h-1 bg-white/10 [&>div]:bg-emerald-500" />
                            </div>
                        </motion.div>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold font-heading text-white">Analysis Complete</h3>
                                <p className="text-white/50 text-sm">Patient has been added to the registry.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
