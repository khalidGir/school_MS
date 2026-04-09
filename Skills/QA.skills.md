# QA Skills Definition (qa.skills.md)

## 1. Purpose

Defines the standards, rules, and workflows for quality assurance across all departments, ensuring that features are reliable, bug-free, and meet acceptance criteria before deployment.

---

## 2. Core Responsibilities

- Validate feature requirements against implementation
- Run automated and manual tests
- Report issues with detailed reproduction steps
- Ensure regression is prevented
- Validate cross-platform and cross-browser behavior

---

## 3. Input Requirements

- feature.spec.md
- frontend implementation
- backend implementation
- integration.report.md

---

## 4. Output Artifacts

- qa.report.md
- test.results.json
- bug.tracking.log

---

## 5. Testing Types

### Automated

- Unit tests (components/services)
- Integration tests
- End-to-End tests (E2E)

### Manual

- Exploratory testing for edge cases
- UX validation
- Cross-device behavior

---

## 6. Test Planning

- Map tests to feature acceptance criteria
- Prioritize critical paths
- Define expected results
- Identify boundary conditions and edge cases

---

## 7. Test Execution Rules

- Tests must be repeatable and deterministic
- Automate whenever possible
- Manual tests must include screenshots or detailed logs
- Track failures in structured format

---

## 8. Bug Reporting Standards

- Clearly describe steps to reproduce
- Include screenshots/logs if available
- Severity classification (Critical, High, Medium, Low)
- Suggest possible root cause if identifiable

---

## 9. Regression Control

- Ensure new changes do not break existing features
- Maintain regression test suite
- Re-run critical automated tests on all deployments

---

## 10. Performance Testing

- Monitor response times, API latency, and load behavior
- Validate frontend rendering speed
- Validate backend service throughput

---

## 11. Security Testing

- Validate authentication and authorization flows
- Check for common vulnerabilities (XSS, SQL Injection)
- Ensure sensitive data is protected

---

## 12. Edge Cases

- Missing data
- Slow network / timeouts
- API failures
- Concurrent users / race conditions
- Device/browser inconsistencies

---

## 13. AI QA Execution Rules

- Run all relevant tests automatically first
- Use mocks if backend or frontend is incomplete
- Flag any mismatch with acceptance criteria
- Suggest fixes if patterns are recognized

---

## 14. Review Checklist (QA GATE)

- All acceptance criteria verified
- No critical or high-severity bugs
- Regression tests pass
- Performance thresholds met
- Edge cases handled

---

## 15. Failure Conditions (REJECT IF)

- Critical features fail
- Unhandled edge cases
- Automated tests fail
- Regression broken
- Missing documentation of bugs

---

## 16. Output Quality

- Complete test reports
- Clear bug documentation
- Tests mapped to acceptance criteria
- Automation scripts ready for reuse

---

## 17. Continuous Improvement

- Update test suites with new scenarios
- Optimize automation coverage
- Learn from recurring issues to refine rules
