# Integration Skills Definition (integration.skills.md)

## 1. Purpose

Defines how frontend, backend, and external services are connected, validated, and stabilized.

This layer ensures all system parts work together reliably.

---

## 2. Core Responsibilities

- Connect frontend to backend APIs
- Validate data contracts
- Handle errors across boundaries
- Ensure end-to-end functionality
- Manage external service integrations

---

## 3. Input Requirements

- api.contract.json
- frontend implementation
- backend implementation

---

## 4. Output Artifacts

- integration.report.md
- contract.validation.json
- e2e.test.results

---

## 5. API Contract Enforcement

- Strictly validate request/response shapes

Rules:

- No undocumented fields
- No missing required fields
- Type consistency required

---

## 6. Data Flow Validation

- Ensure:
  - Correct request format
  - Correct response handling

Rules:

- Frontend must not assume data shape
- Backend must match contract exactly

---

## 7. Error Handling Across Layers

- Standardize error format

Rules:

- Frontend must handle all backend errors
- Backend must return consistent errors

---

## 8. State Synchronization

- Ensure frontend state reflects backend truth

Rules:

- Avoid stale data
- Use refetch or invalidation strategies

---

## 9. External Services Integration

- Wrap all external APIs

Rules:

- Add retry logic
- Handle timeouts
- Provide fallbacks

---

## 10. End-to-End Testing (MANDATORY)

- Simulate real user flows

Rules:

- Cover critical paths
- Validate full request-response cycle

---

## 11. Performance Checks

- Measure:
  - API latency
  - Response size

Rules:

- Optimize slow endpoints

---

## 12. Edge Cases

- API unavailable
- Slow responses
- Partial failures
- Inconsistent data

---

## 13. AI Execution Rules

- Validate before connecting
- Do not assume API correctness
- Add safeguards in frontend

---

## 14. Review Checklist (INTEGRATION GATE)

- All endpoints connected
- Data matches contract
- Errors handled correctly
- End-to-end flows work

---

## 15. Failure Conditions (REJECT IF)

- Contract mismatch
- Unhandled errors
- Broken user flows
- Missing E2E validation

---

## 16. Output Quality

- Fully working feature
- Stable integration

---

## 17. Continuous Improvement

- Improve error handling
- Optimize data flow
- Reduce latency issues
