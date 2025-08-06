# MIV Platform - Wireframes & UX Guide

## 🎨 Visual Design System

### **Layout Grid System**

```css
/* 12-Column Grid System */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 0 16px;
  }
}

@media (max-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
    padding: 0 20px;
  }
}
```

### **Spacing Scale**

```css
/* Consistent Spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## 📱 Page Wireframes

### **1. Landing Page (Public)**

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] MIV Platform                    [Login] [Get Started]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Hero Section                                              │ │
│  │                                                             │ │
│  │  🏛️ MIV Platform                                          │ │
│  │  Empowering Inclusive Ventures                             │ │
│  │  Across Southeast Asia                                     │ │
│  │                                                             │ │
│  │  [Start Your Journey] [Learn More]                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │ Quick Stats │ │ Key Features│ │ Success     │              │
│  │             │ │             │ │ Stories     │              │
│  │ • 150+      │ │ • Venture   │ │ • GreenTech │              │
│  │   Ventures  │ │   Pipeline  │ │   Solutions │              │
│  │ • $25M+     │ │ • GEDSI     │ │ • EcoFarm   │              │
│  │   Facilitated│ │   Tracking  │ │   Vietnam   │              │
│  │ • 95% GEDSI │ │ • Capital   │ │ • TechStart │              │
│  │   Compliance│ │   Facilitation│ │   Cambodia  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Footer: [About] [Contact] [Privacy] [Terms]                   │
└─────────────────────────────────────────────────────────────────┘
```

### **2. Authentication Pages**

#### **Login Page**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────┐                        │
│                    │   Login Form    │                        │
│                    │                 │                        │
│                    │  🏛️ MIV        │                        │
│                    │  Welcome Back   │                        │
│                    │                 │                        │
│                    │  Email          │                        │
│                    │  [____________] │                        │
│                    │                 │                        │
│                    │  Password       │                        │
│                    │  [____________] │                        │
│                    │                 │                        │
│                    │  [Login]        │                        │
│                    │                 │                        │
│                    │  [Forgot Password?]                      │
│                    │  [Sign up]      │                        │
│                    └─────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### **Registration Page**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────┐                        │
│                    │ Registration    │                        │
│                    │                 │                        │
│                    │  🏛️ MIV        │                        │
│                    │  Join Our       │                        │
│                    │  Platform       │                        │
│                    │                 │                        │
│                    │  Full Name      │                        │
│                    │  [____________] │                        │
│                    │                 │                        │
│                    │  Email          │                        │
│                    │  [____________] │                        │
│                    │                 │                        │
│                    │  Organization   │                        │
│                    │  [____________] │                        │
│                    │                 │                        │
│                    │  Role           │                        │
│                    │  [Select Role ▼]│                        │
│                    │                 │                        │
│                    │  [Create Account]                        │
│                    │                 │                        │
│                    │  [Already have account?]                 │
│                    └─────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### **3. Dashboard Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  Welcome back, [User Name]                     │ │
│         │  │  Here's your MIV overview for today              │ │
│  [📋]   │  └─────────────────────────────────────────────────┘ │
│  Ventures│                                                       │
│         │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  [📊]   │  │ Pipeline    │ │ GEDSI       │ │ Capital     │     │
│  GEDSI  │  │ Overview    │ │ Progress    │ │ Activities  │     │
│         │  │             │ │             │ │             │     │
│  [💰]   │  │ • 25 Active │ │ • 85%       │ │ • $2.5M     │     │
│  Capital│  │ • 8 Pending │ │   Complete  │ │   Facilitated│     │
│         │  │ • 3 Ready   │ │ • 12        │ │ • 3 Deals   │     │
│  [📈]   │  │ • 2 Funded  │ │   Metrics   │ │   Closed    │     │
│  Analytics│ └─────────────┘ └─────────────┘ └─────────────┘     │
│         │                                                       │
│  [👥]   │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│  Team   │  │ Recent      │ │ Quick       │ │ Performance │     │
│         │  │ Activities  │ │ Actions     │ │ Insights    │     │
│  [⚙️]   │  │             │ │             │ │             │     │
│  Settings│  │ • Venture   │ │ [Add Venture]│ • 15% ↑      │     │
│         │  │   Created   │ │ [Track Metric]│   Efficiency │     │
│         │  │ • Metric    │ │ [Generate   │ • 8 New       │     │
│         │  │   Updated   │ │   Report]   │ │   Ventures   │     │
│         │  │ • Deal      │ │ [View All]  │ • 92%         │     │
│         │  │   Closed    │ │             │ │   Success    │     │
│         │  └─────────────┘ └─────────────┘ └─────────────┘     │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### **4. Venture Management**

