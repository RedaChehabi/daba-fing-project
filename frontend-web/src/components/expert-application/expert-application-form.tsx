"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"

interface ExpertApplicationFormProps {
  onSuccess?: () => void
}

interface ApplicationData {
  motivation: string
  experience: string
  education: string
  certifications: string
}

export default function ExpertApplicationForm({ onSuccess }: ExpertApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    motivation: "",
    experience: "",
    education: "",
    certifications: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/expert-applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        onSuccess?.()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit application')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Your expert application has been submitted successfully. 
                You'll be notified once it's reviewed by an administrator.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to Become an Expert</CardTitle>
        <CardDescription>
          Fill out this form to apply for expert status. Expert users can provide feedback on analyses and access advanced features.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="motivation">Motivation *</Label>
            <Textarea
              id="motivation"
              placeholder="Why do you want to become an expert? What motivates you to contribute to fingerprint analysis?"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Relevant Experience *</Label>
            <Textarea
              id="experience"
              placeholder="Describe your experience with fingerprint analysis, forensics, or related fields..."
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Educational Background *</Label>
            <Textarea
              id="education"
              placeholder="Describe your educational background relevant to forensics, criminal justice, or related fields..."
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications (Optional)</Label>
            <Textarea
              id="certifications"
              placeholder="List any relevant certifications, licenses, or professional qualifications..."
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.motivation || !formData.experience || !formData.education}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Expert Application'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}