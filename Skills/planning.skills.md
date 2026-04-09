# Global Skills Definition (global.skills.md)

## 1. Purpose

Defines universal rules, constraints, and execution standards for all AI agents across every department and project.

This file is the highest priority layer and MUST be applied before any department-specific skills.

---

## 2. Core Principles

- Production-first: outputs must be deployable without major rework
- Deterministic behavior: same input → same structured output
- Simplicity bias: prefer the simplest solution that satisfies requirements
- Consistency over novelty: reuse existing patterns and utilities
- Backward safety: never break existing functionality
- Explicit over implicit: avoid hidden assumptions

---

## 3. Execution Pipeline (MANDATORY)

Every task MUST follow:

GENERATE → REVIEW → FIX → RE-REVIEW (max 3 iterations)

Rules:

- Generation must include all required artifacts (code, configs, tests)
- Review must check against this file + department rules
- Fix must address ALL review findings, not partial
- Stop after 3 failed attempts and flag issue with a clear report

Artifacts per step:

- generate.log
- review.log
- fix.log
- final.status.json

---

## 4. Task Contract (Input/Output Discipline)

Each task MUST define:

- Inputs: files, schemas, configs
- Outputs: exact files/paths to be produced
- Success criteria: measurable (e.g., tests pass, build succeeds)

Rules:

- No hidden side effects
- No writing outside declared paths
- Idempotent execution (safe to re-run)

---

## 5. Code Quality Standards

- Strict typing where applicable (TypeScript strict, schema validation for dynamic languages)
- Naming:
  - variables: descriptive, camelCase
  - types/classes: PascalCase
  - constants: UPPER_SNAKE_CASE

- Functions:
  - single responsibility
  - ≤ 30–40 lines preferred
  - no deep nesting (>3 levels)

- Structure:
  - separate concerns (UI, logic, data access)
  - no circular dependencies

Disallowed:

- Dead code
- Commented-out code blocks
- Magic numbers without constants
- Over-engineering (unnecessary abstractions)

---

## 6. Security Rules (NON-NEGOTIABLE)

- Validate all external inputs (API, forms, env)
- Sanitize data before storage/render
- Use parameterized queries / ORM protections
- Never expose secrets (keys, tokens, credentials)
- Use environment variables for sensitive data
- Principle of least privilege for services

Checks:

- Injection risks (SQL/NoSQL/XSS)
- Auth/authorization enforcement
- Sensitive data in logs

---

## 7. Error Handling & Resilience

- All operations must handle failure paths
- No silent failures
- Standard error shape per project (code, message, context)
- Retry strategy for transient failures (max 2–3 with backoff)
- Fallbacks for non-critical features

---

## 8. Testing Requirements (STRICT GATE)

Minimum:

- Unit tests for core logic
- Integration tests for workflows
- Critical user paths covered

Rules:

- Tests must be deterministic (no random/flaky behavior)
- Mock external services where appropriate
- Coverage target (default): 70%+, critical paths 100%

Fail conditions:

- Any failing test
- Flaky tests detected

---

## 9. Performance & Efficiency

- Avoid unnecessary recomputation and re-renders
- Optimize data fetching (batching, caching)
- Minimize network calls and payload sizes
- Lazy load heavy modules where applicable

Red flags:

- N+1 queries
- Large blocking operations on main thread

---

## 10. Logging & Observability

- Structured logs (level, message, context, timestamp)
- Log:
  - errors (always)
  - key state transitions

- Do NOT log:
  - secrets
  - excessive debug noise in production

---

## 11. Documentation Rules

- Document non-obvious decisions and tradeoffs
- Keep concise and colocated with code when possible
- Update docs on behavior changes

Required docs when applicable:

- README updates
- API contracts (OpenAPI/JSON)

---

## 12. Dependency Management

- Use minimal, well-maintained dependencies
- Prefer native/platform features first
- Avoid duplicates (one lib per concern)
- Lock versions where stability is required

---

## 13. Environment & Configuration

- All configs via environment variables or config files
- Validate required variables at startup
- Provide safe defaults for non-critical values
- Separate envs: dev / staging / production

---

## 14. Consistency & Reuse

- Follow existing project structure strictly
- Reuse utilities/services before creating new ones
- Align with existing naming and patterns

---

## 15. Data & Contract Integrity

- Respect API contracts strictly
- Validate request/response schemas
- Version contracts when breaking changes occur

---

## 16. AI Behavior Rules

- Do not assume missing requirements; infer conservatively
- If ambiguity blocks progress, produce best safe default + flag
- Prefer existing patterns over introducing new ones
- Respect priority order and constraints from all layers

---

## 17. Review Checklist (GLOBAL GATE)

- Builds successfully
- No syntax/runtime errors
- No security vulnerabilities
- No regression (existing functionality intact)
- Conforms to structure and naming
- Tests pass and meet thresholds
- Logs and error handling present

---

## 18. Failure Conditions (REJECT OUTPUT IF)

- Breaks existing features
- Missing validation or error handling
- Violates security rules
- Inconsistent structure/patterns
- Unreviewed or partially fixed output

---

## 19. Reporting & Traceability

Each task must output:

- summary.md (what was built/changed)
- decisions.md (key choices + reasons)
- known_issues.md (if any)

---

## 20. Versioning & Change Control

- All changes via version control (PRs)
- Changelog for rule updates
- Maintain backward compatibility where possible

---

## 21. Priority Order (Rule Resolution)

When conflicts occur:

1. global.skills.md
2. department.skills.md
3. project overrides
4. feature-specific instructions

---

## 22. Continuous Improvement Loop

- Collect failures and bugs
- Identify root causes
- Update rules/patterns to prevent recurrence
- Refactor duplicated or fragile logic

---

## 23. Stop Conditions (Escalation)

Stop execution and flag when:

- Requirements are contradictory
- Repeated failure after 3 iterations
- Missing critical inputs (schemas, envs, contracts)

Output must include:

- reason
- attempted fixes
- required human input
