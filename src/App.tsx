import { MainLayout } from '@/components/layout/MainLayout'
import { DiagnosticProfile } from '@/features/diagnostic-profile/DiagnosticProfile'
import { BiometricSimulator } from '@/features/biometric-simulator/BiometricSimulator'
import { WaveformViewer } from '@/features/waveform-viewer/WaveformViewer'

function App() {
  return (
    <MainLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Diagnostic Profile Card */}
        <DiagnosticProfile />

        {/* Biometric Simulator */}
        <BiometricSimulator />

        {/* Waveform Viewer */}
        <WaveformViewer />
      </div>
    </MainLayout>
  )
}

export default App
