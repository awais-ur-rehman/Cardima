import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, MoreHorizontal, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useCardimaStore } from '@/store/useCardimaStore'
import { AddPatientModal } from '@/components/patients/AddPatientModal'
import { MainLayout } from '@/components/layout/MainLayout'

export function PatientListPage() {
    const navigate = useNavigate()
    const { patients, setPatients } = useCardimaStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/patients')
                setPatients(response.data)
            } catch (error) {
                console.error('Failed to fetch patients:', error)
                // toast.error('Failed to load patient registry') // Optional: might be too noisy on auth fail
            }
        }
        fetchPatients()
    }, [setPatients])

    const filteredPatients = patients
        .filter(patient => {
            const matchesSearch = (patient.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (patient._id || '').toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            // Priority: Critical > Monitoring > Stable
            const score: Record<string, number> = { 'Critical': 3, 'Monitoring': 2, 'Stable': 1 }
            return (score[b.status || ''] || 0) - (score[a.status || ''] || 0)
        })

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Patient Registry</h2>
                        <p className="text-muted-foreground">Manage patient records and initiate analysis.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 pl-3 pr-8 rounded-md border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:bg-white/10"
                            >
                                <option value="all" className="bg-[#1a1d24]">All Statuses</option>
                                <option value="Critical" className="bg-[#1a1d24]">Critical</option>
                                <option value="Monitoring" className="bg-[#1a1d24]">Monitoring</option>
                                <option value="Stable" className="bg-[#1a1d24]">Stable</option>
                            </select>
                            <Filter className="absolute right-2.5 top-3 h-4 w-4 text-white/50 pointer-events-none" />
                        </div>

                        <AddPatientModal>
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Patient
                            </Button>
                        </AddPatientModal>
                    </div>
                </div>

                <Card className="border-white/5 bg-[#0A0A0A] shadow-lg">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/5 text-white placeholder:text-muted-foreground focus:ring-1 focus:ring-emerald-500/50"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-white/50 w-[60px]">SR</TableHead>
                                    <TableHead className="text-white/50">Patient Name</TableHead>
                                    <TableHead className="text-white/50">Status</TableHead>
                                    <TableHead className="text-white/50">Last Exam</TableHead>
                                    <TableHead className="text-white/50">Diagnosis</TableHead>
                                    <TableHead className="text-right text-white/50">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            No patients found. Add a patient to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient, index) => (
                                        <TableRow
                                            key={patient._id}
                                            className="border-white/5 hover:bg-white/[0.02] cursor-pointer group transition-colors"
                                            onClick={() => navigate(`/dashboard/${patient._id}`)}
                                        >
                                            <TableCell className="font-mono text-xs text-white/40 group-hover:text-emerald-500 transition-colors">
                                                {String(index + 1).padStart(2, '0')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 text-white/50 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-white group-hover:text-emerald-300 transition-colors">{patient.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {patient.demographics?.sex || '-'}, {patient.demographics?.age || '-'}y
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    patient.status === 'Critical' ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border-rose-500/20' :
                                                        patient.status === 'Monitoring' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/20' :
                                                            patient.status === 'Stable' ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/20' :
                                                                'bg-white/10 text-white/50 border-white/10'
                                                }>
                                                    {(patient.status || 'UNKNOWN').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {patient.last_ecg_date ? new Date(patient.last_ecg_date).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-white/80 text-sm">
                                                {patient.predicted_risk_level} Risk
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
