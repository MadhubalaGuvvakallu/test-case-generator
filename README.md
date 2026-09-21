# MELO — AI-Powered Test Case Generation

MELO is a full-stack web application that ingests software requirements (user stories, feature descriptions, uploaded documents) and uses OpenAI GPT-4 to automatically generate comprehensive, structured test artifacts: workflows, business rules, user stories, and test cases.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [Application Flow](#application-flow)
9. [Architecture](#architecture)
10. [API Reference](#api-reference)
11. [AI Integration Strategy](#ai-integration-strategy)
12. [Features](#features)
13. [Contributing](#contributing)

---

## Overview

MELO transforms raw requirements into a full QA artifact pipeline through a conversational chat interface:

```
Requirements → Workflows → Rules → User Stories → Test Cases → Export
```

Users interact through a chat interface powered by an AI assistant that guides them through each step, from project creation to exporting approved test cases to JSON, CSV, or Jira.

---

## Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 18, Vite 5, React Router 6, React Icons |
| Backend    | Node.js 18+, Express 4                        |
| Database   | MongoDB 6+ via Mongoose 8                     |
| AI         | OpenAI GPT-4o (`response_format: json_object`) |
| File Upload| Multer                                        |
| PDF Parse  | pdf-parse@1                                   |
| Security   | Helmet, CORS, express-validator               |

---

## Project Structure

```
melo/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx                  # Root router
│       ├── main.jsx                 # ReactDOM entry point
│       ├── context/
│       │   └── AppContext.jsx       # Global state (useReducer)
│       ├── hooks/
│       │   ├── useChat.js           # Chat state & message helpers
│       │   ├── useProject.js        # Project creation & context upload
│       │   └── useGeneration.js     # AI generation pipeline controls
│       ├── services/
│       │   └── api.js               # Axios instance + all API calls
│       ├── components/
│       │   ├── layout/              # Sidebar, TopBar, Layout
│       │   ├── chat/                # ChatWindow, ChatMessage, ChatInput
│       │   ├── project/             # ProjectCard, ProjectNameInput, AssociateContext
│       │   ├── generation/          # TestDesignOptimization, GeneratedWorkflows,
│       │   │                        # WorkflowItem, WorkflowVisualMap,
│       │   │                        # GeneratedRules, GeneratedUserStories,
│       │   │                        # GeneratedTestCases
│       │   ├── export/              # ExportTestCases
│       │   └── common/              # Modal, Badge, ActionToolbar
│       ├── pages/
│       │   └── Home.jsx             # Chat flow orchestrator
│       └── styles/
│           └── global.css           # All styles (no external CSS framework)
│
└── server/                          # Node.js / Express backend
    ├── .env.example
    ├── package.json
    └── src/
        ├── app.js                   # Express setup, middleware, routes
        ├── config/
        │   └── database.js          # Mongoose connection
        ├── models/                  # Mongoose schemas
        │   ├── Project.js
        │   ├── Workflow.js
        │   ├── Rule.js
        │   ├── UserStory.js
        │   └── TestCase.js
        ├── controllers/             # Route handlers
        │   ├── projectController.js
        │   ├── generationController.js
        │   ├── workflowController.js
        │   ├── rulesController.js
        │   ├── userStoriesController.js
        │   ├── testcaseController.js
        │   └── exportController.js
        ├── routes/                  # Express routers
        │   ├── projects.js
        │   ├── generation.js
        │   ├── workflows.js
        │   ├── rules.js
        │   ├── userStories.js
        │   ├── testcases.js
        │   └── export.js
        ├── services/
        │   ├── aiService.js         # OpenAI integration
        │   ├── fileService.js       # File reading & requirements building
        │   └── exportService.js     # JSON/CSV serialisation
        └── middleware/
            ├── errorHandler.js      # Global error handler
            ├── validateRequest.js   # express-validator result checker
            └── uploadMiddleware.js  # Multer configuration
```

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **MongoDB** ≥ 6.0 (local or Atlas)
- **OpenAI API key** with access to `gpt-4o` (or `gpt-4`)
- **npm** ≥ 9 (or pnpm / yarn)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/melo.git
cd melo
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

> **Note:** `pdf-parse@1` is included in `server/package.json` and is installed automatically by `npm install`. Do **not** run `npm install pdf-parse` without the `@1` version tag — v2 has an incompatible API and will break PDF extraction.

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

---

## Configuration

Copy the example environment file and populate it:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/melo   # or your Atlas connection string
OPENAI_API_KEY=sk-...                        # Your OpenAI API key
NODE_ENV=development
MAX_FILE_SIZE=10485760                        # 10 MB in bytes
CORS_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads                           # Relative to server/
```

### Environment Variables Reference

| Variable         | Required | Default                            | Description                             |
|------------------|----------|------------------------------------|-----------------------------------------|
| `PORT`           | No       | `5000`                             | Express server port                     |
| `MONGODB_URI`    | Yes      | —                                  | MongoDB connection string               |
| `OPENAI_API_KEY` | Yes      | —                                  | OpenAI secret key                       |
| `NODE_ENV`       | No       | `development`                      | `development` or `production`           |
| `MAX_FILE_SIZE`  | No       | `10485760`                         | Max upload size in bytes (10 MB)        |
| `CORS_ORIGIN`    | No       | `http://localhost:5173`            | Allowed frontend origin                 |
| `UPLOAD_DIR`     | No       | `uploads`                          | Upload directory (relative to `server/`) |

---

## Running the Application

### Development mode (two terminals)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev       # nodemon watches for changes
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev       # Vite dev server at http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`, so no manual CORS tweaking is needed during development.

### Production build

```bash
# Build frontend
cd client
npm run build     # Output in client/dist/

# Serve backend (point it to serve the dist folder or use a reverse proxy)
cd ../server
NODE_ENV=production node src/app.js
```

---

## Application Flow

MELO uses a **conversational state machine** with 9 steps:

| Step | State | Panel / Action |
|------|-------|----------------|
| 1 | `WELCOME` | Welcome message; user types "new project" |
| 2 | `PROJECT_NAME` | `ProjectNameInput` — enter project name |
| 3 | `CONTEXT_UPLOAD` | `ProjectCard` + `AssociateContext` — upload files / paste description |
| 4 | `GENERATION_OPTIONS` | `TestDesignOptimization` — choose format, technique, outputs |
| 5 | `REVIEWING_WORKFLOWS` | `GeneratedWorkflows` — review & approve AI-generated workflows |
| 6 | `REVIEWING_RULES` | `GeneratedRules` — review, edit, bulk approve rules |
| 7 | `REVIEWING_USER_STORIES` | `GeneratedUserStories` — review user stories |
| 8 | `REVIEWING_TEST_CASES` | `GeneratedTestCases` — review, edit, bulk approve test cases |
| 9 | `EXPORT` | `ExportTestCases` — download as JSON / CSV or push to Jira |

Each step is driven by the `AppContext` (React `useReducer`) and wired through custom hooks (`useProject`, `useGeneration`, `useChat`).

---

## Architecture

### Component Architecture

```
App
└── AppProvider (context)
    └── Layout
        ├── Sidebar
        ├── TopBar
        └── Home (page, state machine)
            ├── ChatWindow
            │   ├── ChatMessage[]  ← text + inline React panels
            │   └── ChatInput
            └── Panels (injected into chat stream):
                ProjectNameInput → ProjectCard → AssociateContext →
                TestDesignOptimization → GeneratedWorkflows →
                GeneratedRules → GeneratedUserStories →
                GeneratedTestCases → ExportTestCases
```

### State Management

Global state lives in [`AppContext`](client/src/context/AppContext.jsx) using `useReducer`. All state mutations are dispatched through typed action creators exposed by the context. No external state library (Redux, Zustand) is needed.

### API Design (RESTful)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects` | List all active projects |
| `GET` | `/api/projects/:id` | Get a single project |
| `POST` | `/api/projects/:id/context` | Upload context files + description |
| `PATCH` | `/api/projects/:id/archive` | Archive a project |
| `POST` | `/api/generation/:projectId` | **Trigger AI generation** (main call) |
| `POST` | `/api/generation/:projectId/regenerate` | Regenerate with feedback |
| `GET` | `/api/workflows/:projectId` | Get all workflows for a project |
| `GET` | `/api/workflows/detail/:id` | Get a single workflow |
| `PATCH` | `/api/workflows/:id/approve` | Approve one workflow |
| `POST` | `/api/workflows/approve-all` | Approve all workflows |
| `DELETE` | `/api/workflows/:id` | Delete a workflow |
| `GET` | `/api/rules/:projectId` | Get rules (optional `?workflowId=`) |
| `PATCH` | `/api/rules/:id` | Update a rule |
| `PATCH` | `/api/rules/:id/approve` | Approve one rule |
| `DELETE` | `/api/rules/:id` | Delete a rule |
| `POST` | `/api/rules/bulk-approve` | Bulk approve rules |
| `DELETE` | `/api/rules/bulk-delete` | Bulk delete rules |
| `GET` | `/api/user-stories/:projectId` | Get user stories |
| `PATCH` | `/api/user-stories/:id` | Update a user story |
| `PATCH` | `/api/user-stories/:id/approve` | Approve one user story |
| `POST` | `/api/user-stories/bulk-approve` | Bulk approve user stories |
| `GET` | `/api/test-cases/:projectId` | Get test cases |
| `GET` | `/api/test-cases/detail/:id` | Get a single test case |
| `PATCH` | `/api/test-cases/:id` | Update a test case |
| `PATCH` | `/api/test-cases/:id/approve` | Approve one test case |
| `DELETE` | `/api/test-cases/:id` | Delete a test case |
| `POST` | `/api/test-cases/bulk-approve` | Bulk approve test cases |
| `DELETE` | `/api/test-cases/bulk-delete` | Bulk delete test cases |
| `POST` | `/api/export/:projectId/json` | Export approved test cases as JSON |
| `POST` | `/api/export/:projectId/csv` | Export approved test cases as CSV |

### Database Schema Overview

```
Project
  ├── name, status, healthScore
  ├── contextFiles[]  (filename, originalName, size, mimetype)
  ├── contextDescription
  ├── knowledgeGraphName
  └── totalTestCases

Workflow  → projectId (Project)
  ├── name, description, status
  ├── rulesCount, userStoriesCount, testCasesCount
  └── nodes[]  (id, type, label, x, y, connections[])

Rule  → projectId, workflowId
  ├── text, tags[], status, priority

UserStory  → projectId, workflowId
  ├── title, description, acceptanceCriteria[], tags[], status

TestCase  → projectId, workflowId, userStoryId
  ├── title, description, type, format, priority, status
  ├── steps[]  (stepNumber, action, expectedResult)
  ├── preconditions[], tags[]
```

---

## AI Integration Strategy

### Prompt Engineering

[`aiService.js`](server/src/services/aiService.js) uses structured prompts that:

1. Set a QA-expert **system role** to steer the model towards precise, structured output.
2. Include the **requirements text** (from uploaded files or typed description).
3. Specify the desired **format** (Standard / BDD / BDD 2.0), design **category**, and **technique**.
4. Demand a **single JSON object** as the only output, enforced by `response_format: { type: "json_object" }`.

### JSON Enforcement

The OpenAI `json_object` response format guarantees valid JSON. The prompt explicitly defines the expected schema, and the service validates that `workflows` is a non-empty array before saving to MongoDB.

### Error Handling & Retries

The `callWithRetry` helper retries up to 3 times with **exponential backoff** for:
- `429 Too Many Requests` (rate limits)
- `5xx` server errors from OpenAI

### Generation Pipeline

```
POST /api/generation/:projectId
  1. Load Project → build requirements text from contextFiles + contextDescription
  2. Call OpenAI GPT-4o with structured prompt
  3. Parse JSON response
  4. For each workflow in response:
     a. Create Workflow document
     b. Bulk-insert Rules
     c. Bulk-insert UserStories
     d. Bulk-insert TestCases (linked to workflow + random story)
  5. Compute health score heuristic
  6. Update Project.totalTestCases + Project.healthScore
  7. Return all created workflows
```

---

## Features

- **Conversational UI** — guided step-by-step flow via a chat interface
- **AI generation** — GPT-4o generates 3–7 workflows with rules, user stories, and test cases in a single prompt
- **Inline panels** — React components injected into the chat stream at the right moment
- **Test design options** — Standard, BDD (Gherkin), or BDD 2.0 format; design category and technique selectors
- **Visual workflow map** — SVG diagram of workflow nodes and connections with zoom controls
- **Bulk operations** — multi-select approve / delete for rules, test cases
- **Inline edit** — edit rule text or test case title directly in the list
- **Context upload** — upload TXT, PDF (text-based), JSON, Markdown, CSV, HTML/XML files as requirements; PDF text is extracted via `pdf-parse@1`
- **Export** — download approved test cases as JSON or CSV
- **Responsive layout** — sidebar collapses on mobile viewports
- **Error resilience** — OpenAI rate-limit retries; global Express error handler with Mongoose error mapping

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Style

- Backend: CommonJS modules, `async/await`, early-return pattern in controllers
- Frontend: ES modules, functional React components, custom hooks for all side effects
- No Tailwind or UI framework — all styles in [`global.css`](client/src/styles/global.css)

---

## License

MIT
