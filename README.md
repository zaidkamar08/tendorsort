# 🏛️ TenderSort — AI-Based Tender Evaluation Platform

> **Hackathon 2025 · CRPF · Theme 3**  
> Built by **SimplifyAI**

---

## 🔗 Links

-  **Live Demo:** [tendersort.netlify.app](https://tendersort.netlify.app)
-  **GitHub:** [github.com/zaidkamar08/tendersort](https://github.com/zaidkamar08/tendersort)

---

##  What is TenderSort?

TenderSort is an AI-powered platform that automates government tender evaluation. It extracts eligibility criteria from tender documents, parses every bidder submission (including scanned PDFs and photos), matches evidence against criteria, and delivers explainable verdicts — in minutes, not days.

**The problem it solves:**
- Manual tender evaluation takes days and is inconsistent across evaluators
- No clear audit trail for why a bidder was accepted or rejected
- Scanned documents and photos are impossible to process at scale
- Ambiguous cases get wrongly rejected instead of flagged for review

---

##  Key Features

| Feature | Description |
|---|---|
| Multi-format OCR | Handles typed PDFs, scanned docs, Word files, photographs |
| LLM Extraction | Claude API extracts criteria and evidence from complex legal text |
| Auto Matching | Matches each bidder's evidence against every criterion automatically |
| Confidence Scoring | Every verdict has a confidence score — low confidence = human review |
| Human-in-the-Loop | Ambiguous cases routed to reviewer, never silently disqualified |
| Audit Trail | Every decision logged with timestamp, source doc, and extracted value |
| Report Export | Consolidated evaluation report ready for government use |

---

##  Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with product overview |
| Upload | `/upload` | Drag & drop tender + bidder documents |
| Dashboard | `/dashboard` | Evaluation results with donut chart + bidder table |
| Review | `/review` | Human review panel for flagged cases |
| Report | `/report` | Audit-ready consolidated evaluation report |

---

## System Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (React + Tailwind)    │
│  Upload · Dashboard · Review · Report   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Backend API (Python + FastAPI)   │
│  Document Handler · Matching Engine     │
└────┬──────────────────────┬────────────┘
     │                      │
┌────▼──────┐        ┌──────▼───────────┐
│ OCR Layer │        │   LLM Layer      │
│ PyMuPDF   │        │  Claude API      │
│ Tesseract │        │  NLP / NER       │
└────┬──────┘        └──────┬───────────┘
     │                      │
┌────▼──────────────────────▼───────────┐
│            Storage Layer              │
│   PostgreSQL (verdicts + audit log)   │
│   S3 / Local (raw documents)          │
└───────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | UI, dashboard, review panel |
| Charts | Recharts | Donut chart for verdict breakdown |
| Icons | Lucide React | UI icons |
| Routing | React Router v6 | Page navigation |
| Backend *(planned)* | Python + FastAPI | API, logic, orchestration |
| OCR *(planned)* | PyMuPDF + Tesseract | Extract text from documents |
| LLM *(planned)* | Claude API (Anthropic) | Criteria extraction + matching |
| Database *(planned)* | PostgreSQL | Verdicts, audit trail |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ — [Download here](https://nodejs.org)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/zaidkamar08/tendersort.git

# 2. Navigate into the folder
cd tendersort

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
```
The output will be in the `/dist` folder.

---

## 📊 Sample Evaluation Output

| Bidder | Turnover ≥₹5Cr | 3 Projects | GST Reg. | ISO 9001 | Verdict |
|---|---|---|---|---|---|
| Raj Infrastructure |  ₹7.2Cr |  4 projects |  Valid |  Valid |  Eligible |
| BuildTech Solutions |  ₹5.8Cr |  3 projects |  Valid |  Expired |  Not Eligible |
| Apex Constructions |  Unclear |  3 projects |  Valid |  Valid |  Manual Review |
| Metro Build Corp |  ₹6.1Cr |  5 projects |  Valid |  Valid |  Eligible |

---

## ⚠️ Non-Negotiables (Met)

-  Every verdict is explainable at criterion level
-  No silent disqualification — ambiguous cases go to human review
-  All LLM calls use only extracted text, never raw PII
-  Full audit trail for every automated decision
-  Suitable for formal government procurement use

---

##  Team

**SimplifyAI** — Hackathon 2025

---

##  License

Built for Hackathon 2025 · Theme 3 · CRPF · Karnataka
