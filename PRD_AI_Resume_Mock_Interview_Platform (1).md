# Product Requirements Document (PRD)
## AI Resume & Mock Interview Platform (Placement-Focused)

| Field | Detail |
|---|---|
| Document Owner | You (Founder/Developer) |
| Version | 1.0 |
| Date | July 27, 2026 |
| Status | Draft — Ready for Development |

---

## 1. Executive Summary

The **AI Resume & Mock Interview Platform** is a placement-preparation product for college students and job seekers. It combines:

1. **AI Resume Builder & ATS Analyzer** — build/upload a resume, get an ATS compatibility score, and receive AI-driven improvement suggestions tailored to a target job description (JD).
2. **AI Mock Interview Simulator** — practice technical, HR, and behavioral interviews with an AI interviewer (text or voice), get real-time follow-up questions, and receive a detailed post-interview feedback report.
3. **Progress Dashboard** — track resume score history, interview performance over time, weak areas, and a personalized improvement roadmap.

**Goal:** Help students go from "unprepared" to "placement-ready" through structured, AI-guided practice — positioned as a campus placement companion (can be sold to colleges/training institutes as B2B, or directly to students as B2C).

---

## 2. Problem Statement

- Students don't get enough real mock interview practice before placements; TPO/mentors can't scale 1:1 sessions to hundreds of students.
- Most resumes get rejected by ATS systems due to poor formatting/keyword mismatch, and students don't know why.
- Generic resume templates don't help students understand what recruiters for a *specific role/company* are looking for.
- Interview anxiety stems mostly from lack of practice with realistic, adaptive questioning — not just lack of knowledge.

## 3. Target Users

| Persona | Description | Primary Need |
|---|---|---|
| Final-year engineering/MBA student | Preparing for campus placements | Resume + mock interviews before drive |
| Job switcher (0–3 yrs exp) | Applying off-campus | ATS resume optimization, targeted JD prep |
| College Training & Placement Officer (TPO) | Manages placement prep for a batch | Bulk cohort tracking, analytics dashboard |
| Career coaching institutes | Offer placement training as a service | White-label / bulk licensing |

---

## 4. Goals & Success Metrics

| Goal | Metric (KPI) |
|---|---|
| Improve resume quality | Avg. ATS score improvement per user (target: +25 points within 3 iterations) |
| Improve interview readiness | Avg. mock interview score improvement over 5 sessions |
| Drive engagement | % users completing ≥1 resume analysis + ≥1 mock interview (activation rate) |
| Retention | 7-day and 30-day retention of active users |
| Monetization (if B2C/B2B) | Conversion rate from free tier to paid plan |

---

## 5. Scope — Core Features (MVP vs Later Phases)

### 5.1 MVP (Phase 1) Features

#### A. Authentication & Onboarding
- Sign up/login: Email+password, Google OAuth
- Onboarding: role/branch, target job role, experience level, target companies (optional)

#### B. AI Resume Builder & Analyzer
- Upload existing resume (PDF/DOCX) **or** build from scratch using guided templates
- Resume parsing → extract sections (contact, summary, education, skills, experience, projects, certifications)
- **ATS Score Engine**: score out of 100 based on:
  - Keyword match against a target Job Description (JD paste box)
  - Formatting checks (fonts, tables/images that break ATS parsers, section headers, length)
  - Action-verb usage, quantified achievements, grammar
- **AI Suggestions**: bullet-point rewrite suggestions ("Managed a team" → "Led a team of 5, improving delivery speed by 20%")
- Section-wise feedback (Skills gap vs JD, missing keywords, weak phrasing)
- Export improved resume as PDF/DOCX using clean ATS-safe templates (3–5 templates in MVP)
- Resume version history

#### C. AI Mock Interview Simulator
- Choose interview type: **Technical (role/skill-based)**, **HR/Behavioral**, **Company-specific** (if data available), **Aptitude/CS fundamentals**
- Choose mode: **Text chat** or **Voice** (speech-to-text + text-to-speech)
- AI asks role-relevant questions, listens/reads answer, asks adaptive follow-ups (probes shallow answers)
- Real-time or post-session feedback:
  - Content score (correctness, depth, structure — e.g., STAR method for behavioral)
  - Communication score (clarity, filler words, pacing — for voice mode)
  - Confidence/tone indicators (voice mode, using audio features — optional in MVP)
  - Sample "ideal answer" comparison
