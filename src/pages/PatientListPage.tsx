import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, User } from 'lucide-react'
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
                                    <TableHead className="text-white/50">Gender</TableHead>
                                    <TableHead className="text-white/50">Age</TableHead>
                                    <TableHead className="text-white/50">Status</TableHead>
                                    <TableHead className="text-white/50">Prediction</TableHead>
                                    <TableHead className="text-white/50">Last Exam</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPatients.length === 0 ? (
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            No patients found. Add a patient to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPatients.map((patient, index) => {
                                        // Calculate Primary Diagnosis
                                        let primaryDiagnosis = 'Unknown';
                                        if (patient.diagnostic_probabilities) {
                                            const entries = Object.entries(patient.diagnostic_probabilities);
                                            if (entries.length > 0) {
                                                const sorted = entries.sort(([, a], [, b]) => b - a);
                                                const [key, val] = sorted[0];
                                                primaryDiagnosis = `${key} (${(val * 100).toFixed(0)}%)`;
                                                // If NORM is highest, maybe just show NORM
                                                if (key === 'NORM') primaryDiagnosis = 'Normal Sinus Rhythm';
                                            }
                                        }

                                        return (
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
                                                        <span className="font-medium text-white group-hover:text-emerald-300 transition-colors">{patient.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-white/70 text-sm">
                                                    {patient.demographics?.sex === 'M' ? 'Male' : patient.demographics?.sex === 'F' ? 'Female' : patient.demographics?.sex || '-'}
                                                </TableCell>
                                                <TableCell className="text-white/70 text-sm">
                                                    {patient.demographics?.age || '-'}y
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        (patient.predicted_risk_level?.toUpperCase() === 'HIGH') ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border-rose-500/20' :
                                                            (patient.predicted_risk_level?.toUpperCase() === 'MEDIUM') ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-amber-500/20' :
                                                                'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-500/20'
                                                    }>
                                                        {patient.predicted_risk_level?.toUpperCase() || 'UNKNOWN'}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-white/80 text-sm font-medium">
                                                    {primaryDiagnosis}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {patient.last_ecg_date ? new Date(patient.last_ecg_date).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    )
}
