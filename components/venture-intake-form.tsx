"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FileUpload } from '@/components/ui/file-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  FileText, 
  Target, 
  Users, 
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Heart,
  Shield,
  Award,
  Eye,
  Ear,
  Activity,
  Brain,
  MessageSquare
} from 'lucide-react'

// Form validation schema
const ventureIntakeSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(1, 'Venture name is required'),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().min(1, 'Location is required'),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  
  // Step 2: Team & Foundation
  founderTypes: z.array(z.string()).min(1, 'Select at least one founder type'),
  teamSize: z.string().min(1, 'Team size is required'),
  foundingYear: z.string().min(1, 'Founding year is required'),
  pitchSummary: z.string().min(10, 'Pitch summary must be at least 10 characters'),
  inclusionFocus: z.string().min(1, 'Inclusion focus is required'),
  
  // Step 3: Market & Business
  targetMarket: z.string().min(1, 'Target market is required'),
  revenueModel: z.string().min(1, 'Revenue model is required'),
  challenges: z.string().min(1, 'Challenges description is required'),
  supportNeeded: z.string().min(1, 'Support needed description is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  
  // Step 4: Readiness Assessment
  operationalReadiness: z.object({
    businessPlan: z.boolean(),
    financialProjections: z.boolean(),
    legalStructure: z.boolean(),
    teamComposition: z.boolean(),
    marketResearch: z.boolean(),
  }),
  
  capitalReadiness: z.object({
    pitchDeck: z.boolean(),
    financialStatements: z.boolean(),
    investorMaterials: z.boolean(),
    dueDiligence: z.boolean(),
    fundingHistory: z.boolean(),
  }),
  
  // Step 5: Accessibility & Disability Inclusion
  washingtonShortSet: z
    .object({
      seeing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      hearing: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      walking: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      cognition: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      selfCare: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
      communication: z.enum(['no_difficulty', 'some_difficulty', 'a_lot_of_difficulty', 'cannot_do_at_all']).optional(),
    })
    .optional(),
  disabilityInclusion: z
    .object({
      disabilityLedLeadership: z.boolean().optional(),
      inclusiveHiringPractices: z.boolean().optional(),
      accessibleProductsOrServices: z.boolean().optional(),
      notes: z.string().optional(),
    })
    .optional(),

  // Step 5: GEDSI Goals
  gedsiGoals: z.array(z.string()).min(1, 'Select at least one GEDSI goal'),
})

type VentureIntakeFormData = z.infer<typeof ventureIntakeSchema>

const steps = [
  { id: 1, title: 'Basic Information', description: 'Venture details and contact information' },
  { id: 2, title: 'Team & Foundation', description: 'Founding team and venture foundation' },
  { id: 3, title: 'Market & Business', description: 'Target market and business model' },
  { id: 4, title: 'Readiness Assessment', description: 'Operational and capital readiness' },
  { id: 5, title: 'Accessibility & DLI', description: 'Washington Short Set + Disability Inclusion' },
  { id: 6, title: 'GEDSI Goals', description: 'Impact goals and metrics' },
  { id: 7, title: 'Review & Confirm', description: 'Verify your details before submission' },
]

const sectors = [
  'CleanTech', 'Agriculture', 'FinTech', 'Healthcare', 'Education', 
  'E-commerce', 'Manufacturing', 'Services', 'Technology', 'Other'
]

const founderTypes = [
  'women-led', 'youth-led', 'disability-inclusive', 'rural-focus', 
  'indigenous-led', 'refugee-led', 'veteran-led', 'other'
]

const teamSizes = ['1-2', '3-5', '6-10', '11-20', '21-50', '50+']

const revenueModels = [
  'B2B Sales', 'B2C Sales', 'Subscription', 'Marketplace', 
  'Licensing', 'Franchising', 'Advertising', 'Other'
]

const gedsiGoals = [
  'OI.1 - Women-led ventures supported',
  'OI.2 - Ventures with disability inclusion',
  'OI.3 - Rural communities served',
  'OI.4 - Youth employment created',
  'OI.5 - Indigenous communities supported',
  'OI.6 - Financial inclusion achieved',
  'OI.7 - Education access improved',
  'OI.8 - Healthcare access enhanced'
]

