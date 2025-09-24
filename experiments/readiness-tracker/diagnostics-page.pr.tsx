"use client"
import ReadinessTracker from "@/components/ui/readiness-tracker";

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, Clock, Target, FileText, Lightbulb } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar, // Declare Radar here
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Recommendation {
  id: string
  text: string
  completed: boolean
}
export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ReadinessTracker />
    </main>
  )
}

interface DiagnosticArea {
  name: string
  score: number
  status: string
  recommendations: Recommendation[]
  notes?: string
  color: string
  bgColor: string
}

interface Venture {
  id: string
  name: string
  sector: string
  overallScore: number
  status: string
  completedAreas: number
  totalAreas: number
  lastUpdated: string
  history: { date: string; score: number }[]
  detailedAreas: DiagnosticArea[]
}

const venturesInDiagnostics: Venture[] = [
  {
    id: "VEN-2024-001",
    name: "AgriTech Solutions",
    sector: "Agriculture",
    overallScore: 75,
    status: "In Progress",
    completedAreas: 4,
    totalAreas: 6,
    lastUpdated: "2 days ago",
    history: [
      { date: "2023-10-01", score: 55 },
      { date: "2023-11-01", score: 60 },
      { date: "2023-12-01", score: 68 },
      { date: "2024-01-01", score: 75 },
    ],
    detailedAreas: [
      {
        name: "Business Model",
        score: 70,
        status: "Good",
        recommendations: [
          { id: "bm1", text: "Refine target market segments.", completed: false },
          { id: "bm2", text: "Explore new distribution channels.", completed: true },
        ],
        notes: "Initial review indicates strong potential, but market penetration needs strategy.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        name: "Market Analysis",
        score: 65,
        status: "Moderate",
        recommendations: [
          { id: "ma1", text: "Conduct detailed competitor analysis.", completed: false },
          { id: "ma2", text: "Validate market size with primary research.", completed: false },
        ],
        notes: "Secondary data is promising, but primary validation is crucial.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        name: "Financial Health",
        score: 80,
        status: "Strong",
        recommendations: [{ id: "fh1", text: "Optimize cost structure for scalability.", completed: false }],
        notes: "Healthy financials, but long-term sustainability needs attention.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Team Capability",
        score: 90,
        status: "Excellent",
        recommendations: [{ id: "tc1", text: "Develop a talent retention program.", completed: true }],
        notes: "Exceptional team with strong leadership.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Technology Readiness",
        score: 55,
        status: "Needs Improvement",
        recommendations: [
          { id: "tr1", text: "Invest in R&D for core technology.", completed: false },
          { id: "tr2", text: "Develop a robust MVP.", completed: false },
          { id: "tr3", text: "Seek external technical validation.", completed: false },
        ],
        notes: "Technology is nascent; significant development required.",
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        name: "GEDSI Compliance",
        score: 78,
        status: "Good",
        recommendations: [
          { id: "gc1", text: "Enhance diversity metrics reporting.", completed: false },
          { id: "gc2", text: "Implement inclusive hiring practices.", completed: false },
        ],
        notes: "Good foundation, but continuous improvement is needed.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
    ],
  },
  {
    id: "VEN-2024-002",
    name: "CleanEnergy Innovations",
    sector: "Clean Energy",
    overallScore: 82,
    status: "Completed",
    completedAreas: 6,
    totalAreas: 6,
    lastUpdated: "1 week ago",
    history: [
      { date: "2023-10-01", score: 65 },
      { date: "2023-11-01", score: 70 },
      { date: "2023-12-01", score: 78 },
      { date: "2024-01-01", score: 82 },
    ],
    detailedAreas: [
      {
        name: "Business Model",
        score: 88,
        status: "Strong",
        recommendations: [{ id: "bm1", text: "Expand into new geographical markets.", completed: true }],
        notes: "Robust business model with clear path to profitability.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Market Analysis",
        score: 85,
        status: "Strong",
        recommendations: [{ id: "ma1", text: "Monitor emerging market trends.", completed: true }],
        notes: "Comprehensive understanding of market dynamics.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Financial Health",
        score: 80,
        status: "Strong",
        recommendations: [{ id: "fh1", text: "Secure Series B funding.", completed: false }],
        notes: "Excellent financial standing, ready for next funding round.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Team Capability",
        score: 92,
        status: "Excellent",
        recommendations: [{ id: "tc1", text: "Onboard new engineering talent.", completed: true }],
        notes: "Highly skilled and experienced team.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        name: "Technology Readiness",
        score: 78,
        status: "Good",
        recommendations: [{ id: "tr1", text: "Optimize energy conversion efficiency.", completed: false }],
        notes: "Mature technology with ongoing R&D.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        name: "GEDSI Compliance",
        score: 85,
        status: "Strong",
        recommendations: [{ id: "gc1", text: "Publish annual GEDSI report.", completed: false }],
        notes: "Strong commitment to GEDSI principles.",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
    ],
  },
  {
    id: "VEN-2024-003",
    name: "HealthTech Myanmar",
    sector: "Healthcare",
    overallScore: 68,
    status: "In Progress",
    completedAreas: 3,
    totalAreas: 6,
    lastUpdated: "3 days ago",
    history: [
      { date: "2023-10-01", score: 40 },
      { date: "2023-11-01", score: 48 },
      { date: "2023-12-01", score: 55 },
      { date: "2024-01-01", score: 68 },
    ],
    detailedAreas: [
      {
        name: "Business Model",
        score: 60,
        status: "Moderate",
        recommendations: [
          { id: "bm1", text: "Define clear revenue streams.", completed: false },
          { id: "bm2", text: "Identify key partnerships.", completed: false },
        ],
        notes: "Business model needs further refinement and validation.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        name: "Market Analysis",
        score: 55,
        status: "Needs Improvement",
        recommendations: [
          { id: "ma1", text: "Conduct comprehensive market research.", completed: false },
          { id: "ma2", text: "Analyze competitive landscape.", completed: false },
        ],
        notes: "Limited market understanding; more research required.",
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        name: "Financial Health",
        score: 70,
        status: "Good",
        recommendations: [{ id: "fh1", text: "Develop detailed financial projections.", completed: false }],
        notes: "Basic financials are in place, but projections need work.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        name: "Team Capability",
        score: 75,
        status: "Good",
        recommendations: [{ id: "tc1", text: "Recruit medical advisory board members.", completed: false }],
        notes: "Competent team, but needs specialized expertise.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        name: "Technology Readiness",
        score: 65,
        status: "Moderate",
        recommendations: [
          { id: "tr1", text: "Refine product features based on user feedback.", completed: false },
          { id: "tr2", text: "Ensure regulatory compliance for health tech.", completed: false },
        ],
        notes: "Technology is functional but requires further development for market fit.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
      {
        name: "GEDSI Compliance",
        score: 60,
        status: "Moderate",
        recommendations: [
          { id: "gc1", text: "Establish GEDSI policy and guidelines.", completed: false },
          { id: "gc2", text: "Conduct diversity training for staff.", completed: false },
        ],
        notes: "Early stages of GEDSI integration; more structured approach needed.",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
      },
    ],
  },
]

const industryAverageScores = {
  "Business Model": 75,
  "Market Analysis": 70,
  "Financial Health": 72,
  "Team Capability": 85,
  "Technology Readiness": 60,
  "GEDSI Compliance": 70,
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-blue-600"
  if (score >= 40) return "text-yellow-600"
  return "text-red-600"
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    default:
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />
  }
}

export default function Diagnostics() {
  const [selectedVenture, setSelectedVenture] = useState<Venture>(venturesInDiagnostics[0])

  const handleRecommendationToggle = (areaName: string, recId: string) => {
    setSelectedVenture((prevVenture) => {
      const updatedDetailedAreas = prevVenture.detailedAreas.map((area) => {
        if (area.name === areaName) {
          const updatedRecommendations = area.recommendations.map((rec) =>
            rec.id === recId ? { ...rec, completed: !rec.completed } : rec,
          )
          return { ...area, recommendations: updatedRecommendations }
        }
        return area
      })

      // Recalculate completed areas for overall progress
      const newCompletedAreas = updatedDetailedAreas.filter((area) =>
        area.recommendations.every((rec) => rec.completed),
      ).length

      return {
        ...prevVenture,
        detailedAreas: updatedDetailedAreas,
        completedAreas: newCompletedAreas,
      }
    })
  }

  const handleNotesChange = (areaName: string, notes: string) => {
    setSelectedVenture((prevVenture) => {
      const updatedDetailedAreas = prevVenture.detailedAreas.map((area) => {
        if (area.name === areaName) {
          return { ...area, notes }
        }
        return area
      })
      return { ...prevVenture, detailedAreas: updatedDetailedAreas }
    })
  }

  const radarChartData = selectedVenture.detailedAreas.map((area) => ({
    subject: area.name,
    A: area.score, // Venture's score
    B: industryAverageScores[area.name as keyof typeof industryAverageScores], // Industry average
    fullMark: 100,
  }))

  const barChartData = selectedVenture.detailedAreas.map((area) => ({
    name: area.name,
    "Your Score": area.score,
    "Industry Average": industryAverageScores[area.name as keyof typeof industryAverageScores],
  }))

  return (
    <>
      {/* Header and main content here, no sidebar or flex layout */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Diagnostics & Readiness</h1>
              <p className="text-gray-600 dark:text-gray-400">Assess venture readiness and identify improvement areas</p>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Target className="h-4 w-4 mr-2" />
              Start New Assessment
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed-analysis">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ventures in Diagnostics</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current ventures undergoing readiness assessment
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {venturesInDiagnostics.map((venture) => (
                          <div
                            key={venture.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedVenture.id === venture.id
                                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => setSelectedVenture(venture)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center text-sm font-semibold">
                                  {venture.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <h3 className="font-medium text-gray-900 dark:text-white">{venture.name}</h3>
                                  <p className="text-sm text-gray-500">{venture.sector}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(venture.status)}
                                <span className="text-sm font-medium">{venture.status}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Overall Score</p>
                                <p className={`text-lg font-bold ${getScoreColor(venture.overallScore)}`}>
                                  {venture.overallScore}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Progress</p>
                                <p className="font-medium">
                                  {venture.completedAreas}/{venture.totalAreas} areas
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500">Last Updated</p>
                                <p className="font-medium">{venture.lastUpdated}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assessment Summary</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedVenture.name}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getScoreColor(selectedVenture.overallScore)}`}>
                            {selectedVenture.overallScore}%
                          </div>
                          <p className="text-sm text-gray-600">Overall Readiness Score</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {selectedVenture.completedAreas}/{selectedVenture.totalAreas} completed
                            </span>
                          </div>
                          <Progress
                            value={(selectedVenture.completedAreas / selectedVenture.totalAreas) * 100}
                            className="h-2"
                          />
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Readiness Score History</h4>
                          <ChartContainer
                            config={{
                              score: {
                                label: "Score",
                                color: "hsl(var(--chart-1))",
                              },
                            }}
                            className="h-[150px] w-full"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={selectedVenture.history}>
                                <XAxis
                                  dataKey="date"
                                  tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
                                  }
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 10, fill: "#6b7280" }}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 10, fill: "#6b7280" }}
                                  domain={[0, 100]}
                                />
                                <ChartTooltip
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload
                                      return (
                                        <div className="bg-white dark:bg-gray-800 p-2 border rounded-lg shadow-lg text-sm">
                                          <p className="font-medium text-gray-900 dark:text-white">
                                            {new Date(data.date).toLocaleDateString()}
                                          </p>
                                          <p className="text-gray-600 dark:text-gray-400">Score: {data.score}%</p>
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="score"
                                  stroke="var(--color-score)"
                                  fill="var(--color-score)"
                                  fillOpacity={0.3}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Quick Actions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Detailed Report
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Schedule Review
                        </Button>
                        <Button className="w-full justify-start bg-teal-600 hover:bg-teal-700 text-white">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve for Next Stage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detailed-analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Assessment - {selectedVenture.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Comprehensive analysis across all diagnostic areas
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedVenture.detailedAreas.map((area, index) => (
                      <Card key={index} className={`border-l-4 border-l-teal-500`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{area.name}</CardTitle>
                            <Badge variant="outline" className={`${area.bgColor} ${area.color} border-current`}>
                              {area.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Score</span>
                                <span className={`font-bold ${getScoreColor(area.score)}`}>{area.score}%</span>
                              </div>
                              <Progress value={area.score} className="h-2" />
                            </div>

                            <div>
                              <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                {area.recommendations.map((rec) => (
                                  <li key={rec.id} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`rec-${area.name}-${rec.id}`}
                                      checked={rec.completed}
                                      onCheckedChange={() => handleRecommendationToggle(area.name, rec.id)}
                                      className="mt-1"
                                    />
                                    <Label
                                      htmlFor={`rec-${area.name}-${rec.id}`}
                                      className={`flex-1 ${rec.completed ? "line-through text-gray-400" : ""}`}
                                    >
                                      {rec.text}
                                    </Label>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`notes-${area.name}`}>Notes</Label>
                              <Textarea
                                id={`notes-${area.name}`}
                                placeholder="Add notes for this area..."
                                value={area.notes || ""}
                                onChange={(e) => handleNotesChange(area.name, e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="benchmarking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Benchmarking - {selectedVenture.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compare venture performance against industry standards
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-teal-600">{selectedVenture.overallScore}%</div>
                        <p className="text-sm text-gray-600">Your Overall Score</p>
                      </Card>
                      <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {Object.values(industryAverageScores).reduce((a, b) => a + b, 0) /
                            Object.keys(industryAverageScores).length}
                          %
                        </div>
                        <p className="text-sm text-gray-600">Industry Average</p>
                      </Card>
                      <Card className="text-center p-4">
                        <div
                          className={`text-2xl font-bold ${
                            selectedVenture.overallScore >=
                            Object.values(industryAverageScores).reduce((a, b) => a + b, 0) /
                              Object.keys(industryAverageScores).length
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {selectedVenture.overallScore -
                            Object.values(industryAverageScores).reduce((a, b) => a + b, 0) /
                              Object.keys(industryAverageScores).length >
                          0
                            ? "+"
                            : ""}
                          {(
                            selectedVenture.overallScore -
                            Object.values(industryAverageScores).reduce((a, b) => a + b, 0) /
                              Object.keys(industryAverageScores).length
                          ).toFixed(0)}
                          %
                        </div>
                        <p className="text-sm text-gray-600">Difference</p>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Radar Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Radar</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Venture vs. Industry Average across areas
                          </p>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              A: { label: "Your Score", color: "hsl(var(--chart-1))" },
                              B: { label: "Industry Average", color: "hsl(var(--chart-3))" },
                            }}
                            className="h-[300px] w-full"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={90} width={730} height={250} data={radarChartData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#6b7280" }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                  name="Your Score"
                                  dataKey="A"
                                  stroke="var(--color-A)"
                                  fill="var(--color-A)"
                                  fillOpacity={0.6}
                                />
                                <Radar
                                  name="Industry Average"
                                  dataKey="B"
                                  stroke="var(--color-B)"
                                  fill="var(--color-B)"
                                  fillOpacity={0.3}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                          <div className="flex justify-center gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-teal-500" />
                              <span>Your Score</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              <span>Industry Average</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Bar Chart Comparison */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Area-wise Comparison</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Detailed scores for each diagnostic area
                          </p>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer
                            config={{
                              "Your Score": { label: "Your Score", color: "hsl(var(--chart-1))" },
                              "Industry Average": { label: "Industry Average", color: "hsl(var(--chart-3))" },
                            }}
                            className="h-[300px] w-full"
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={barChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#6b7280" }} />
                                <YAxis
                                  type="category"
                                  dataKey="name"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fontSize: 12, fill: "#6b7280" }}
                                  width={120}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="Your Score" fill="var(--color-Your-Score)" radius={[0, 4, 4, 0]} />
                                <Bar
                                  dataKey="Industry Average"
                                  fill="var(--color-Industry-Average)"
                                  radius={[0, 4, 4, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
Integrate Readiness Tracker component into dashboard page
