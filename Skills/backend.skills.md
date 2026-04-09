# Backend Skills Definition (backend.skills.md)

## 1. Purpose

Defines standards for designing, building, securing, and maintaining backend systems.

This layer ensures all backend services are reliable, scalable, secure, and consistent.

---

## 2. Core Responsibilities

- Design APIs and services
- Define and manage data models
- Implement business logic
- Handle authentication & authorization
- Ensure security and performance
- Integrate external services

---

## 3. Supported Architectures

- Monolith (default for MVP)
- Modular monolith
- Microservices (only when justified)

Rules:

- Prefer monolith first
- Scale to microservices only when needed

---

## 4. Supported Stacks

- Node.js (default)
- Express.js / NestJS
- Firebase / Supabase (if specified)

Database:

- PostgreSQL (preferred)
- NoSQL only if justified

---

## 5. API Design Rules

- REST (default)
- Use consistent naming:
  - /resources
  - /resources/:id

Standards:

- JSON responses only
- Standard response format:
  {
  success: boolean,
  data: any,
  error?: { code, message }
  }

---

## 6. Data Modeling

- Normalize relational data
- Use indexes for performance
- Define clear relationships

Rules:

- Avoid redundant data
- Use migrations for schema changes

---

## 7. Business Logic

- Must reside in service layer
- Controllers handle request/response only

Rules:

- No logic in routes
- No direct DB calls in controllers

---

## 8. Authentication & Authorization

- Use JWT or provider (Firebase/Auth)

Rules:

- Protect all sensitive routes
- Role-based access control (RBAC)
- Validate permissions per request

---

## 9. Validation

- Validate all inputs (body, params, query)

Tools:

- Zod / Joi / class-validator

Rules:

- Reject invalid data early

---

## 10. Error Handling

- Centralized error handler

Rules:

- No raw errors exposed
- Standard error format

---

## 11. Logging

- Log:
  - Requests
  - Errors
  - Critical operations

Avoid:

- Logging sensitive data

---

## 12. Performance

- Use caching where needed (Redis optional)
- Optimize queries

Avoid:

- N+1 queries
- Blocking operations

---

## 13. External Integrations

- Wrap external APIs in service layer

Rules:

- Add retry logic
- Handle failures gracefully

---

## 14. Testing

- Unit tests for services
- Integration tests for APIs

Rules:

- Test all critical endpoints

---

## 15. API Documentation

- Use Swagger / OpenAPI

Rules:

- Must stay in sync with code

---

## 16. Edge Cases

- Invalid input
- Unauthorized access
- Network failure
- Partial failures

---

## 17. AI Execution Rules

- Follow API contracts strictly
- Generate full CRUD where applicable
- Include validation and error handling
- Include tests by default

---

## 18. Review Checklist (BACKEND GATE)

- API works correctly
- Validation in place
- Auth enforced
- No direct DB leaks
- Tests pass

---

## 19. Failure Conditions (REJECT IF)

- Missing validation
- Missing auth
- Business logic in controllers
- Inconsistent API format
- No tests for critical paths

---

## 20. Output Quality

- Clean architecture
- Modular services
- Production-ready

---

## 21. Continuous Improvement

- Optimize slow queries
- Refactor duplicated logic
- Improve API consistency
