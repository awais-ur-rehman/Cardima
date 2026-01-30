import { MainLayout } from '@/components/layout/MainLayout'
import { DiagnosticProfile } from '@/features/diagnostic-profile/DiagnosticProfile'
import { BiometricSimulator } from '@/features/biometric-simulator/BiometricSimulator'
import { WaveformViewer } from '@/features/waveform-viewer/WaveformViewer'
import { EmergencyMonitor } from '@/features/emergency-alert/EmergencyMonitor'
import { FileUpload } from '@/features/file-upload/FileUpload'

function App() {
  return (
    <MainLayout>
      <EmergencyMonitor />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Diagnostic Profile Card */}
        <DiagnosticProfile />

        {/* Biometric Simulator */}
        <BiometricSimulator />

        {/* Waveform Viewer */}
        <WaveformViewer />

        {/* File Upload */}
        <FileUpload />
      </div>
    </MainLayout>
  )
}

export default App
