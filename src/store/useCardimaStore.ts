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

interface CardimaStore {
    patientData: PatientData
    simulation: SimulationState
    setPatientData: (data: Partial<PatientData>) => void
    setSimulation: (simulation: Partial<SimulationState>) => void
    resetSimulation: () => void
}

export const useCardimaStore = create<CardimaStore>((set) => ({
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
    setPatientData: (data) =>
        set((state) => ({ patientData: { ...state.patientData, ...data } })),
    setSimulation: (simulation) =>
        set((state) => ({ simulation: { ...state.simulation, ...simulation } })),
    resetSimulation: () =>
        set((state) => ({
            simulation: {
                isSimulating: false,
                simulatedAge: state.patientData.age,
                simulatedWeight: state.patientData.weight,
            },
        })),
}))