- Interview transcript + downloadable report (PDF)

#### D. Dashboard & Progress Tracking
- Resume score trend graph over versions
- Interview score trend by category (Technical/HR/Behavioral)
- Strength/weakness radar chart (Communication, Technical Depth, Confidence, Structure)
- Suggested next actions ("Practice 2 more DSA-round interviews", "Fix keyword gap in Skills section")

### 5.2 Phase 2 (Post-MVP)

- **JD-based custom question bank generation** (paste any JD → AI generates likely interview questions)
- **Company-specific interview patterns** (crowdsourced/curated question sets per company, e.g., TCS, Infosys, Amazon)
- **Peer mock interview matching** (student-to-student practice with AI as evaluator)
- **Video mode** — webcam-based mock interview with facial expression/eye-contact analysis
- **LinkedIn/GitHub profile analyzer** — cross-check resume claims against public profiles
- **TPO/Institute Admin Panel** — bulk student onboarding, cohort analytics, leaderboard, CSV export
- **Gamification** — streaks, badges, leaderboard among peers/batch
- **Resume-to-JD auto-tailoring** — one click regenerate resume bullets tailored to a pasted JD
- **Aptitude & coding round practice module** integration

### 5.3 Explicitly Out of Scope (for now)
- Actual job application/ATS submission integration (e.g., auto-apply to Naukri/LinkedIn)
- Live human mentor marketplace
- Salary negotiation simulator

---

## 6. User Flows (Key Journeys)

### Flow 1: Resume Analysis
```
Sign up/Login → Upload/Build Resume → Paste target JD (optional)
   → AI parses & scores → View ATS Score + detailed feedback
   → Apply suggested edits (inline editor) → Re-score → Export PDF/DOCX
```

### Flow 2: Mock Interview
```
Dashboard → "Start Mock Interview" → Select type + role + mode (text/voice)
   → AI asks Q1 → User answers → AI follow-up (adaptive) → ... (8-12 Qs)
   → Session ends → AI generates feedback report → Saved to Dashboard history
```

### Flow 3: Progress Review
```
Dashboard → View trend charts → Click into a past interview → Review transcript + feedback
   → Get "recommended next practice" → Start new session
```

---

## 7. Functional Requirements (Detailed)

### 7.1 Resume Module
| ID | Requirement |
|---|---|
| FR-1.1 | System shall accept resume upload in PDF and DOCX, max 5MB |
| FR-1.2 | System shall parse resume into structured JSON (contact, summary, education, experience, skills, projects, certifications) |
| FR-1.3 | System shall allow pasting a Job Description (plain text, max 5000 chars) |
| FR-1.4 | System shall compute ATS score (0–100) using keyword-match + formatting + content-quality sub-scores |
| FR-1.5 | System shall generate at least 5 actionable improvement suggestions per analysis |
| FR-1.6 | System shall allow in-app editing of resume content with live re-scoring |
| FR-1.7 | System shall export final resume as PDF and DOCX in ATS-safe layout |
| FR-1.8 | System shall store version history (min. last 10 versions per user) |

### 7.2 Mock Interview Module
| ID | Requirement |
|---|---|
| FR-2.1 | System shall support text-based Q&A interview sessions |
| FR-2.2 | System shall support voice-based sessions (speech-to-text input, text-to-speech AI voice output) |
| FR-2.3 | System shall generate interview questions based on selected role/domain/skill and (optionally) uploaded resume + JD |
| FR-2.4 | System shall ask adaptive follow-up questions based on the user's previous answer |
| FR-2.5 | System shall score each answer on defined rubrics (correctness, structure, depth, communication) |
| FR-2.6 | System shall generate a final report: overall score, category-wise scores, strengths, weaknesses, ideal-answer samples |
| FR-2.7 | System shall store full transcript + audio (if voice mode) linked to user account |
| FR-2.8 | System shall allow session pause/resume (session state persistence) |

