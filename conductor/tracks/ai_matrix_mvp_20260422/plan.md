# Implementation Plan: Core Strategic Engine & Interactive Matrix MVP

## Phase 1: Foundation & Core Logic
- [ ] **Task: Scaffold Next.js Project with Tailwind and TypeScript**
    - [ ] Initialize project with App Router.
    - [ ] Configure Tailwind with the "Modern Dark" palette.
    - [ ] Install dependencies: `zustand`, `framer-motion`, `d3`, `lucide-react`.
- [ ] **Task: Implement the Bocconi Calculation Engine**
    - [ ] Write tests for feasibility and impact scoring logic (including malus rules).
    - [ ] Implement `calculateFeasibility` and `calculateImpact` functions.
- [ ] **Task: Setup Centralized State Management (Zustand)**
    - [ ] Define the `useAssessmentStore` for managing initiative data and scores.
    - [ ] Implement LocalStorage persistence middleware.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Foundation & Core Logic' (Protocol in workflow.md)**

## Phase 2: Bespoke Strategic Visualization
- [ ] **Task: Create the D3.js Strategic Matrix Component**
    - [ ] Implement 3x3 grid rendering with responsive scaling.
    - [ ] Add axes labels (Basso, Medio, Alto) and quadrant indicators.
- [ ] **Task: Implement the Dynamic "Initiative Dot"**
    - [ ] Connect Matrix to Zustand state.
    - [ ] Use Framer Motion for smooth dot transitions between coordinates.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Bespoke Strategic Visualization' (Protocol in workflow.md)**

## Phase 3: Smart Data Entry & Narrative
- [ ] **Task: Implement the Progressive Revelation Stepper**
    - [ ] Create the multi-step form container.
    - [ ] Build custom "Strategy Slider" components (1-5 scales).
- [ ] **Task: Integrate Narrative Sidebars**
    - [ ] Add "Strategic Rationale" text fields for each variable.
    - [ ] Implement interactive tooltips on the Matrix to reveal rationales.
- [ ] **Task: Implement JSON Export/Import**
    - [ ] Build utility to save assessment as `.json` and reload it.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Smart Data Entry & Narrative' (Protocol in workflow.md)**
