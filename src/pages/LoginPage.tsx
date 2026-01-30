import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { useCardimaStore } from '@/store/useCardimaStore'
import { toast } from 'sonner'


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'demo@cardima.ai',
            password: 'password123',
        },
    })

    const { setAuth } = useCardimaStore()

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        try {
            const response = await api.post('/auth/login', data)
            const { accessToken, doctor } = response.data

            setAuth(doctor, accessToken)
            toast.success("Welcome back, Dr. " + doctor.name)
            navigate('/dashboard')
        } catch (error: any) {
            console.error('Login failed:', error)
            toast.error(error.response?.data?.message || "Authentication failed. Please check your credentials.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex bg-[#050505] text-white overflow-hidden font-sans">
            {/* Left Side: Emerald Gradient Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="hidden lg:flex flex-col justify-between w-[50%] relative overflow-hidden p-16"
            >
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-[#0A0A0A]">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight">Cardima AI</span>
                    </div>

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-5xl font-heading font-bold leading-[1.1] tracking-tight">
                            Precision <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Cardiac Analytics</span>
                        </h1>
                        <p className="text-lg text-white/50 leading-relaxed font-light">
                            The next generation of AI-powered electrocardiagram analysis.
                            Detect anomalies with hospital-grade accuracy in real-time.
                        </p>

                        {/* Feature Steps */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
                            <FeatureStep number="01" title="Upload" desc="Drag & drop ECG files" />
                            <FeatureStep number="02" title="Analyze" desc="AI-driven inference" />
                            <FeatureStep number="03" title="Report" desc="Detailed diagnostics" />
                        </div>
                    </div>

                    <div className="text-sm text-white/30 font-mono">
                        v2.4.0-stable build.8921
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Compact Login Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 relative z-20 bg-[#050505]"
            >
                <div className="w-full max-w-[400px] space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold font-heading tracking-tight">Welcome Back</h2>
                        <p className="text-white/40 text-sm">Enter your credentials to access the workspace.</p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-white/70 ml-1">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input
                                        {...form.register('email')}
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-0 rounded-xl transition-all"
                                        placeholder="doctor@hospital.com"
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-[10px] text-rose-400 font-medium ml-1">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-xs font-medium text-white/70">Password</Label>
                                    <a href="#" className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                    <Input
                                        {...form.register('password')}
                                        type="password"
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:bg-emerald-500/5 focus:ring-0 rounded-xl transition-all font-mono tracking-wider"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-[10px] text-rose-400 font-medium ml-1">{form.formState.errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-white text-black hover:bg-emerald-50 hover:text-black font-semibold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Sign In to Workspace"}
                        </Button>


                    </form>

                    <p className="text-center text-[10px] text-white/30">
                        By continuing, you agree to Cardima's <a href="#" className="underline hover:text-white underline-offset-2">Terms of Service</a> and <a href="#" className="underline hover:text-white underline-offset-2">Privacy Policy</a>.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

function FeatureStep({ number, title, desc }: { number: string, title: string, desc: string }) {
    return (
        <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                {number}
            </div>
            <div>
                <h4 className="font-semibold text-white/90 text-sm">{title}</h4>
                <p className="text-xs text-white/40 leading-snug">{desc}</p>
            </div>
        </div>
    )
}