### 7.3 Dashboard Module
| ID | Requirement |
|---|---|
| FR-3.1 | System shall display resume score history as a line/trend chart |
| FR-3.2 | System shall display interview performance by category over time |
| FR-3.3 | System shall recommend next best action based on weakest metric |
| FR-3.4 | (Phase 2) System shall provide TPO admin view aggregating cohort-level stats |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Resume analysis result within 8–10 seconds; interview question response within 3–5 seconds |
| Scalability | Support concurrent mock interview sessions (target: 500+ concurrent in Phase 2) via async job queues |
| Availability | 99.5% uptime target |
| Security | Encrypt resumes/PII at rest (AES-256) and in transit (TLS 1.2+); JWT-based auth with refresh tokens |
| Privacy | Users can delete their data/account (GDPR-style data deletion); resumes not used to train third-party models without consent |
| Accessibility | WCAG 2.1 AA basics — keyboard navigation, alt text, color contrast |
| Localization | English primarily; Hinglish/Hindi UI toggle as a stretch goal |
| Cost control | Cache AI responses where possible; use cheaper models for parsing, stronger models only for scoring/feedback generation |

---

## 9. System Architecture (High Level)

```
                         ┌───────────────────────────┐
                         │        Frontend (Web)      │
                         │  Next.js + React + Tailwind│
                         └──────────────┬─────────────┘
                                        │ REST/GraphQL (HTTPS)
                         ┌──────────────▼─────────────┐
                         │        API Gateway /        │
                         │        Backend (Node/FastAPI)│
                         └───┬───────────┬──────────┬──┘
                             │           │          │
             ┌───────────────▼──┐  ┌─────▼────┐ ┌───▼───────────────┐
             │ Auth Service      │  │ Resume   │ │ Interview Engine   │
             │ (JWT/OAuth)       │  │ Service  │ │ Service            │
             └───────┬───────────┘  └────┬─────┘ └─────────┬──────────┘
                     │                   │                 │
                     │            ┌──────▼──────┐   ┌──────▼───────┐
                     │            │ Resume Parser│   │ LLM Orchestr.│
                     │            │ (pdf/docx →  │   │ (Claude/OpenAI│
                     │            │  structured) │   │  API calls)  │
                     │            └──────┬──────┘   └──────┬───────┘
                     │                   │                 │
                     │            ┌──────▼─────────────────▼───────┐
                     │            │      Speech Services (Voice)    │
                     │            │  STT (Whisper) + TTS (ElevenLabs/│
                     │            │  Azure/Google TTS)               │
                     │            └──────────────┬───────────────────┘
                     │                            │
             ┌───────▼────────────────────────────▼───────┐
             │              Database Layer                 │
             │  PostgreSQL (users, resumes, interviews,     │
             │  scores) + Object Storage (S3/GCS for files, │
             │  audio) + Redis (session state, caching)     │
             └───────────────────────────────────────────────┘
                     │
             ┌───────▼───────────┐
             │ Background Workers │
             │ (BullMQ/Celery)    │
             │ - scoring jobs     │
             │ - report generation│
             │ - email/notif      │
             └────────────────────┘
```

---

## 10. Tech Stack Recommendation

### 10.1 Frontend
| Layer | Tech |
|---|---|
| Framework | **Next.js (React)** — SSR for SEO on landing/marketing pages, SPA behavior for app |
| Styling | **Tailwind CSS** + shadcn/ui component library |
| State Management | React Query (server state) + Zustand (light client state) |
| Charts | Recharts or Chart.js (score trend graphs, radar charts) |
| Voice UI | Web Speech API (browser) fallback + custom recorder using MediaRecorder API |
| Resume Editor | Rich text/block editor — Tiptap or a custom form-based structured editor |
| Auth UI | NextAuth.js (supports Google OAuth + credentials) |
| Hosting | Vercel (frontend) |

