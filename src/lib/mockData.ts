export interface Patient {
    id: string
    name: string
    age: number
    sex: 'M' | 'F'
    lastExam: string
    status: 'Critical' | 'Stable' | 'Pending'
    diagnosis: string
}

export const MOCK_PATIENTS: Patient[] = [
    { id: 'P-001', name: 'John Doe', age: 45, sex: 'M', lastExam: '2024-05-10', status: 'Stable', diagnosis: 'Sinus Rhythm' },
    { id: 'P-002', name: 'Jane Smith', age: 62, sex: 'F', lastExam: '2024-05-11', status: 'Critical', diagnosis: 'Myocardial Infarction' },
    { id: 'P-003', name: 'Robert Johnson', age: 71, sex: 'M', lastExam: '2024-05-12', status: 'Pending', diagnosis: 'Review Required' },
    { id: 'P-004', name: 'Emily Davis', age: 29, sex: 'F', lastExam: '2024-05-12', status: 'Stable', diagnosis: 'Normal' },
    { id: 'P-005', name: 'Michael Wilson', age: 54, sex: 'M', lastExam: '2024-05-09', status: 'Critical', diagnosis: 'Conduction Disturbance' },
    { id: 'P-006', name: 'Sarah Brown', age: 38, sex: 'F', lastExam: '2024-05-08', status: 'Stable', diagnosis: 'Sinus Bradycardia' },
]