#### **Venture List View**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │  Venture Management                    [🔍] [+ Add]   │
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  Pipeline Stages                                │ │
│         │  │  [Intake: 12] [Screening: 8] [DD: 3] [Ready: 2] │ │
│  [📋]   │  └─────────────────────────────────────────────────┘ │
│  Ventures│                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│  [📊]   │  │  Ventures Table                                 │ │
│  GEDSI  │  │  ┌─────┬─────────┬─────────┬─────────┬──────┐   │ │
│         │  │  │Name │ Sector  │ Stage   │ GEDSI   │Actions│   │ │
│  [💰]   │  │  ├─────┼─────────┼─────────┼─────────┼──────┤   │ │
│  Capital│  │  │Green│ Clean   │Screening│ 75%     │[👁️]  │   │ │
│         │  │  │Tech │ Tech    │         │         │[✏️]  │   │ │
│  [📈]   │  │  ├─────┼─────────┼─────────┼─────────┼──────┤   │ │
│  Analytics│  │  │Eco  │ Agricul │ Due     │ 60%     │[👁️]  │   │ │
│         │  │  │Farm │ ture    │ Dilig.  │         │[✏️]  │   │ │
│  [👥]   │  │  ├─────┼─────────┼─────────┼─────────┼──────┤   │ │
│  Team   │  │  │Tech │ FinTech │ Ready   │ 90%     │[👁️]  │   │ │
│         │  │  │Start│         │         │         │[✏️]  │   │ │
│  [⚙️]   │  │  └─────┴─────────┴─────────┴─────────┴──────┘   │ │
│  Settings│  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│         │  │  Bulk Actions: [Select All] [Export] [Archive]  │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