### 10.2 Backend
| Layer | Tech |
|---|---|
| Primary API | **Node.js + Express/NestJS** (good ecosystem for real-time + file handling) — *or* **Python FastAPI** if your team is stronger in Python (better for AI/ML glue code) |
| Real-time (voice interview streaming) | WebSockets (Socket.IO) or Server-Sent Events for streaming AI responses |
| Background Jobs | BullMQ (Node) or Celery (Python) + Redis as broker |
| Auth | JWT (access + refresh tokens), bcrypt for password hashing, Google OAuth2 |
| File Handling | Multer (Node) for uploads; virus scan (ClamAV) optional |
| API Docs | OpenAPI/Swagger |
| Hosting | Render / Railway / AWS (EC2 or ECS Fargate) |

### 10.3 AI / ML Layer
| Function | Tool/Approach |
|---|---|
| Resume parsing (PDF/DOCX → text) | `pdf-parse`, `mammoth` (docx), or Python `pdfplumber` / `python-docx` |
| Resume structuring (text → JSON sections) | LLM call (Claude/GPT) with structured-output prompt, or a fine-tuned NER model for scale/cost savings |
| ATS scoring logic | Hybrid: rule-based checks (formatting, section presence, keyword match via TF-IDF/embedding similarity) + LLM-based qualitative scoring |
| Resume bullet rewriting suggestions | LLM (Claude API / OpenAI API) with few-shot prompting |
| Interview question generation | LLM prompted with role + JD + resume context |
| Adaptive follow-up logic | LLM with conversation memory (maintain interview transcript in context window) |
| Answer evaluation/scoring | LLM rubric-based scoring (structured JSON output: scores + reasoning) |
| Speech-to-Text (STT) | Whisper API (OpenAI) or Deepgram/AssemblyAI |
| Text-to-Speech (TTS) | ElevenLabs, Azure Speech, or Google Cloud TTS |
| Embeddings (for keyword/skill matching, JD-resume similarity) | OpenAI/Voyage/Cohere embeddings + cosine similarity, stored in a vector DB |
| Vector DB (for JD/question bank search, Phase 2) | pgvector (Postgres extension) — simplest to start, avoids extra infra |

> Note: You can start fully on one LLM provider's API (e.g., Anthropic Claude API or OpenAI API) and abstract the calls behind an internal "AI Service" module so you can swap/add providers later without touching business logic.

### 10.4 Database Schema (Core Tables)

```
users
 ├─ id, name, email, password_hash, oauth_provider, role (student/tpo/admin)
 ├─ target_role, branch, graduation_year, created_at

resumes
 ├─ id, user_id (FK), version_number, raw_file_url, parsed_json,
 ├─ ats_score, jd_text, created_at

resume_feedback
 ├─ id, resume_id (FK), category (formatting/keywords/content),
 ├─ suggestion_text, severity, resolved (bool)

interview_sessions
 ├─ id, user_id (FK), type (technical/hr/behavioral), mode (text/voice),
 ├─ role_target, status (in_progress/completed), overall_score,
 ├─ started_at, completed_at

interview_qa
 ├─ id, session_id (FK), question_text, answer_text, answer_audio_url,
 ├─ score_content, score_communication, feedback_text, sequence_no

score_history  (materialized/aggregated for dashboard perf)
 ├─ id, user_id (FK), metric_type (resume/interview), score, recorded_at

subscriptions (if monetized)
 ├─ id, user_id (FK), plan, status, started_at, expires_at
```

### 10.5 Infrastructure & DevOps
| Component | Tool |
|---|---|
| File/Object Storage | AWS S3 / Cloudflare R2 (resumes, audio recordings) |
| CDN | Cloudflare |
| CI/CD | GitHub Actions |
| Monitoring/Logging | Sentry (errors) + Better Stack/Grafana (metrics/logs) |
| Rate Limiting | Redis-based limiter on AI-heavy endpoints (cost control) |
| Secrets Management | Environment variables via Doppler / AWS Secrets Manager |
| Containerization | Docker (for backend + workers), docker-compose for local dev |

---

## 11. API Design (Sample Endpoints)

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/google

