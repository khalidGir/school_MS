# Design Skills Definition (design.skills.md)

## 1. Purpose

Defines standards for generating, validating, and maintaining UI/UX designs using AI tools (e.g., Stitch).

This layer ensures that all frontend outputs are consistent, usable, and production-ready before development.

---

## 2. Core Responsibilities

- Convert feature specs into UI/UX designs
- Define design systems (tokens, components)
- Ensure usability and accessibility
- Generate responsive layouts
- Validate user experience flows

---

## 3. Input Requirements

- feature.spec.md (MANDATORY)
- user.flows.md
- Optional: brand guidelines

If missing:

- Generate a minimal consistent design system

---

## 4. Output Artifacts (MANDATORY)

- ui.screens.md (or design export)
- design.tokens.json
- component.map.json
- interaction.flows.md

---

## 5. Design System Rules

Define:

- Colors (primary, secondary, states)
- Typography (scale, weights)
- Spacing system (4/8px grid)
- Components (buttons, inputs, cards, modals)

Rules:

- Consistency across all screens
- Reusable components only
- Avoid one-off styles

---

## 6. Component Mapping (CRITICAL)

Every UI element must map to a reusable component:

Example:

- Button → PrimaryButton
- Input → TextInput

Rules:

- No unnamed components
- No duplicated variations without reason

---

## 7. Layout & Responsiveness

- Mobile-first design
- Breakpoints:
  - Mobile
  - Tablet
  - Desktop

Rules:

- Fluid layouts preferred
- Avoid fixed widths unless necessary

---

## 8. UX Rules

- Minimize user steps
- Clear call-to-action per screen
- Immediate feedback for user actions
- Predictable navigation

---

## 9. Accessibility (A11y)

- Color contrast compliance
- Keyboard navigation support
- Semantic structure

---

## 10. Interaction Design

Define:

- Hover states
- Loading states
- Error states
- Success states

Rules:

- Every action must have feedback

---

## 11. Edge Cases

Must design for:

- Empty states
- Error states
- Loading states
- Large data sets
- Slow networks

---

## 12. AI Design Rules

- Follow feature spec strictly
- If ambiguity → choose simplest consistent pattern
- Prefer standard UI patterns over custom designs
- Maintain visual consistency across screens

---

## 13. Validation Checklist (DESIGN GATE)

- All screens mapped to flows
- Components reusable
- Responsive layouts defined
- Edge cases covered
- Consistent design tokens

---

## 14. Failure Conditions (REJECT IF)

- Inconsistent UI
- Missing states (loading/error)
- Non-responsive layouts
- One-off components
- Poor UX flow

---

## 15. Output Quality

- Structured
- Developer-friendly
- Ready for frontend generation

---

## 16. Continuous Improvement

- Refine design system over time
- Reduce component duplication
- Improve UX based on feedback