#### **Venture Detail View**
```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │  GreenTech Solutions                    [✏️ Edit]    │
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  Venture Overview                               │ │
│         │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  [📋]   │  │  │ Stage:      │ │ GEDSI       │ │ Capital     │ │ │
│  Ventures│  │  │ Screening   │ │ Score: 75%  │ │ Needs:      │ │ │
│         │  │  │             │ │             │ │ $500K       │ │ │
│  [📊]   │  │  │ Sector:     │ │ Metrics:    │ │             │ │ │
│  GEDSI  │  │  │ Clean Tech  │ │ 3/5 Complete│ │ Timeline:   │ │ │
│         │  │  │             │ │             │ │ 6 months    │ │ │
│  [💰]   │  │  │ Location:   │ │             │ │             │ │ │
│  Capital│  │  │ Vietnam     │ │             │ │             │ │ │
│         │  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  [📈]   │  └─────────────────────────────────────────────────┘ │
│  Analytics│                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│  [👥]   │  │  Tabs: [Overview] [GEDSI] [Documents] [Activity]│ │
│  Team   │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│  [⚙️]   │  ┌─────────────────────────────────────────────────┐ │
│  Settings│  │  Content Area (Tab Content)                     │ │
│         │  │                                                 │ │
│         │  │  • Venture description and details              │ │
│         │  │  • Team information                             │ │
│         │  │  • Financial projections                        │ │
│         │  │  • Market analysis                              │ │
│         │  │  • Risk assessment                              │ │
│         │  │                                                 │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### **5. GEDSI Tracker**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │  GEDSI Integration                    [+ Add Metric]  │
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  GEDSI Overview                                 │ │
│         │  │  ┌─────────┬─────────┬─────────┬─────────┬──────┐ │ │
│  [📋]   │  │  │ Gender  │Disability│ Social  │Cross-   │Total │ │ │
│  Ventures│  │  │ 85%     │ 72%     │ 91%     │Cutting  │ 83%  │ │ │
│         │  │  │         │         │         │ 78%     │      │ │ │
│  [📊]   │  │  └─────────┴─────────┴─────────┴─────────┴──────┘ │ │
│  GEDSI  │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│  [💰]   │  ┌─────────────────────────────────────────────────┐ │
│  Capital│  │  Metrics by Venture                              │ │
│         │  │  ┌─────┬─────────┬─────────┬─────────┬─────────┐ │ │
│  [📈]   │  │  │Vent.│ Metric  │ Target  │ Current │ Status  │ │ │
│  Analytics│  │  │Name │ Code    │ Value   │ Value   │         │ │ │
│         │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│  [👥]   │  │  │Green│ OI.1    │ 100     │ 25      │ 🟡 In   │ │ │
│  Team   │  │  │Tech │ Women-  │ ventures│ ventures│ Progress│ │ │
│         │  │  │     │ led     │         │         │         │ │ │
│  [⚙️]   │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│  Settings│  │  │Eco  │ OI.2    │ 50      │ 15      │ 🟡 In   │ │ │
│         │  │  │Farm │ Disabil.│ ventures│ ventures│ Progress│ │ │
│         │  │  │     │ -incl.  │         │         │         │ │ │
│         │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│         │  │  │Tech │ OI.3    │ 200     │ 75      │ 🟢 Done │ │ │
│         │  │  │Start│ Rural   │ comm.   │ comm.   │         │ │ │
│         │  │  │     │ comm.   │         │         │         │ │ │
│         │  │  └─────┴─────────┴─────────┴─────────┴─────────┘ │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│         │  │  Progress Charts                                │ │
│         │  │  [Bar Chart] [Line Chart] [Pie Chart] [Export]  │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### **6. Capital Facilitation**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │  Capital Facilitation                  [+ New Deal]   │
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  Capital Overview                               │ │
│         │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  [📋]   │  │  │ Total       │ │ Active      │ │ Pipeline    │ │ │
│  Ventures│  │  │ Facilitated │ │ Deals       │ │ Value       │ │ │
│         │  │  │             │ │             │ │             │ │ │
│  [📊]   │  │  │ $25.5M      │ │ 12 Deals    │ │ $8.2M       │ │ │
│  GEDSI  │  │  │             │ │             │ │             │ │ │
│         │  │  │ +15% vs LY  │ │ 3 Closing   │ │ 8 Ventures  │ │ │
│  [💰]   │  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│  Capital│  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│  [📈]   │  ┌─────────────────────────────────────────────────┐ │
│  Analytics│  │  Active Deals                                  │ │
│         │  │  ┌─────┬─────────┬─────────┬─────────┬─────────┐ │ │
│  [👥]   │  │  │Vent.│ Type    │ Amount  │ Stage   │ Actions │ │ │
│  Team   │  │  │Name │         │         │         │         │ │ │
│         │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│  [⚙️]   │  │  │Green│ Equity  │ $500K   │ Term    │[👁️]    │ │ │
│  Settings│  │  │Tech │         │         │ Sheet   │[✏️]    │ │ │
│         │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│         │  │  │Eco  │ Grant   │ $200K   │ Due     │[👁️]    │ │ │
│         │  │  │Farm │         │         │ Dilig.  │[✏️]    │ │ │
│         │  │  ├─────┼─────────┼─────────┼─────────┼─────────┤ │ │
│         │  │  │Tech │ Debt    │ $300K   │ Closing │[👁️]    │ │ │
│         │  │  │Start│         │         │         │[✏️]    │ │ │
│         │  │  └─────┴─────────┴─────────┴─────────┴─────────┘ │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│         │  │  Investor Network                               │ │
│         │  │  [View All Investors] [Add Investor] [Reports]  │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### **7. Analytics Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│  🏛️ MIV │ [🔔] [👤 User] [⚙️]                                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │  Analytics & Insights                    [Export]     │
│         │                                                       │
│  [🏠]   │  ┌─────────────────────────────────────────────────┐ │
│  Dashboard│  │  Key Performance Indicators                    │ │
│         │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │ │
│  [📋]   │  │  │ Pipeline    │ │ GEDSI       │ │ Capital     │ │ │
│  Ventures│  │  │ Velocity    │ │ Impact      │ │ Efficiency  │ │ │
│         │  │  │             │ │             │ │             │ │ │
│  [📊]   │  │  │ 45 days     │ │ 83%         │ │ 92%         │ │ │
│  GEDSI  │  │  │ avg.        │ │ compliance  │ │ success     │ │ │
│         │  │  │             │ │             │ │ rate        │ │ │
│  [💰]   │  │  │ -12% vs LY  │ │ +8% vs LY   │ │ +5% vs LY   │ │ │
│  Capital│  │  └─────────────┘ └─────────────┘ └─────────────┘ │ │
│         │  └─────────────────────────────────────────────────┘ │
│  [📈]   │                                                       │
│  Analytics│  ┌─────────────────────────────────────────────────┐ │
│         │  │  Charts & Visualizations                          │ │
│  [👥]   │  │  ┌─────────────┐ ┌─────────────┐                 │ │
│  Team   │  │  │ Pipeline    │ │ GEDSI       │                 │ │
│         │  │  │ Funnel       │ │ Progress    │                 │ │
│  [⚙️]   │  │  │ Chart        │ │ Over Time   │                 │ │
│  Settings│  │  │             │ │             │                 │ │
│         │  │  │ [Visual]     │ │ [Visual]    │                 │ │
│         │  │  └─────────────┘ └─────────────┘                 │ │
│         │  │                                                   │ │
│         │  │  ┌─────────────┐ ┌─────────────┐                 │ │
│         │  │  │ Capital     │ │ Geographic  │                 │ │
│         │  │  │ Distribution│ │ Distribution│                 │ │
│         │  │  │             │ │             │                 │ │
│         │  │  │ [Visual]    │ │ [Visual]    │                 │ │
│         │  │  └─────────────┘ └─────────────┘                 │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
│         │  ┌─────────────────────────────────────────────────┐ │
│         │  │  Insights & Recommendations                      │ │
│         │  │  • Pipeline velocity improving by 12%            │ │
│         │  │  • GEDSI compliance above target                 │ │
│         │  │  • Capital efficiency at all-time high           │ │
│         │  └─────────────────────────────────────────────────┘ │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

## 🎯 Interactive Elements

### **1. Navigation Patterns**

#### **Breadcrumb Navigation**
```
Home > Dashboard > Venture Management > GreenTech Solutions
```

#### **Tab Navigation**
```
[Overview] [GEDSI] [Documents] [Activity] [Analytics]
```

#### **Context Menu**
```
┌─────────────────┐
│ View Details    │
│ Edit Venture    │
│ Archive         │
│ Export Data     │
│ Delete          │
└─────────────────┘
```

### **2. Form Patterns**

#### **Multi-step Form**
```
Step 1 of 4: Basic Information
┌─────────────────────────────────┐
│ Venture Name: [____________]     │
│ Sector: [Select Sector ▼]       │
│ Location: [____________]         │
│ Contact Email: [____________]    │
│                                 │
│ [Previous] [Next]               │
└─────────────────────────────────┘
```

#### **Inline Editing**
```
Venture Name: GreenTech Solutions [✏️]
Sector: Clean Tech [✏️]
Location: Ho Chi Minh City [✏️]
```

### **3. Data Visualization**

#### **Progress Indicators**
```
GEDSI Compliance: ████████░░ 80%
Capital Readiness: ██████████ 100%
Operational Readiness: ███████░░░ 70%
```

#### **Status Badges**
```
🟢 Active    🟡 Pending    🔴 Rejected
🟢 Complete  🟡 In Progress 🔴 Blocked
```

## 📱 Mobile Responsive Patterns

### **Mobile Navigation**
```
┌─────────────────┐
│ 🏛️ MIV          │
├─────────────────┤
│ [🏠] Dashboard   │
│ [📋] Ventures   │
│ [📊] GEDSI      │
│ [💰] Capital    │
│ [📈] Analytics  │
│ [👥] Team       │
│ [⚙️] Settings   │
└─────────────────┘
```

### **Mobile Card Layout**
```
┌─────────────────┐
│ GreenTech       │
│ Solutions       │
│                 │
│ Stage: Screening│
│ GEDSI: 75%      │
│                 │
│ [View] [Edit]   │
└─────────────────┘
```

## 🎨 Component Specifications

### **Button Hierarchy**
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-600);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

/* Secondary Button */
.btn-secondary {
  background: var(--secondary-100);
  color: var(--secondary-700);
  border: 1px solid var(--secondary-300);
  padding: 12px 24px;
  border-radius: 8px;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--secondary-600);
  padding: 12px 24px;
  border-radius: 8px;
}
```

### **Card Components**
```css
/* Data Card */
.card {
  background: white;
  border: 1px solid var(--secondary-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Interactive Card */
.card-interactive {
  background: white;
  border: 1px solid var(--secondary-200);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.card-interactive:hover {
  border-color: var(--primary-300);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}
```

### **Table Components**
```css
/* Data Table */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: var(--secondary-50);
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--secondary-700);
  border-bottom: 1px solid var(--secondary-200);
}

.table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--secondary-100);
}

.table tr:hover {
  background: var(--secondary-50);
}
```

This comprehensive wireframe guide provides detailed visual specifications for building a cohesive, user-friendly MIV platform that follows modern UX principles and enterprise design standards. 