export function VentureIntakeForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [showAiInsights, setShowAiInsights] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [createdVentureId, setCreatedVentureId] = useState<string | null>(null)
  const [members, setMembers] = useState<Array<{ id: string; name: string; email: string }>>([])
  const [supportingFiles, setSupportingFiles] = useState<File[]>([])
  

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<VentureIntakeFormData>({
    // Validation temporarily disabled
    mode: 'onChange',
    defaultValues: {
      founderTypes: [],
      operationalReadiness: {},
      capitalReadiness: {},
      washingtonShortSet: {},
      disabilityInclusion: { notes: '' },
      gedsiGoals: [],
      website: '',
      description: '',
      revenue: '' as any,
      fundingRaised: '' as any,
      lastValuation: '' as any,
      tags: [] as any,
      intakeDate: '' as any,
      screeningDate: '' as any,
      dueDiligenceStart: '' as any,
      dueDiligenceEnd: '' as any,
      investmentReadyAt: '' as any,
      nextReviewAt: '' as any,
      status: 'ACTIVE' as any,
      stage: 'INTAKE' as any,
      assignedToId: '' as any,
    }
  })

  const watchedValues = watch()

  const progress = (currentStep / steps.length) * 100

  // Step-specific required fields for validation
  const stepRequiredFields: Record<number, (keyof VentureIntakeFormData | `${string}.${string}`)[]> = {
    1: ['name', 'sector', 'location', 'contactEmail'],
    2: ['founderTypes', 'teamSize', 'foundingYear', 'pitchSummary', 'inclusionFocus'],
    3: ['targetMarket', 'revenueModel', 'challenges', 'supportNeeded', 'timeline'],
    4: [], // custom validation below (at least one operational and one capital item)
    5: [],
    6: ['gedsiGoals'],
    7: [],
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    // Built-in validation for mapped fields
    const fields = stepRequiredFields[currentStep] || []
    let valid = true
    if (fields.length > 0) {
      valid = await trigger(fields as any, { shouldFocus: true })
    }
    // Custom checks for step 4: ensure at least one readiness item selected for each
    if (valid && currentStep === 4) {
      const op = watchedValues.operationalReadiness || {}
      const cap = watchedValues.capitalReadiness || {}
      const opCount = Object.values(op).filter(Boolean).length
      const capCount = Object.values(cap).filter(Boolean).length
      if (opCount === 0 || capCount === 0) {
        setSubmissionError('Please select at least one item in Operational Readiness and Capital Readiness.')
        return false
      }
    }
    setSubmissionError(null)
    return valid
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: VentureIntakeFormData) => {
    setIsSubmitting(true)
    setSubmissionError(null)
    try {
      console.log('[Intake] Submitting venture payload', data)
      // Submit venture data
      const response = await fetch('/api/ventures', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setCreatedVentureId(result.id)
          // Upload supporting documents (if any)
          try {
            if (supportingFiles.length > 0) {
              const form = new FormData()
              supportingFiles.forEach(f => form.append('files', f))
              form.append('ventureId', result.id)
              form.append('type', 'OTHER')
              await fetch('/api/documents/upload', { method: 'POST', body: form, credentials: 'include' })
            }
          } catch {}

          // Clear draft on success
        try {
          localStorage.removeItem('ventureIntakeDraft')
          setLastSavedAt(null)
        } catch {}
        
        // Trigger AI analysis
        const aiResponse = await fetch('/api/ai/analyze-venture', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ventureId: result.id }),
        })

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json()
          setAiAnalysis(aiResult)
          setShowAiInsights(true)
          try {
            localStorage.removeItem('ventureIntakeDraft')
            setLastSavedAt(null)
          } catch {}
        } else {
          const errTxt = await aiResponse.text().catch(() => '')
          setSubmissionError(`Submitted venture, but failed to run AI Analysis. ${errTxt}`)
        }
      } else {
        const errText = await response.text().catch(() => '')
        setSubmissionError(`Failed to submit venture. ${errText || ''}`)
      }
    } catch (error) {
      console.error('Error submitting venture:', error)
      setSubmissionError('Unexpected error submitting venture. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitNow = async () => {
    // Skip client validation and submit current form values
    setSubmissionError(null)
    const values = getValues()
    await onSubmit(values as any)
  }

  const clearForm = () => {
    try {
      localStorage.removeItem('ventureIntakeDraft')
      setLastSavedAt(null)
    } catch {}
    setSupportingFiles([])
    setSubmissionError(null)
    setAiAnalysis(null)
    setShowAiInsights(false)
    setCreatedVentureId(null)
    setCurrentStep(1)
    reset()
  }

  // Draft: load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ventureIntakeDraft')
      if (raw) {
        const parsed = JSON.parse(raw)
        Object.entries(parsed || {}).forEach(([key, value]) => {
          // Only set known fields; react-hook-form can handle nested via setValue with dot path
          setValue(key as any, value as any, { shouldValidate: false })
        })
        setLastSavedAt(new Date().toLocaleTimeString())
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load org members for assignee select
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch('/api/team/members?limit=100', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        const list = (data.members || []).map((m: any) => ({ id: m.id, name: m.name || m.email, email: m.email }))
        setMembers(list)
      } catch {}
    }
    loadMembers()
  }, [])

  // Draft: autosave (debounced)
  useEffect(() => {
    try {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        try {
          // If analysis is shown (completed), don't keep saving
          if (!showAiInsights) {
            localStorage.setItem('ventureIntakeDraft', JSON.stringify(watchedValues))
            setLastSavedAt(new Date().toLocaleTimeString())
          }
        } catch {}
      }, 600)
    } catch {}
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [watchedValues, showAiInsights])

  const saveDraft = () => {
    try {
      if (!showAiInsights) {
        localStorage.setItem('ventureIntakeDraft', JSON.stringify(watchedValues))
        setLastSavedAt(new Date().toLocaleTimeString())
      }
    } catch {}
  }

  const renderStep1 = () => (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venture Name */}
        <div className="md:col-span-2">
          <Card className="p-4 border-dashed border-2 hover:border-blue-400 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                <Label htmlFor="name" className="font-medium">Venture Name *</Label>
              </div>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., EcoFarm Solutions"
                className="border-0 text-lg font-medium focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Sector */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Label htmlFor="sector" className="font-medium">Industry Sector *</Label>
            </div>
            <Select value={watchedValues.sector as any} onValueChange={(value) => setValue('sector', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500">
                <SelectValue placeholder="Choose your industry" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.sector.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Location */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-purple-500" />
              <Label htmlFor="location" className="font-medium">Location *</Label>
            </div>
            <Input
              id="location"
              {...register('location')}
              placeholder="Ho Chi Minh City, Vietnam"
              className="border-0 focus:ring-2 focus:ring-purple-500"
            />
            {errors.location && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.location.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Contact Email */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <Label htmlFor="contactEmail" className="font-medium">Contact Email *</Label>
            </div>
            <Input
              id="contactEmail"
              type="email"
              {...register('contactEmail')}
              placeholder="founder@yourventure.com"
              className="border-0 focus:ring-2 focus:ring-blue-500"
            />
            {errors.contactEmail && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.contactEmail.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Contact Phone */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-green-500" />
              <Label htmlFor="contactPhone" className="font-medium">Contact Phone</Label>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            <Input
              id="contactPhone"
              {...register('contactPhone')}
              placeholder="+84 901 234 567"
              className="border-0 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </Card>
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Basic information</span>
          <span>Next: Team & Foundation</span>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">

      {/* Founder Types */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-5 w-5 text-purple-500" />
            <Label className="font-semibold text-lg">Founder Types *</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select all that apply to your founding team
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {founderTypes.map((type) => (
              <Card key={type} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.founderTypes || []
                      if (checked) {
                        setValue('founderTypes', [...current, type])
                      } else {
                        setValue('founderTypes', current.filter(t => t !== type))
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-sm capitalize cursor-pointer">
                    {type.replace('-', ' ')}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
          {errors.founderTypes && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.founderTypes.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Additional Venture Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <Label htmlFor="website" className="font-medium">Website</Label>
            </div>
            <Input id="website" placeholder="https://example.com" {...register('website' as any)} className="border-0 focus:ring-2 focus:ring-blue-500" />
          </div>
        </Card>

        {/* Stage & Status */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Stage</Label>
              <Select onValueChange={(v) => setValue('stage' as any, v as any)}>
                <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500 mt-1"><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {['INTAKE','SCREENING','DUE_DILIGENCE','INVESTMENT_READY','FUNDED','EXITED','SEED','SERIES_A','SERIES_B','SERIES_C'].map(s => (
                    <SelectItem key={s} value={s}>{s.replace('_',' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-medium">Status</Label>
              <Select onValueChange={(v) => setValue('status' as any, v as any)}>
                <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500 mt-1"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {['ACTIVE','INACTIVE','ARCHIVED'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <Label htmlFor="description" className="font-medium">Description</Label>
          <Textarea id="description" rows={3} placeholder="Short venture description" {...register('description' as any)} className="border-0 focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
      </Card>

      {/* Finance & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <Label className="font-medium">Revenue (USD)</Label>
          <Input type="number" step="any" placeholder="0" {...register('revenue' as any)} className="border-0 focus:ring-2 focus:ring-indigo-500 mt-2" />
        </Card>
        <Card className="p-4">
          <Label className="font-medium">Funding Raised (USD)</Label>
          <Input type="number" step="any" placeholder="0" {...register('fundingRaised' as any)} className="border-0 focus:ring-2 focus:ring-indigo-500 mt-2" />
        </Card>
        <Card className="p-4">
          <Label className="font-medium">Last Valuation (USD)</Label>
          <Input type="number" step="any" placeholder="0" {...register('lastValuation' as any)} className="border-0 focus:ring-2 focus:ring-indigo-500 mt-2" />
        </Card>
      </div>

      <Card className="p-4">
        <Label className="font-medium">Tags (comma separated)</Label>
        <Input placeholder="cleantech, ai, women-led" onChange={(e) => {
          const raw = e.target.value
          const arr = raw.split(',').map(s => s.trim()).filter(Boolean)
          setValue('tags' as any, arr as any)
        }} className="border-0 focus:ring-2 focus:ring-purple-500 mt-2" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Size */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <Label htmlFor="teamSize" className="font-medium">Team Size *</Label>
            </div>
            <Select value={watchedValues.teamSize as any} onValueChange={(value) => setValue('teamSize', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="How many team members?" />
              </SelectTrigger>
              <SelectContent>
                {teamSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size} people
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.teamSize && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.teamSize.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Founding Year */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <Label htmlFor="foundingYear" className="font-medium">Founding Year *</Label>
            </div>
            <Input
              id="foundingYear"
              {...register('foundingYear')}
              placeholder="When was your venture founded?"
              className="border-0 focus:ring-2 focus:ring-green-500"
            />
            {errors.foundingYear && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.foundingYear.message}</span>
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Pitch Summary */}
      <Card className="p-6 border-dashed border-2 hover:border-blue-400 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <Label htmlFor="pitchSummary" className="font-medium">Pitch Summary *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">Tell us about your venture's mission and value proposition</p>
          <Textarea
            id="pitchSummary"
            {...register('pitchSummary')}
            placeholder="We are solving [problem] for [target audience] by providing [solution]. Our unique approach is..."
            rows={4}
            className="border-0 focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {errors.pitchSummary && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.pitchSummary.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Inclusion Focus */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-green-500" />
            <Label htmlFor="inclusionFocus" className="font-medium">Inclusion Focus *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">How does your venture promote inclusion and address social challenges?</p>
          <Textarea
            id="inclusionFocus"
            {...register('inclusionFocus')}
            placeholder="Our venture promotes inclusion by... We address social challenges through... Our target beneficiaries are..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-green-500 resize-none"
          />
          {errors.inclusionFocus && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.inclusionFocus.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Team & Foundation</span>
          <span>Next: Market & Business Model</span>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Market */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <Label htmlFor="targetMarket" className="font-medium">Target Market *</Label>
            </div>
            <Input
              id="targetMarket"
              {...register('targetMarket')}
              placeholder="Rural farmers in Vietnam"
              className="border-0 focus:ring-2 focus:ring-blue-500"
            />
            {errors.targetMarket && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.targetMarket.message}</span>
              </p>
            )}
          </div>
        </Card>

        {/* Revenue Model */}
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <Label htmlFor="revenueModel" className="font-medium">Revenue Model *</Label>
            </div>
            <Select value={watchedValues.revenueModel as any} onValueChange={(value) => setValue('revenueModel', value)}>
              <SelectTrigger className="border-0 focus:ring-2 focus:ring-green-500">
                <SelectValue placeholder="How do you make money?" />
              </SelectTrigger>
              <SelectContent>
                {revenueModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.revenueModel && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.revenueModel.message}</span>
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Challenges */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <Label htmlFor="challenges" className="font-medium">Key Challenges *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">What are the main challenges your venture faces?</p>
          <Textarea
            id="challenges"
            {...register('challenges')}
            placeholder="Market access, funding constraints, regulatory barriers, technology challenges..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-orange-500 resize-none"
          />
          {errors.challenges && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.challenges.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Support Needed */}
      <Card className="p-6 border-dashed border-2 hover:border-purple-400 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-purple-500" />
            <Label htmlFor="supportNeeded" className="font-medium">Support Needed *</Label>
          </div>
          <p className="text-sm text-gray-500 mb-3">What type of support do you need from MIV?</p>
          <Textarea
            id="supportNeeded"
            {...register('supportNeeded')}
            placeholder="Funding, mentorship, market access, technical assistance, network connections..."
            rows={3}
            className="border-0 focus:ring-2 focus:ring-purple-500 resize-none"
          />
          {errors.supportNeeded && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.supportNeeded.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <Label htmlFor="timeline" className="font-medium">Timeline to Investment Readiness *</Label>
          </div>
          <Input
            id="timeline"
            {...register('timeline')}
            placeholder="6-12 months to Series A"
            className="border-0 focus:ring-2 focus:ring-indigo-500"
          />
          {errors.timeline && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.timeline.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Market & Business Model</span>
          <span>Next: Readiness Assessment</span>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-8">

      {/* Operational Readiness */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Operational Readiness</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check all the operational components you have ready
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'businessPlan', label: 'Business Plan', icon: FileText },
              { key: 'financialProjections', label: 'Financial Projections', icon: TrendingUp },
              { key: 'legalStructure', label: 'Legal Structure', icon: Shield },
              { key: 'teamComposition', label: 'Team Composition', icon: Users },
              { key: 'marketResearch', label: 'Market Research', icon: Target },
            ].map((item) => (
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`operationalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-blue-500" />
                  <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Capital Readiness */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Capital Readiness</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Check all the capital-related materials you have prepared
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'pitchDeck', label: 'Pitch Deck', icon: FileText },
              { key: 'financialStatements', label: 'Financial Statements', icon: TrendingUp },
              { key: 'investorMaterials', label: 'Investor Materials', icon: Award },
              { key: 'dueDiligence', label: 'Due Diligence Ready', icon: CheckCircle },
              { key: 'fundingHistory', label: 'Funding History', icon: Calendar },
            ].map((item) => (
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`capitalReadiness.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-purple-500" />
                  <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Workflow & Ownership */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Workflow & Ownership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Assigned To</Label>
              <Select onValueChange={(v) => setValue('assignedToId' as any, v as any)}>
                <SelectTrigger className="border-0 focus:ring-2 focus:ring-slate-500 mt-1"><SelectValue placeholder="Select team member" /></SelectTrigger>
                <SelectContent>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name} ({m.email})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-medium">Intake Date</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('intakeDate' as any)} />
            </div>
            <div>
              <Label className="font-medium">Screening Date</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('screeningDate' as any)} />
            </div>
            <div>
              <Label className="font-medium">Due Diligence Start</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('dueDiligenceStart' as any)} />
            </div>
            <div>
              <Label className="font-medium">Due Diligence End</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('dueDiligenceEnd' as any)} />
            </div>
            <div>
              <Label className="font-medium">Investment Ready At</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('investmentReadyAt' as any)} />
            </div>
            <div>
              <Label className="font-medium">Next Review At</Label>
              <Input type="date" className="border-0 focus:ring-2 focus:ring-slate-500 mt-1" {...register('nextReviewAt' as any)} />
            </div>
          </div>
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Readiness Assessment</span>
          <span>Next: Accessibility & Disability Inclusion</span>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-8">

      {/* Washington Group Short Set */}
      <Card className="p-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-teal-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="h-5 w-5 text-teal-500" />
            <Label className="font-semibold text-lg">Washington Group Short Set</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Identify functional difficulties to better design inclusive support
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'seeing', label: 'Seeing', icon: Eye },
              { key: 'hearing', label: 'Hearing', icon: Ear },
              { key: 'walking', label: 'Walking/Mobility', icon: Activity },
              { key: 'cognition', label: 'Remembering/Concentrating', icon: Brain },
              { key: 'selfCare', label: 'Self-care (washing/dressing)', icon: Heart },
              { key: 'communication', label: 'Communication', icon: MessageSquare },
            ].map((item) => (
              <Card key={item.key} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4 text-teal-500" />
                    <Label className="text-sm font-medium">{item.label}</Label>
                  </div>
                  <Select onValueChange={(value) => setValue(`washingtonShortSet.${item.key}` as any, value as any)}>
                    <SelectTrigger className="border-0 focus:ring-2 focus:ring-teal-500">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_difficulty">No difficulty</SelectItem>
                      <SelectItem value="some_difficulty">Some difficulty</SelectItem>
                      <SelectItem value="a_lot_of_difficulty">A lot of difficulty</SelectItem>
                      <SelectItem value="cannot_do_at_all">Cannot do at all</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Disability Inclusion Attributes */}
      <Card className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 border-cyan-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-cyan-500" />
            <Label className="font-semibold text-lg">Disability Inclusion Attributes</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select all that apply to your venture's inclusion practices
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'disabilityLedLeadership', label: 'Disability-led leadership', icon: Users },
              { key: 'inclusiveHiringPractices', label: 'Inclusive hiring practices', icon: CheckCircle },
              { key: 'accessibleProductsOrServices', label: 'Accessible products/services', icon: Shield },
            ].map((item) => (
              <Card key={item.key} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.key}
                    onCheckedChange={(checked) => {
                      setValue(`disabilityInclusion.${item.key}` as any, checked as boolean)
                    }}
                  />
                  <item.icon className="h-4 w-4 text-cyan-500" />
                  <Label htmlFor={item.key} className="cursor-pointer text-sm">{item.label}</Label>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Additional Notes */}
      <Card className="p-6 border-dashed border-2 hover:border-teal-400 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-teal-500" />
            <Label htmlFor="dliNotes" className="font-medium">Additional Notes</Label>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-3">Any relevant context about accessibility or inclusion practices</p>
          <Textarea 
            id="dliNotes" 
            rows={3} 
            placeholder="Additional context about your venture's accessibility features, inclusion practices, or specific needs..."
            className="border-0 focus:ring-2 focus:ring-teal-500 resize-none"
            {...register('disabilityInclusion.notes' as any)} 
          />
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>✅ Accessibility & Disability Inclusion</span>
          <span>Next: GEDSI Goals</span>
        </div>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-8">

      {/* GEDSI Goals */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-emerald-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-emerald-500" />
            <Label className="font-semibold text-lg">GEDSI Goals *</Label>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            These goals will be used to track your venture's impact and align with IRIS+ metrics
          </p>
          <div className="grid grid-cols-1 gap-3">
            {gedsiGoals.map((goal) => (
              <Card key={goal} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={goal}
                    className="mt-0.5"
                    checked={(watchedValues.gedsiGoals || []).includes(goal)}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.gedsiGoals || []
                      if (checked) {
                        if (!current.includes(goal)) {
                          setValue('gedsiGoals', [...current, goal])
                        }
                      } else {
                        setValue('gedsiGoals', current.filter(g => g !== goal))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={goal} className="cursor-pointer font-medium">
                      {goal.split(' - ')[0]} - {goal.split(' - ')[1]}
                    </Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        IRIS+ Metric
                      </Badge>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
              </Card>
            ))}
          </div>
          {errors.gedsiGoals && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.gedsiGoals.message}</span>
            </p>
          )}
        </div>
      </Card>

      {/* AI Analysis Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI-Powered Impact Analysis</h4>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              After submitting your form, our AI system will analyze your venture and suggest additional relevant IRIS+ metrics based on your sector, business model, and GEDSI goals.
            </p>
          </div>
        </div>
      </Card>

      {/* Supporting Documents */}
      <Card className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold">Supporting Documents</h3>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Upload any documents that support your application and help us better understand your venture
          </p>
          
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>All Supporting Materials</span>
            </h4>
            <FileUpload
              acceptedFileTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.png', '.jpeg']}
              maxFileSize={10 * 1024 * 1024} // 10MB
              maxFiles={10}
              onUpload={(files) => {
                // Stash files to upload after venture is created
                setSupportingFiles(Array.from(files || []))
              }}
              placeholder="Upload pitch decks, business plans, financial statements, team bios, certificates..."
            />
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg">
            <p className="text-xs text-slate-800 dark:text-slate-200">
              💡 <strong>Helpful documents:</strong> Pitch deck, business plan, financial projections, team bios, legal documents, market research, accessibility reports, impact reports, or any other materials that showcase your venture.
            </p>
          </div>
        </div>
      </Card>

      {/* Final Info Alert */}
      <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950">
        <Award className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800 dark:text-emerald-200">
          🎉 You're almost done! After submitting, you'll receive a comprehensive readiness assessment and personalized recommendations for your venture's growth.
        </AlertDescription>
      </Alert>

      {/* Progress indicator */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-4 rounded-lg border border-emerald-200">
        <div className="flex items-center justify-between text-sm text-emerald-800 dark:text-emerald-200">
          <span>✅ GEDSI Goals & Impact</span>
          <span>Ready to Submit & Analyze!</span>
        </div>
      </div>
    </div>
  )

  const renderReview = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Basic Information</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(1)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div><span className="text-gray-500">Name:</span> {watchedValues.name || '-'}</div>
          <div><span className="text-gray-500">Sector:</span> {watchedValues.sector || '-'}</div>
          <div><span className="text-gray-500">Location:</span> {watchedValues.location || '-'}</div>
          <div><span className="text-gray-500">Contact Email:</span> {watchedValues.contactEmail || '-'}</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Team & Foundation</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div><span className="text-gray-500">Founder Types:</span> {(watchedValues.founderTypes || []).join(', ') || '-'}</div>
          <div><span className="text-gray-500">Team Size:</span> {watchedValues.teamSize || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Pitch Summary:</span> {watchedValues.pitchSummary || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Inclusion Focus:</span> {watchedValues.inclusionFocus || '-'}</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Market & Business</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(3)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div><span className="text-gray-500">Target Market:</span> {watchedValues.targetMarket || '-'}</div>
          <div><span className="text-gray-500">Revenue Model:</span> {watchedValues.revenueModel || '-'}</div>
          <div><span className="text-gray-500">Website:</span> {(watchedValues as any).website || '-'}</div>
          <div><span className="text-gray-500">Status / Stage:</span> {(watchedValues as any).status || '-'} / {(watchedValues as any).stage || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Challenges:</span> {watchedValues.challenges || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Support Needed:</span> {watchedValues.supportNeeded || '-'}</div>
          <div><span className="text-gray-500">Timeline:</span> {watchedValues.timeline || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Description:</span> {(watchedValues as any).description || '-'}</div>
          <div><span className="text-gray-500">Revenue:</span> {(watchedValues as any).revenue || '-'}</div>
          <div><span className="text-gray-500">Funding Raised:</span> {(watchedValues as any).fundingRaised || '-'}</div>
          <div><span className="text-gray-500">Last Valuation:</span> {(watchedValues as any).lastValuation || '-'}</div>
          <div className="md:col-span-2"><span className="text-gray-500">Tags:</span> {Array.isArray((watchedValues as any).tags) ? ((watchedValues as any).tags as any[]).join(', ') : '-'}</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Readiness</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(4)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div>
            <span className="text-gray-500">Operational:</span>{' '}
            {Object.entries(watchedValues.operationalReadiness || {}).filter(([,v]) => v).map(([k]) => k).join(', ') || '-'}
          </div>
          <div>
            <span className="text-gray-500">Capital:</span>{' '}
            {Object.entries(watchedValues.capitalReadiness || {}).filter(([,v]) => v).map(([k]) => k).join(', ') || '-'}
          </div>
          <div><span className="text-gray-500">Assigned To:</span> {(watchedValues as any).assignedToId || '-'}</div>
          <div><span className="text-gray-500">Intake Date:</span> {(watchedValues as any).intakeDate || '-'}</div>
          <div><span className="text-gray-500">Screening Date:</span> {(watchedValues as any).screeningDate || '-'}</div>
          <div><span className="text-gray-500">DD Start / End:</span> {(watchedValues as any).dueDiligenceStart || '-'} / {(watchedValues as any).dueDiligenceEnd || '-'}</div>
          <div><span className="text-gray-500">Investment Ready:</span> {(watchedValues as any).investmentReadyAt || '-'}</div>
          <div><span className="text-gray-500">Next Review:</span> {(watchedValues as any).nextReviewAt || '-'}</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Accessibility & DLI</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(5)}>Edit</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
          <div>
            <span className="text-gray-500">Washington Set:</span>{' '}
            {Object.entries(watchedValues.washingtonShortSet || {}).map(([k,v]) => `${k}:${v}`).join(', ') || '-'}
          </div>
          <div>
            <span className="text-gray-500">DLI:</span>{' '}
            {Object.entries(watchedValues.disabilityInclusion || {}).filter(([k]) => k !== 'notes').filter(([,v]) => v).map(([k]) => k).join(', ') || '-'}
          </div>
          <div className="md:col-span-2"><span className="text-gray-500">Notes:</span> {watchedValues.disabilityInclusion?.notes || '-'}</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">GEDSI Goals</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentStep(6)}>Edit</Button>
        </div>
        <div className="mt-3 text-sm">
          {(watchedValues.gedsiGoals || []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(watchedValues.gedsiGoals || [])).map((g, idx) => (
                <Badge key={`${g}-${idx}`} variant="secondary">{g}</Badge>
              ))}
            </div>
          ) : '-'}
        </div>
      </Card>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      case 5:
        return renderStep5()
      case 6:
        return renderStep6()
      case 7:
        return renderReview()
      default:
        return null
    }
  }

  if (showAiInsights && aiAnalysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <CardTitle>AI Analysis Complete!</CardTitle>
            </div>
            <CardDescription>
              Your venture has been analyzed and GEDSI metrics have been suggested
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Readiness Score</h4>
                <p className="text-2xl font-bold text-green-600">{aiAnalysis.readinessScore}%</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800">GEDSI Alignment</h4>
                <p className="text-2xl font-bold text-blue-600">{aiAnalysis.gedsiAlignment}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800">Suggested Metrics</h4>
                <p className="text-2xl font-bold text-purple-600">{aiAnalysis.suggestedMetrics?.length || 0}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">AI Recommendations</h4>
              <div className="space-y-2">
                {aiAnalysis.recommendations?.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Suggested GEDSI Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiAnalysis.suggestedMetrics?.map((metric: any, index: number) => (
                  <Badge key={index} variant="outline" className="justify-start">
                    {metric.code}: {metric.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={() => { setShowAiInsights(false); setCurrentStep(7) }} variant="outline">
                Back to Form
              </Button>
              <Button onClick={() => {
                try { localStorage.removeItem('ventureIntakeDraft'); } catch {}
                if (createdVentureId) {
                  router.push(`/dashboard/ventures/${createdVentureId}`)
                } else {
                  router.push('/dashboard/ventures')
                }
              }}>
                View Venture Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Venture Intake Form</h2>
          <Badge variant="outline">Step {currentStep} of {steps.length}</Badge>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            {steps[currentStep - 1].title} - {steps[currentStep - 1].description}
          </span>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>{steps[currentStep - 1].title}</span>
            {currentStep === steps.length && <Sparkles className="h-4 w-4 text-blue-500" />}
          </CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {submissionError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {submissionError}
                </AlertDescription>
              </Alert>
            )}
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    onClick={nextStep}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button type="button" variant="outline" onClick={clearForm}>Clear Form</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="button"
                    onClick={submitNow}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Submit & Analyze
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            {lastSavedAt && (
              <p className="text-xs text-gray-500">Draft saved at {lastSavedAt}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 