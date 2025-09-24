"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  CheckCircle,
  BarChart3,
  Users,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Building2,
  Globe,
  Star,
  Menu,
  X,
  Brain,
  Database,
  Network,
  Eye,
  Clock,
  DollarSign
} from 'lucide-react'
import { Logo } from '@/components/logo'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('activity')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slideDirection, setSlideDirection] = useState('next')
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [parallaxOffset, setParallaxOffset] = useState(0)

  const slides = [
    {
      id: 0,
      title: "Deal Flow Dashboard",
      description: "Kanban-style deal management with real-time updates",
      type: "dashboard"
    },
    {
      id: 1,
      title: "Company Profile",
      description: "Comprehensive company insights with AI-powered enrichment",
      type: "profile"
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      description: "Advanced analytics and performance tracking",
      type: "analytics"
    }
  ]

  // Handle scroll animations and parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setScrollY(scrollTop)
      setParallaxOffset(scrollTop * 0.5) // Parallax speed multiplier
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach((el) => observer.observe(el))

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      observer.disconnect()
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setSlideDirection('next')
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length])

  // Slide navigation functions
  const nextSlide = () => {
    setSlideDirection('next')
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setSlideDirection('prev')
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setSlideDirection(index > currentSlide ? 'next' : 'prev')
    setCurrentSlide(index)
  }

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return
    
    const distance = touchStartX - touchEndX
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }

    setTouchStartX(0)
    setTouchEndX(0)
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoPlaying(!isAutoPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAutoPlaying])

  // Handle dropdown interactions
  const handleDropdownEnter = (dropdown: string) => {
    setActiveDropdown(dropdown)
  }

  const handleDropdownLeave = () => {
    setActiveDropdown(null)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleDropdownEnter('products')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors">
                  Products
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-200 ${
                  activeDropdown === 'products' 
                    ? 'opacity-100 visible transform translate-y-0' 
                    : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="p-6">
                    <div className="grid gap-1">
                      <Link href="/dashboard" className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">MIV Platform</div>
                          <div className="text-sm text-gray-500">Complete venture capital management solution</div>
                        </div>
                      </Link>
                      <Link href="/dashboard/ai-analysis" className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                          <Brain className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">AI Analytics</div>
                          <div className="text-sm text-gray-500">Intelligent deal sourcing and analysis</div>
                        </div>
                      </Link>
                      <Link href="/dashboard/portfolio" className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                          <Target className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Portfolio Management</div>
                          <div className="text-sm text-gray-500">Track and optimize your investments</div>
                        </div>
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-4">
                      <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all products →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solutions Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleDropdownEnter('solutions')}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors">
                  Solutions
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                <div className={`absolute top-full left-0 mt-1 w-96 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-200 ${
                  activeDropdown === 'solutions' 
                    ? 'opacity-100 visible transform translate-y-0' 
                    : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Industries</h4>
                        <div className="space-y-2">
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Venture Capital</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Private Equity</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Family Offices</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Corporate VC</Link>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Workflows</h4>
                        <div className="space-y-2">
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Deal Sourcing</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Due Diligence</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">Portfolio Support</Link>
                          <Link href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors">LP Relations</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">Resources</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">Why MIV</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900 font-medium">Company</Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Sign in
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                Get started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Platform</Link>
              <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Solutions</Link>
              <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Resources</Link>
              <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Company</Link>
              <div className="border-t border-gray-200 pt-4">
                <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-gray-900 font-medium">Sign in</Link>
                <Button className="mt-2 mx-3 bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg">Get started</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Professional Hero */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white pt-20 pb-32 overflow-hidden">
        {/* Professional Background Elements */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='0.4'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`
            }}></div>
          </div>
          
          {/* Gradient Orbs */}
          <div 
            className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-full opacity-30 blur-3xl animate-float-slow"
            style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100 via-teal-50 to-cyan-100 rounded-full opacity-25 blur-3xl animate-float-medium" 
            style={{ animationDelay: '2s', transform: `translateY(${parallaxOffset * -0.1}px)` }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="animate-on-scroll opacity-0 translate-y-4 transition-all duration-700 mb-8">
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-full px-6 py-2 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Trusted by 500+ VCs worldwide</span>
              </div>
            </div>

            {/* Main Headline with Bold Font */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-100 mb-8">
              <h1 className="font-black text-5xl sm:text-6xl lg:text-8xl text-gray-900 leading-[0.9] tracking-tight" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: 900 }}>
                VENTURE
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  INTELLIGENCE
                </span>
              </h1>
            </div>

            {/* Professional Subheadline */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-200 mb-12">
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-6">
                  The world's most advanced AI-powered venture capital platform. 
                  <br className="hidden md:block" />
                  Make data-driven investment decisions with unprecedented precision.
                </p>
                
                {/* Key Stats */}
                <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    $2.5B+ AUM Managed
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                    95% Deal Accuracy
                  </div>
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                    40% Faster Due Diligence
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-300 mb-20">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5">
                    <span>Start Free Trial</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-12 py-4 text-lg font-semibold rounded-xl bg-white/80 backdrop-blur-sm transform hover:-translate-y-0.5 transition-all">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Enhanced Feature Preview Cards */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-400">
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                {/* AI Intelligence Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900 }}>
                      AI DEAL ENGINE
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      Advanced machine learning algorithms analyze 10,000+ data points to identify and score high-potential investment opportunities.
                    </p>
                    <div className="flex items-center text-blue-600 font-semibold">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Portfolio Analytics Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900 }}>
                      PORTFOLIO COMMAND
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      Real-time portfolio performance tracking with predictive analytics, risk assessment, and automated reporting.
                    </p>
                    <div className="flex items-center text-emerald-600 font-semibold">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Security Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900 }}>
                      FORTRESS SECURITY
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg mb-6">
                      Military-grade encryption with SOC 2 Type II compliance, zero-trust architecture, and comprehensive audit trails.
                    </p>
                    <div className="flex items-center text-purple-600 font-semibold">
                      <span>Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-700 delay-500">
              <div className="pt-12 border-t border-gray-200">
                <p className="text-center text-gray-500 text-sm mb-8 font-semibold tracking-wide">TRUSTED BY LEADING VENTURE CAPITAL FIRMS</p>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                  <div className="text-2xl font-bold text-gray-400">SEQUOIA</div>
                  <div className="text-2xl font-bold text-gray-400">a16z</div>
                  <div className="text-2xl font-bold text-gray-400">KLEINER PERKINS</div>
                  <div className="text-2xl font-bold text-gray-400">GREYLOCK</div>
                  <div className="text-2xl font-bold text-gray-400">BENCHMARK</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-8 transition-all duration-700">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">PLATFORM</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Drive better investment decisions
            </h2>
          </div>

          <div className="animate-on-scroll opacity-0 translate-y-12 transition-all duration-700 delay-200">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                    MIV Platform
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Purpose-built private capital platform that enables firms to get into the right deals and make better decisions across the firm with data and AI
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-fit group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-200">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex items-center justify-center order-1 lg:order-2">
                  <div className="w-full h-80 bg-white rounded-lg shadow-lg border border-gray-200 relative overflow-hidden group-hover:shadow-xl transition-all duration-300">
                    <div className="p-6 h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex space-x-2">
                          <div className="h-6 w-6 bg-blue-100 rounded"></div>
                          <div className="h-6 w-6 bg-green-100 rounded"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded">
                          <div className="h-8 w-8 bg-blue-200 rounded mb-2"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <div className="h-8 w-8 bg-green-200 rounded mb-2"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <div className="h-8 w-8 bg-purple-200 rounded mb-2"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      </div>
                </div>
                </div>
                </div>
                </div>
                </div>
          </div>
        </div>
      </section>

      {/* Products Showcase - Affinity Style Slides */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">OUR PRODUCTS</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Drive better dealmaking across your team with MIV
            </h2>
          </div>

          {/* Enhanced Product Slides */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Interactive Slide Container */}
            <div className="relative">
              {/* Slide Controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg"
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4 text-gray-600" /> : <Play className="h-4 w-4 text-gray-600" />}
                </button>
              </div>

              {/* Slide Container */}
              <div 
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-xl relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                    style={{ 
                      width: isAutoPlaying ? '100%' : '0%',
                      animation: isAutoPlaying ? 'slideProgress 4s linear infinite' : 'none'
                    }}
                  />
                </div>

                {/* Slide Content */}
                <div className="relative">
                  {currentSlide === 0 && (
                    <div className={`slide-content ${slideDirection === 'next' ? 'slide-enter' : 'slide-enter-reverse'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-gray-900">Deal Flow Dashboard</h4>
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded text-center hover:bg-blue-100 transition-colors cursor-pointer">
                            <div className="text-xs text-gray-500 mb-1">New</div>
                            <div className="text-lg font-bold text-blue-600">23</div>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                            <div className="text-xs text-gray-500 mb-1">Review</div>
                            <div className="text-lg font-bold text-yellow-600">8</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded text-center hover:bg-green-100 transition-colors cursor-pointer">
                            <div className="text-xs text-gray-500 mb-1">Won</div>
                            <div className="text-lg font-bold text-green-600">12</div>
                          </div>
                          <div className="bg-red-50 p-3 rounded text-center hover:bg-red-100 transition-colors cursor-pointer">
                            <div className="text-xs text-gray-500 mb-1">Lost</div>
                            <div className="text-lg font-bold text-red-600">5</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[
                            { name: "TechStartup AI", stage: "Series A", amount: "$2.5M", progress: 75 },
                            { name: "DataCorp Inc", stage: "Series B", amount: "$8.2M", progress: 45 },
                            { name: "CloudTech", stage: "Seed", amount: "$1.1M", progress: 90 }
                          ].map((deal, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{deal.name}</div>
                                <div className="text-xs text-gray-500">{deal.stage}</div>
                                <div className="mt-1 bg-gray-200 rounded-full h-1">
                                  <div className="bg-blue-600 h-1 rounded-full transition-all duration-1000" style={{width: `${deal.progress}%`}}></div>
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-gray-700">{deal.amount}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSlide === 1 && (
                    <div className={`slide-content ${slideDirection === 'next' ? 'slide-enter' : 'slide-enter-reverse'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-gray-900">Company Profile</h4>
                          <div className="text-xs text-blue-600 font-semibold">AI Enriched</div>
                        </div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-900">TechCorp Inc.</h5>
                            <p className="text-sm text-gray-500">Series B • AI/ML • San Francisco</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600">Active</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">Funding Stage</div>
                            <div className="font-semibold text-gray-900">Series B</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">Last Funding</div>
                            <div className="font-semibold text-gray-900">$15M</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">Employees</div>
                            <div className="font-semibold text-gray-900">127</div>
                          </div>
                          <div className="bg-orange-50 p-3 rounded">
                            <div className="text-xs text-gray-500 mb-1">Founded</div>
                            <div className="font-semibold text-gray-900">2019</div>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="text-xs text-gray-500 mb-2">Recent Activity</div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-600">Meeting scheduled with CEO</span>
                              <span className="text-xs text-gray-400">2h ago</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-gray-600">Due diligence materials shared</span>
                              <span className="text-xs text-gray-400">1d ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSlide === 2 && (
                    <div className={`slide-content ${slideDirection === 'next' ? 'slide-enter' : 'slide-enter-reverse'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-bold text-gray-900">Analytics Dashboard</h4>
                          <div className="text-xs text-green-600 font-semibold">Live Data</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-1">$47M</div>
                            <div className="text-xs text-gray-500">Total AUM</div>
                            <div className="mt-2 flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">+23%</span>
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">89.7%</div>
                            <div className="text-xs text-gray-500">Success Rate</div>
                            <div className="mt-2 flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">+5.2%</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Portfolio Performance</span>
                            <span className="text-sm font-semibold text-gray-900">Excellent</span>
                          </div>
                          <div className="bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-4/5 animate-pulse"></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-lg font-bold text-gray-900">47</div>
                              <div className="text-xs text-gray-500">Active Deals</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900">12</div>
                              <div className="text-xs text-gray-500">This Month</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900">3.2x</div>
                              <div className="text-xs text-gray-500">ROI</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Navigation */}
              <div className="mt-8">
                {/* Slide Dots */}
                <div className="flex justify-center space-x-3 mb-4">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 relative ${
                        currentSlide === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    >
                      {currentSlide === index && (
                        <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Slide Info */}
                <div className="text-center">
                  <h5 className="font-semibold text-gray-900 mb-1">{slides[currentSlide].title}</h5>
                  <p className="text-sm text-gray-600">{slides[currentSlide].description}</p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600 rotate-180" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                  >
                    <ArrowRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Descriptions */}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">MIV Platform</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  MIV brings together relationship intelligence, deal sourcing, deal flow management, portfolio support, fundraising, and analytics that integrate directly with how you work
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </div>

              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">MIV Analytics</h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  MIV provides deal teams with reliable and regularly updated insights about their organization's network of people and companies—and extends these insights into their workflow.
                </p>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Affinity Advantage Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-4">MIV ADVANTAGE</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Drive deals faster
            </h2>
          </div>

          {/* Interactive Tabs */}
          <div className="mb-12">
            <div className="flex justify-center space-x-8 border-b border-gray-200">
              {[
                { id: 'activity', label: 'Activity capture' },
                { id: 'intelligence', label: 'Relationship intelligence' },
                { id: 'management', label: 'Deal management' },
                { id: 'enrichment', label: 'Data enrichment' },
                { id: 'infrastructure', label: 'Data infrastructure' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              </div>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    The easiest path to firmwide adoption
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    By capturing interactions from inboxes and calendars—and even summarizing conversations with AI tools like Notetaker—MIV makes adoption effortless across the firm.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {activeTab === 'intelligence' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    See every connection that matters
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    MIV maps your firm's network and uses AI to uncover the warmest paths into the relationships and opportunities that matter most.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {activeTab === 'management' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Keep every deal on track
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    No more digging through inboxes, PDFs, or spreadsheets—MIV shows you the real-time status and context of every deal.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {activeTab === 'enrichment' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Enriched data on every record
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Automatically enrich CRM records with data from 40+ premium data sources to make faster, more informed investment decisions
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {activeTab === 'infrastructure' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Your network data, everywhere you need it
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Seamlessly integrate relationship intelligence and deal data into your existing processes and tools, so insights flow everywhere your team works.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Dynamic Screenshot */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {activeTab === 'activity' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">Activity Timeline</h5>
                      <div className="text-xs text-gray-500">Live sync</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { type: 'email', contact: 'John Smith, CEO', time: '2 hours ago', color: 'blue' },
                        { type: 'call', contact: 'Sarah Johnson, CTO', time: '1 day ago', color: 'green' },
                        { type: 'meeting', contact: 'Mike Chen, Founder', time: '3 days ago', color: 'purple' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                          <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                            <div className={`w-3 h-3 bg-${activity.color}-500 rounded-full`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{activity.contact}</div>
                            <div className="text-xs text-gray-500">{activity.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'intelligence' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">Network Connections</h5>
                      <div className="text-xs text-blue-600">AI Powered</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Alex Chen', role: 'Partner at Sequoia', strength: 'Strong', color: 'green' },
                        { name: 'Maria Garcia', role: 'VP at Andreessen', strength: 'Medium', color: 'yellow' },
                        { name: 'David Kim', role: 'Director at Kleiner', strength: 'Weak', color: 'red' }
                      ].map((connection, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{connection.name}</div>
                            <div className="text-xs text-gray-500">{connection.role}</div>
                          </div>
                          <div className={`px-2 py-1 text-xs rounded-full bg-${connection.color}-100 text-${connection.color}-700`}>
                            {connection.strength}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(activeTab === 'management' || activeTab === 'enrichment' || activeTab === 'infrastructure') && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">Deal Pipeline</h5>
                      <div className="text-xs text-gray-500">Updated now</div>
                    </div>
              <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">TechStartup AI</span>
                          <span className="text-sm text-blue-600">Series A</span>
                        </div>
                        <div className="text-sm text-gray-600">Last contact: 2 days ago</div>
                        <div className="mt-2 bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">DataCorp</span>
                          <span className="text-sm text-green-600">Series B</span>
                        </div>
                        <div className="text-sm text-gray-600">Last contact: 1 week ago</div>
                        <div className="mt-2 bg-green-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full w-1/2"></div>
                        </div>
                </div>
                </div>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-100 font-semibold text-sm uppercase tracking-wide mb-4">ENTERPRISE-GRADE DEALMAKING</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Driving measurable results for private capital firms
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center grid-fade-in">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">150%</div>
              <div className="text-blue-100">growth in qualified deal flow</div>
                </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">3x</div>
              <div className="text-blue-100">increase in trackable relationships</div>
                </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">40%</div>
              <div className="text-blue-100">reduction in deal processing time</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">hours saved annually per user</div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore MIV - Comprehensive Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Explore MIV
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Platform Features */}
            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h4 className="font-bold text-gray-900">Platform</h4>
              </div>
              <p className="text-gray-600 text-sm">Standardize your process to review and track deals across the firm</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Eye className="h-6 w-6 text-green-600" />
                <h4 className="font-bold text-gray-900">Activity capture</h4>
              </div>
              <p className="text-gray-600 text-sm">Automatically capture and store all current and historical activity</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Network className="h-6 w-6 text-purple-600" />
                <h4 className="font-bold text-gray-900">Relationship intelligence</h4>
              </div>
              <p className="text-gray-600 text-sm">Quantify relationship strength based on recency and frequency of interactions</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="h-6 w-6 text-orange-600" />
                <h4 className="font-bold text-gray-900">Data enrichment</h4>
              </div>
              <p className="text-gray-600 text-sm">Enrich profiles with verified data from Crunchbase, Dealroom, and Pitchbook</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Globe className="h-6 w-6 text-cyan-600" />
                <h4 className="font-bold text-gray-900">Integrations</h4>
              </div>
              <p className="text-gray-600 text-sm">Integrate proprietary network and deal data across your entire tech stack</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Brain className="h-6 w-6 text-indigo-600" />
                <h4 className="font-bold text-gray-900">AI Analytics</h4>
              </div>
              <p className="text-gray-600 text-sm">Analyze deal, relationship, and interaction data to uncover insights</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="h-6 w-6 text-red-600" />
                <h4 className="font-bold text-gray-900">Data permissions</h4>
              </div>
              <p className="text-gray-600 text-sm">Control how sensitive data is shared within customer teams</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-6 w-6 text-pink-600" />
                <h4 className="font-bold text-gray-900">Analytics & reporting</h4>
              </div>
              <p className="text-gray-600 text-sm">Analyze deal, relationship, and interaction data to uncover insights</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-6 w-6 text-emerald-600" />
                <h4 className="font-bold text-gray-900">MIV mobile</h4>
              </div>
              <p className="text-gray-600 text-sm">Relationship and deal insights wherever you are</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to uplevel your data driven investing?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Find out why more than half of leading private capital firms use MIV to transform their relationship data into their competitive advantage.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold">
            Request a demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Products</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-white">MIV Platform</Link></li>
                <li><Link href="#" className="hover:text-white">AI Analytics</Link></li>
                <li><Link href="#" className="hover:text-white">Portfolio Management</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-white">Venture Capital</Link></li>
                <li><Link href="#" className="hover:text-white">Private Equity</Link></li>
                <li><Link href="#" className="hover:text-white">Family Offices</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
                <li><Link href="#" className="hover:text-white">Case Studies</Link></li>
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="#" className="hover:text-white">About Us</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo />
              <span className="ml-2 text-xl font-bold">MIV</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MIV. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}