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
    mi: number
    sttc: number
    cd: number
    hyp: number
    norm: number
}

interface CardimaStore {
    patientData: PatientData
    simulation: SimulationState
    predictions: Predictions
    setPatientData: (data: Partial<PatientData>) => void
    setSimulation: (simulation: Partial<SimulationState>) => void
    setPredictions: (predictions: Partial<Predictions>) => void
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
    predictions: {
        mi: 12.5,
        sttc: 8.2,
        cd: 45.3,
        hyp: 3.1,
        norm: 92.4,
    },
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
}))
