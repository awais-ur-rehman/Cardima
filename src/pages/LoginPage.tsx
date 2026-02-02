import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Lock, Mail, Eye, EyeOff, LogIn, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import api from '@/lib/api'
import { useCardimaStore } from '@/store/useCardimaStore'
import { toast } from 'sonner'


const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'doctor@cardima.ai',
            password: 'breakthrough2026',
            rememberMe: false,
        },
    })

    const { setAuth } = useCardimaStore()

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        try {
            const response = await api.post('/auth/login', { email: data.email, password: data.password })
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
        <div className="min-h-screen w-full flex bg-background text-foreground font-sans">
            {/* Left Side: Brand Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[50%] relative overflow-hidden p-16 bg-[#002B5C]"
            >
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight">Cardima</span>
                    </div>

                    {/* Hero Text */}
                    <div className="space-y-6 max-w-xl">
                        <h1 className="text-5xl xl:text-6xl font-heading font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm">
                            Securing the <br />
                            future of patient <br />
                            care.
                        </h1>
                        <p className="text-lg text-blue-100/80 leading-relaxed font-light max-w-md">
                            Dedicated infrastructure for modern healthcare practitioners. Manage clinical data with confidence in an environment designed for precision.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="space-y-4">
                        <div className="text-xs text-white/40 font-mono">
                            &copy; 2026 Cardima Systems. All rights reserved.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Right Side: Login Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative z-20 bg-white"
            >
                <div className="w-full max-w-[480px] space-y-10">
                    <div className="space-y-3">
                        <h2 className="text-4xl font-bold font-heading tracking-tight text-slate-900">Welcome Back</h2>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Access your secure medical dashboard to manage patient records and institutional tasks.
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700 ml-1">Institutional Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        {...form.register('email')}
                                        className="pl-11 h-12 bg-white border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg transition-all text-base"
                                        placeholder="dr.smith@hospital.org"
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-xs text-destructive font-medium ml-1 mt-1">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-sm font-semibold text-slate-700">Password</Label>
                                    <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        {...form.register('password')}
                                        type={showPassword ? "text" : "password"}
                                        className="pl-11 pr-11 h-12 bg-white border-slate-200 text-slate-900 font-medium placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-lg transition-all font-mono tracking-wider text-base"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-xs text-destructive font-medium ml-1 mt-1">{form.formState.errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                onCheckedChange={(checked: boolean | 'indeterminate') => form.setValue('rememberMe', checked === true)}
                                className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                                Remember this device for 30 days
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#0059b2] hover:bg-[#004a94] text-white font-bold rounded-lg text-base transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            <LogIn className="w-5 h-5" />
                            {isLoading ? "Authenticating..." : "Secure Sign In"}
                        </Button>
                    </form>

                    <div className="pt-2 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Having trouble signing in? <a href="#" className="text-[#0059b2] hover:underline font-bold">Contact IT Support</a>
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 flex items-center gap-2 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors cursor-pointer">
                    <HelpCircle className="h-4 w-4" />
                    Help Center & Documentation
                </div>
            </motion.div>
        </div>
    )
}
