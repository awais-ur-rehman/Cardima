import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X } from "lucide-react"

export function FileUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    return (
        <Card className="col-span-full shadow-sm border-dashed border-2">
            <CardHeader>
                <CardTitle>Data Integration</CardTitle>
                <CardDescription>Upload hospital export files (XML, DICOM-ECG)</CardDescription>
            </CardHeader>
            <CardContent>
                {!file ? (
                    <div
                        className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="p-4 bg-secondary rounded-full mb-4">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="mb-2 text-sm font-medium">
                            Drag & Drop or <span className="text-primary cursor-pointer hover:underline" onClick={() => document.getElementById('file-upload')?.click()}>Browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Supported formats: .xml, .dcm</p>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".xml,.dcm"
                            onChange={handleFileChange}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Process File</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
