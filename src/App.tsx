import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <MainLayout>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Diagnostic Profile Card Placeholder */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Diagnostic Profile</CardTitle>
            <CardDescription>Multi-Pathology Analysis from 12-Lead ECG</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Probability Meters Component
            </div>
          </CardContent>
        </Card>

        {/* Biometric Simulator Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Biometric Simulator</CardTitle>
            <CardDescription>Adjust patient parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Sliders Component
            </div>
          </CardContent>
        </Card>

        {/* Waveform Viewer Placeholder */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>12-Lead Waveform</CardTitle>
            <CardDescription>Real-time ECG visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Canvas Viewer Component
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline">Expand Viewer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

export default App
