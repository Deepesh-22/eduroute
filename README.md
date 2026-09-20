# EDUROUTE

### Academia–Industry Collaboration Portal for Skill Mapping, Internships & Placement

**Smart India Hackathon 2026 · Problem Statement SIH26044**  
*Portal for Academia – Industry collaboration for Skill Mapping, Internships and Placement*

[![SIH 2026](https://img.shields.io/badge/SIH-2026-violet)](https://www.sih.gov.in/)
[![PS](https://img.shields.io/badge/PS-SIH26044-indigo)](https://sih.gov.in/sih2026PS)
[![Category](https://img.shields.io/badge/Category-Software-blue)]()
[![Theme](https://img.shields.io/badge/Theme-Smart%20Education%20%2F%20Automation-purple)]()

**Live preview (PR):** https://deploy-preview-67--eduroutee.netlify.app

---

## 1. Problem we solve

There is a clear gap between **skills taught in colleges** and **skills expected by industry**.

| Stakeholder | Pain today |
|-------------|------------|
| **Students** | Unclear skill gaps, random internship applications, weak portfolios |
| **Industry** | Hard to find skill-matched candidates; noisy applications |
| **Colleges** | Low visibility into placement funnel and cohort skill gaps |

**EDUROUTE** is a unified portal that connects all three sides with skill assessment, mapping, matching, applications, and placement analytics.

---

## 2. Solution overview

```mermaid
flowchart LR
  subgraph Student
    A[Onboarding + Skill Assessment] --> B[Skill Profile]
    B --> C[Roadmaps / DSA / Buddy AI]
    B --> D[Matched Internships]
    D --> E[Apply + Track Status]
  end
  subgraph Industry
    F[Post Internship / Job] --> G[View Applicants]
    G --> H[Shortlist by Match %]
  end
  subgraph College
    I[Placement Dashboard]
    I --> J[Funnel + Cohort Gaps]
  end
  E --> G
  H --> I
  B --> I
```

---

## 3. Mapping to SIH26044

| SIH26044 requirement | EDUROUTE feature |
|----------------------|------------------|
| Skill assessment | Onboarding interest tracks + yes/no gap questions |
| Skill mapping | Skill Profile (scores, Good / Improve / Gap) + recommended next steps |
| Internship & job opportunities | Internships feed + Industry postings |
| Matching students ↔ openings | Match % on cards + “Recommended for you” |
| Application & tracking | Apply → Applied → Shortlisted → Interview → Hired |
| Industry collaboration | Industry workspace (`/industry`) |
| Institution visibility | College placement dashboard (`/college/placements`) |
| Learning support (value-add) | Roadmaps (animated Career Paths), DSA Sheet, Assessments, Buddy AI mentor |
| Student portfolio | Digital portfolio (skills, certs, projects, achievements) |
| Faculty collaboration | Faculty opportunities with official portal links (FDP / internship portals) |

---

## 4. Three-sided product

```mermaid
flowchart TB
  subgraph Roles
    S[Student]
    I[Industry / Recruiter]
    C[College / Placement Cell]
  end
  S -->|Skill Profile, Apply, Learn| P[EDUROUTE Portal]
  I -->|Post, Shortlist| P
  C -->|Funnel Analytics| P
```

| Role | Key screens |
|------|-------------|
| **Student** | Dashboard, Skill Profile, Internships, My Applications, Roadmaps (animated), Portfolio, DSA, Buddy AI |
| **Industry** | Post opening, applicant list, shortlist with match % |
| **College** | Placement counts, status funnel, cohort skill-gap snapshot |

---

## 5. Core user flow (demo path for jury)

```mermaid
sequenceDiagram
  participant St as Student
  participant ER as EDUROUTE
  participant In as Industry
  participant Co as College

  St->>ER: Signup + onboarding (interests + skill gaps)
  ER->>St: Skill Profile + recommendations
  St->>ER: Browse matched internships
  St->>ER: Apply
  In->>ER: Post job / view applicants
  In->>ER: Shortlist candidate
  Co->>ER: View placement funnel and skill gaps
```

**3-minute live demo order**

1. Student onboarding → **Skill Profile**  
2. **Internships** → Recommended + match % → **Apply**  
3. **My Applications** (status)  
4. **Industry** → post / shortlist  
5. **College placements** dashboard  

---

## 6. Feature map

```text
EDUROUTE
├── Student
│   ├── Auth + College ID verify (optional)
│   ├── AI onboarding (track + gap quiz)
│   ├── Skill Profile (scores, gaps, next steps)
│   ├── Dashboard (progress, applications shortcut)
│   ├── Internships
│   │   ├── Discrete match % (per-role scoring)
│   │   ├── Recommended for you
│   │   ├── Hero network constellation background
│   │   ├── Scroll + card entrance animations
│   │   └── Light / dark theme cards
│   ├── My Applications (status pipeline)
│   ├── Roadmaps / Career Paths
│   │   ├── Dual-side animated sine waves (upper hero)
│   │   ├── Continuous up–down wave oscillation
│   │   ├── Scroll-linked water drift
│   │   └── Staggered role cards (light / dark)
│   ├── Digital Portfolio (skills, certs, projects, internships)
│   ├── DSA Sheet (100 beginner problems)
│   ├── Assessments, Leaderboard, Rewards
│   └── Buddy AI + floating assistant
├── Faculty
│   ├── Faculty workspace & opportunities
│   └── Official portal links (AICTE ATAL, Internship, etc.)
├── Industry
│   ├── Workspace login
│   ├── Post internship / job (skills, stipend, location)
│   └── Applicants + shortlist
└── College / Admin
    ├── Placement dashboard (funnel metrics)
    └── Admin panel (approvals, courses)
```

---

## 6.1 PR #67 highlights (this branch)

Features implemented and polished on **PR #67** (`feature/onboarding-interest-gap`):

| Area | What judges will see |
|------|----------------------|
| **Career Paths / Roadmaps** | Animated dual-side sine waves in the upper hero; continuous **up–down oscillation** with clear intensity; waves also **drift while scrolling** (water-like flow); light & dark stroke colors; no arrow glyph |
| **Internships** | Hero-only network constellation background; card scroll / entrance animations; **discrete match scores** (not the same % on every card); recommended list; full light / dark theme support on cards |
| **Faculty opportunities** | Demo opportunities with **real official portal links** (e.g. AICTE ATAL Academy, AICTE Internship) for live jury walkthroughs |
| **Student portfolio** | Digital portfolio page (skills, certifications, projects, internships, achievements) linked from the sidebar |
| **Onboarding / skill gap** | Interest tracks + gap questions feeding Skill Profile and match recommendations |
| **Themes** | Roadmap waves and internship cards work in **light and dark** mode |

**Live preview:** https://deploy-preview-67--eduroutee.netlify.app  

**Suggested jury path on this preview**

1. Open **Roadmaps** → watch continuous wave motion and scroll the page  
2. Open **Internships** → check varied match %, recommended cards, theme toggle  
3. Faculty login → open an opportunity → **Official portal** link  
4. **Portfolio** from sidebar → skills / projects summary  

---

## 10. Why this approach wins for SIH

| Jury lens | How EDUROUTE responds |
|-----------|------------------------|
| **Problem clarity** | Directly addresses academia–industry skill gap |
| **Completeness** | Student + Industry + College in one product |
| **Working demo** | Full apply → shortlist → placement path |
| **Innovation** | Skill gap onboarding + match scoring + AI mentor |
| **Feasibility** | Built on standard web stack; deployable today |
| **Impact** | Employability, internship quality, college visibility |

---

## 7. Architecture (high level)

```mermaid
flowchart TB
  UI[React + Vite + Tailwind Frontend]
  NF[Netlify Functions]
  DB[(MySQL / Railway)]
  AI[AI Provider Groq / OpenAI / Gemini]
  LS[Browser localStorage - industry posts, applications, skill cache]

  UI --> NF
  UI --> LS
  NF --> DB
  NF --> AI
```

| Layer | Stack |
|-------|--------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Hosting | Netlify (static + serverless functions) |
| Auth / data | MySQL (Railway) via Netlify functions where configured |
| AI mentor | Buddy chat API + web-search fallback |
| Demo persistence | localStorage for industry posts, applications, DSA progress |

---

## 8. Tech stack

```text
Frontend     React 18 · TypeScript · Vite · Tailwind · Lucide
Routing      React Router
AI           Netlify Functions · Groq / OpenAI / Gemini adapters
Database     MySQL (Railway) for auth & buddy progress
Deploy       Netlify continuous deploy from GitHub
```

---

## 9. Project structure (simplified)

```text
eduroute_/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx          # Student home
│   │   ├── SkillProfile.tsx       # Skill scores & gaps
│   │   ├── Career/Internships.tsx # Match % + apply
│   │   ├── Industry/              # Recruiter workspace
│   │   ├── Admin/PlacementDashboard.tsx
│   │   ├── Buddy/BuddyChat.tsx
│   │   ├── DSASheet.tsx
│   │   ├── Roadmaps/
│   │   └── Auth/
│   ├── utils/
│   │   ├── onboardingStore.ts
│   │   ├── industryStore.ts
│   │   └── internshipApplications.ts
│   └── components/
├── netlify/functions/             # Auth, buddy, proxies
└── package.json
```

---

## 11. Future scope

- NSQF / NOS formal competency taxonomy  
- Faculty FDP & industrial training modules  
- Server-synced applications (shared live DB for all roles)  
- Verifiable digital credentials on portfolio  
- Deeper adaptive skill assessments  

---

## 12. Quick start (developers)

```bash
git clone https://github.com/laxmikhandelwal690-svg/eduroute_.git
cd eduroute_
npm install
npm run dev
```

Configure Netlify env (when using cloud auth / Buddy):

- `MYSQL_URL` or Railway MySQL vars  
- `JWT_SECRET`  
- `GROQ_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` (optional)

---

## 13. Team note

Built as a **software** solution for **SIH26044**, focused on a usable three-sided portal rather than a single student learning app.

**EDUROUTE — Learn · Map skills · Match · Get hired**