POST   /api/resume/upload              → returns parsed structure + initial ATS score
POST   /api/resume/:id/analyze         → body: { jdText } → returns ATS score + suggestions
PATCH  /api/resume/:id                 → update sections after edits
GET    /api/resume/:id/export?format=pdf|docx
GET    /api/resume/history

POST   /api/interview/start            → body: { type, mode, targetRole, jdText? }
POST   /api/interview/:sessionId/answer→ body: { answerText | audioFile } → returns next question / follow-up
POST   /api/interview/:sessionId/end   → triggers final report generation
GET    /api/interview/:sessionId/report
GET    /api/interview/history

GET    /api/dashboard/summary          → aggregated scores/trends for logged-in user
GET    /api/admin/cohort/:cohortId     → (Phase 2, TPO role only)
```

---

## 12. Monetization Strategy (Optional but Recommended)

| Tier | Features | Target |
|---|---|---|
| **Free** | 1 resume analysis/month, 2 mock interviews/month, basic dashboard | Individual students, acquisition funnel |
| **Pro (₹199–₹499/month)** | Unlimited resume analyses, unlimited mock interviews, voice mode, downloadable reports, JD-tailoring | Serious job seekers |
| **Campus/Institute License** | Bulk seats, TPO admin dashboard, cohort analytics, white-label branding | Colleges, training institutes |

---

## 13. Rollout Plan / Milestones

| Phase | Duration (suggested) | Deliverables |
|---|---|---|
| **Phase 0 — Setup** | Week 1–2 | Repo setup, architecture finalization, DB schema, auth flow |
| **Phase 1 — Resume Module MVP** | Week 3–6 | Upload/parse resume, ATS scoring, suggestions, export |
| **Phase 2 — Mock Interview (Text)** | Week 7–10 | Text-based interview flow, scoring, report generation |
| **Phase 3 — Mock Interview (Voice)** | Week 11–13 | STT/TTS integration, voice session UX |
| **Phase 4 — Dashboard & Polish** | Week 14–16 | Trend charts, recommendations engine, UI polish, beta launch |
| **Phase 5 — Phase 2 Features** | Post-launch | JD-based question bank, company-specific prep, TPO panel, gamification |

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| AI API costs scale with usage | Use cheaper models for parsing/formatting checks; reserve premium LLM calls for scoring/feedback; cache repeated JD analyses |
| Inconsistent AI scoring (non-deterministic) | Use structured rubric prompts + low temperature + validate output schema; consider a lightweight human-review flag for edge cases |
| Resume parsing accuracy on varied formats | Support well-known ATS-safe templates first; show "manual correction" UI for parsing errors |
| Voice mode latency/UX issues | Start with text-mode MVP; add voice once core scoring logic is validated |
| Data privacy concerns (resumes are sensitive) | Clear privacy policy, encryption at rest, easy data deletion, no third-party training use without consent |

---

## 15. Open Questions (To Decide Before/During Build)

1. B2C (direct to students) vs B2B (sell to colleges) as the primary go-to-market — impacts admin panel priority.
2. Which LLM provider to standardize on (cost vs quality trade-off) — recommend abstracting this early regardless.
3. Do you want company-specific question banks to be curated manually (higher quality, more effort) or fully AI-generated from JD (faster, less differentiated)?
4. Voice mode — is real-time conversational feel (interruptible, streaming) needed for MVP, or is turn-based (record → transcribe → respond) acceptable for v1? (Turn-based is far simpler/cheaper to build first.)

---

## 16. Appendix — Suggested Free/Low-Cost Tool Substitutes (for solo/small-team build)

| Need | Free/Cheap Option |
|---|---|
| Hosting frontend | Vercel free tier |
| Hosting backend | Railway/Render free-tier or low-cost tier |
| Database | Supabase (Postgres + Auth + Storage, generous free tier) — can replace custom auth + S3 + Postgres in one |
| LLM | Anthropic Claude API / OpenAI API (pay-as-you-go, start with small budget + caching) |
| STT | OpenAI Whisper API (cheap per-minute pricing) |
| TTS | Browser-native Web Speech API (free) for MVP, upgrade to ElevenLabs later for quality |
| PDF export | `pdf-lib` or `puppeteer` (HTML → PDF) |

