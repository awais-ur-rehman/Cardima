import { useNavigate } from 'react-router-dom'
import { Search, Plus, AlertOctagon, Download, SlidersHorizontal, RotateCw, AlignJustify } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
// Badge was unused
import { useCardimaStore } from '@/store/useCardimaStore'
import { AddPatientModal } from '@/components/patients/AddPatientModal'
import { MainLayout } from '@/components/layout/MainLayout'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export function PatientListPage() {
    const navigate = useNavigate()
    const { patients, setPatients } = useCardimaStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true)
            try {
                // Simulate network delay for shimmer effect demo if needed, or just fetch
                const response = await api.get('/patients')
                setPatients(response.data)
            } catch (error) {
                console.error('Failed to fetch patients:', error)
            } finally {
                // Small artificial delay to show shimmer if response is too fast, 
                // or just remove setTimeout for production
                setTimeout(() => setIsLoading(false), 800)
            }
        }
        fetchPatients()
    }, [setPatients])

    const filteredPatients = patients
        .filter(patient => {
            const matchesSearch = (patient.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (patient._id || '').toLowerCase().includes(searchQuery.toLowerCase())

            const riskLevel = patient.predicted_risk_level?.toUpperCase() || 'LOW'
            const status = patient.status || 'Stable'

            let matchesStatus = true
            if (statusFilter === 'High Risk') {
                matchesStatus = riskLevel === 'HIGH' || status === 'Critical'
            } else if (statusFilter === 'Stable') {
                matchesStatus = riskLevel === 'LOW' || riskLevel === 'MEDIUM' || status === 'Stable' || status === 'Monitoring'
            }

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            // Priority: Critical/High Risk first
            const getScore = (p: any) => {
                const risk = p.predicted_risk_level?.toUpperCase()
                if (risk === 'HIGH') return 3
                if (risk === 'MEDIUM') return 2
                return 1
            }
            return getScore(b) - getScore(a)
        })

    const highRiskCount = patients.filter(p => p.predicted_risk_level?.toUpperCase() === 'HIGH').length

    return (
        <MainLayout>
            <div className="space-y-8 p-6 md:p-8">
                {/* Top Bar Area - Injected into the page layout for this screen */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200/60">
                    <div className="flex items-center gap-4">
                        <div className="p-2 -ml-2 hover:bg-gray-100 rounded-md cursor-pointer text-gray-500">
                            <AlignJustify className="h-5 w-5" />
                        </div>
                        <div className="h-8 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                            <h2 className="text-sm font-bold text-slate-900">Cardiology Triage Unit</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {highRiskCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md border border-red-100 shadow-sm animate-pulse">
                                <AlertOctagon className="h-4 w-4 fill-red-100" />
                                <span className="text-xs font-bold">{highRiskCount} HIGH RISK ALERTS</span>
                            </div>
                        )}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by Name or ID..."
                                className="pl-9 bg-gray-100 border-transparent focus:bg-white transition-all h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Patient Triage Grid</h1>
                            <p className="text-slate-500 mt-1">Real-time risk monitoring and clinical prioritization.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="h-10 border-gray-300 text-slate-700 font-medium hover:bg-gray-50">
                                <Download className="mr-2 h-4 w-4 text-slate-500" />
                                Export Data
                            </Button>
                            <AddPatientModal>
                                <Button className="h-10 bg-[#0059b2] hover:bg-[#004a94] text-white font-bold shadow-md shadow-blue-500/20">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Admit Patient
                                </Button>
                            </AddPatientModal>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <Card className="border border-gray-200 shadow-sm bg-white">
                        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 w-full">
                                <div className="relative w-full max-w-md">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by Name or ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-gray-50 border-gray-200 h-10 focus:ring-2 focus:ring-[#0059b2]/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter by Status:</span>
                                    <FilterPill label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
                                    <FilterPill label="High Risk" active={statusFilter === 'High Risk'} onClick={() => setStatusFilter('High Risk')} />
                                    <FilterPill label="Stable" active={statusFilter === 'Stable'} onClick={() => setStatusFilter('Stable')} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Button variant="ghost" size="icon" className="hover:text-slate-700 hover:bg-gray-100">
                                    <SlidersHorizontal className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-slate-700 hover:bg-gray-100" onClick={() => window.location.reload()}>
                                    <RotateCw className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Table Grid */}
                    <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden min-h-[400px]">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50/50 border-b border-gray-200">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-bold text-slate-900 h-12">Patient Name</TableHead>
                                        <TableHead className="font-bold text-slate-900">MRN</TableHead>
                                        <TableHead className="font-bold text-slate-900">Age/Sex</TableHead>
                                        <TableHead className="font-bold text-slate-900">Admission Time</TableHead>
                                        <TableHead className="font-bold text-slate-900">Primary Prediction</TableHead>
                                        <TableHead className="font-bold text-slate-900 text-center">Risk Status</TableHead>
                                        <TableHead className="font-bold text-slate-900 text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i} className="border-b border-gray-100 h-20">
                                                <TableCell className="px-6"><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell className="px-6"><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell className="px-6"><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell className="px-6"><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell className="px-6"><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell className="px-6 flex justify-center"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                                <TableCell className="px-6"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredPatients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-48 text-center text-gray-400">
                                                No patients match current filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredPatients.map((patient) => {
                                            // Mock Data Logic for display
                                            const admitTime = new Date(patient.last_ecg_date || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                            // Calculate Diagnosis
                                            let primaryDiagnosis = 'Routine Checkup';
                                            if (patient.diagnostic_probabilities) {
                                                const entries = Object.entries(patient.diagnostic_probabilities);
                                                if (entries.length > 0) {
                                                    const sorted = entries.sort(([, a], [, b]) => b - a);
                                                    const [key] = sorted[0];
                                                    if (key === 'MI') primaryDiagnosis = 'Acute MI';
                                                    else if (key === 'CD') primaryDiagnosis = 'Conduction Disturbance';
                                                    else if (key === 'HYP') primaryDiagnosis = 'Hypertrophy';
                                                    else if (key === 'STTC') primaryDiagnosis = 'ST/T Changes';
                                                    else primaryDiagnosis = 'Normal Sinus Rhythm';
                                                }
                                            }

                                            return (
                                                <TableRow key={patient._id} className="border-b border-gray-100 last:border-0 hover:bg-blue-50/30 transition-colors h-20 group">
                                                    <TableCell className="font-bold text-slate-900 px-6">
                                                        {patient.name}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-slate-500 text-sm tracking-wide px-6">
                                                        {patient._id?.slice(-12).replace(/(.{4})/g, '$1-').slice(0, -1).toUpperCase()}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 font-medium px-6">
                                                        {patient.demographics?.age || '--'} / {patient.demographics?.sex || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 font-medium px-6">
                                                        {admitTime}
                                                    </TableCell>
                                                    <TableCell className="text-slate-900 font-medium px-6">
                                                        {primaryDiagnosis}
                                                    </TableCell>
                                                    <TableCell className="text-center px-6">
                                                        <StatusBadge status={patient.predicted_risk_level} />
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 px-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/dashboard/${patient._id}`)}
                                                            className="text-[#0059b2] hover:text-[#004a94] hover:bg-blue-50 font-bold"
                                                        >
                                                            Review
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        {/* Footer / Pagination Placeholder */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Showing {filteredPatients.length} of {patients.length} Patients</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-gray-300" disabled>Previous</Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs bg-white border-gray-300">Next</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                active
                    ? "bg-[#0059b2] text-white border-[#0059b2] shadow-sm"
                    : "bg-white text-slate-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            )}
        >
            {label}
        </button>
    )
}

function StatusBadge({ status }: { status?: string }) {
    const isHigh = status?.toUpperCase() === 'HIGH';
    // Default to Stable/Low

    if (isHigh) {
        return (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-[10px] font-bold uppercase tracking-wide">
                <AlertOctagon className="h-3 w-3" />
                High Risk
            </div>
        )
    }

    return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            Stable
        </div>
    )
}
