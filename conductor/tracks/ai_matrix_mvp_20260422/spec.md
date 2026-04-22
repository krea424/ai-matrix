# Specification: Core Strategic Engine & Interactive Matrix MVP

## 1. Overview
This track implements the foundational "Bocconi Logic" for the AI Matrix and the initial "Modern Dark" interactive visualization. It enables a senior consultant to evaluate an AI initiative and see its strategic position in real-time.

## 2. Strategic Requirements
- **Input Framework:** 12 variables (7 Feasibility, 5 Impact) as defined by SDA Bocconi.
- **Logic Engine:** Weighted scores, threshold logic (Basso/Medio/Alto), and specific "Malus" rules.
- **Visualization:** 3x3 Grid Matrix (Impact vs Feasibility) using D3.js.
- **UX:** Progressive Revelation stepper for variable input.

## 3. Technical Components

### 3.1 The Calculation Engine (Bocconi Logic)
- **Feasibility (35pts max):**
  - Variables: Technical Maturity, Infrastructure, Data Consistency, Regulation, Ethics, Finance, Competences.
  - Malus Rule: 50% weight to Infrastructure, Regulation, or Competences if score ≤ 2.
- **Impact (25pts max):**
  - Variables: Business Consistency, Economic, Organizational, Client, Learning.
  - Malus Rule: Learning Impact halved if total of others ≤ 6.

### 3.2 The Visualization (D3.js)
- Responsive SVG container.
- 3x3 grid with labeled axes.
- Dynamic "Initiative Dot" with Framer Motion animations for position updates.

### 3.3 The Data Entry (React/Zustand)
- Multi-step form (Stepper).
- Custom slider components for qualitative scores (1-5).
- Real-time sync between form state and Matrix visualization.

## 4. Acceptance Criteria
- Calculation engine results match the Excel framework for test cases.
- Matrix correctly renders the 3x3 grid and positions the dot based on scores.
- Data persists in LocalStorage across page reloads.
- UI follows the "Modern Dark Strategy" (Deep Obsidian background, Cyan/Violet accents).
