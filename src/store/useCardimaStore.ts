import { create } from 'zustand'

export interface PatientData {
    age: number
    weight: number
    height: number
    sex: 'M' | 'F'
}

export interface SimulationState {
    isSimulating: boolean
    simulatedAge: number
    simulatedWeight: number
}

export interface Predictions {
    MI: number
    STTC: number
    CD: number
    HYP: number
    NORM: number
}

export interface Doctor {
    id: string
    name: string
    email: string
    hospital_id: string
}

export interface Patient {
    _id: string
    mrn: string
    name: string
    demographics: {
        age: number
        sex: 'M' | 'F'
        height: number
        weight: number
    }
    status?: 'Stable' | 'Critical' | 'Monitoring' // API doesn't seem to return status? We might need to derive it or assume it's missing for now.
    last_ecg_date: string
    diagnostic_probabilities: {
        NORM: number
        MI: number
        STTC: number
        CD: number
        HYP: number
    }
    predicted_risk_level: 'Low' | 'Medium' | 'High' | 'HIGH' | 'LOW' | 'MEDIUM'
    verdict?: string
    doctor_validation: string
    raw_ecg_path?: string
    ai_analysis?: {
        recommended_tests: string[]
        validation_checklist: {
            question: string
            is_relevant: boolean
        }[]
        narrative_report: string
    }
}

interface CardimaStore {
    // Auth
    user: Doctor | null
    accessToken: string | null
    setAuth: (user: Doctor, token: string) => void
    logout: () => void

    // App Data
    patientData: PatientData
    simulation: SimulationState
    predictions: Predictions
    patients: Patient[]
    setPatientData: (data: Partial<PatientData>) => void
    setSimulation: (simulation: Partial<SimulationState>) => void
    setPredictions: (predictions: Partial<Predictions>) => void
    resetSimulation: () => void
    setPatients: (patients: Patient[]) => void
    addPatient: (patient: Patient) => void
}

export const useCardimaStore = create<CardimaStore>((set) => ({
    // Auth
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    setAuth: (user, token) => {
        localStorage.setItem('accessToken', token)
        set({ user, accessToken: token })
    },
    logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null })
    },

    // App Data
    patientData: {
        age: 45,
        weight: 70, // kg
        height: 175, // cm
        sex: 'M',
    },
    simulation: {
        isSimulating: false,
        simulatedAge: 45,
        simulatedWeight: 70,
    },
    predictions: {
        MI: 12.5,
        STTC: 8.2,
        CD: 45.3,
        HYP: 3.1,
        NORM: 92.4,
    },
    patients: [],
    setPatientData: (data) =>
        set((state) => ({ patientData: { ...state.patientData, ...data } })),
    setSimulation: (simulation) =>
        set((state) => ({ simulation: { ...state.simulation, ...simulation } })),
    setPredictions: (predictions) =>
        set((state) => ({ predictions: { ...state.predictions, ...predictions } })),
    resetSimulation: () =>
        set((state) => ({
            simulation: {
                isSimulating: false,
                simulatedAge: state.patientData.age,
                simulatedWeight: state.patientData.weight,
            },
        })),
    setPatients: (patients) => set({ patients }),
    addPatient: (patient) =>
        set((state) => ({ patients: [patient, ...state.patients] })),
}))
