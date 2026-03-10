# API Integration Coding Challenge

A take-home coding challenge repository for backend/API engineering interviews. Candidates implement Flask + Python APIs that integrate with mock external data and return structured responses according to defined contracts.

## Repository Purpose

This repository contains **four independent backend API challenges**. Each challenge lives in its own directory and simulates real-world integration scenarios (social analytics, e-commerce orders, delivery metrics, university management). Candidates choose or are assigned one or more challenges and implement the required endpoints using **Flask + Python**.

## Candidate Expectations

- **Backend implementation:** Flask + Python. All API implementations must be in Python using the Flask framework.
- **Frontend implementation:** A small React frontend that calls your Flask API for the challenge(s) you implement. The frontend should run locally against your Flask backend and support both a dev server and a production build.
- **Contract definition:** Each challenge defines the API contract and data types in a **TypeScript file named `task.ts`**. Use `task.ts` as the source of truth for request/response shapes, field names, and types. Your Flask implementation should produce responses that match these contracts.
- **Data source:** Each challenge provides a `mock-data/` directory with JSON files that simulate an external provider or database. Your implementation should read from these files (or from an in-memory representation of them) and return data according to the required endpoints and business rules.
- **Deliverables:** A working Flask backend and React frontend for the selected challenge(s), with clear structure, error handling, and responses that match `example-response.json` in spirit and structure.

## Local Development and Build Expectations

After you implement a challenge, a reviewer should be able to:

- **Run the backend locally** from that challenge directory, for example:
  - `python -m venv .venv && source .venv/bin/activate`
  - `pip install -r requirements.txt`
  - `flask run` (or an equivalent command documented in your README)
- **Run the frontend locally** from a `frontend/` React app inside the same challenge directory, for example:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- **Build the frontend for production** from that same `frontend/` directory:
  - `npm run build`

You may choose your own project layout and tooling, but for each challenge you implement you must document the exact commands to:

- start the Flask backend locally, and
- start and build the React frontend locally.

## Evaluation Criteria

Candidates are evaluated on:

| Criterion | Description |
|-----------|-------------|
| **Correctness** | Endpoints return the right data; formulas (e.g. engagement score, spending by category) are correct; business rules (enrollment, capacity, prerequisites) are enforced. |
| **API Design** | RESTful conventions, consistent naming, sensible status codes and response shapes. |
| **Data Modeling** | How entities and relationships are represented; alignment with `task.ts` types. |
| **Error Handling** | Graceful handling of missing resources (e.g. user not found), invalid IDs, and malformed or missing data. |
| **Code Organization** | Clear separation of routes, services, and data access; readable and maintainable structure. |
| **Testing** | Presence and quality of tests (unit and/or integration) for critical paths. |
| **Performance Considerations** | Awareness of pagination, caching, and scaling when discussed in follow-up. |

## Repository Structure

```
api-integration-coding-challenge/
    README.md                    (this file)

    twitter-data-pull/
        README.md
        task.ts
        mock-data/
            posts.json
            users.json
        example-response.json

    amazon-orders/
        README.md
        task.ts
        mock-data/
            orders.json
        example-response.json

    doordash/
        README.md
        task.ts
        mock-data/
            orders.json
            restaurants.json
        example-response.json

    university-management/
        README.md
        task.ts
        mock-data/
            students.json
            courses.json
            enrollments.json
        example-response.json
```

Each challenge directory is self-contained. Read the challenge-specific README and `task.ts` before implementing.

## How to Use This Repo (Interviewers)

1. Assign one or more challenges to the candidate.
2. Candidate implements the base task in Flask + Python using `task.ts` and `mock-data/`.
3. After the implementation is complete, use the **Follow-Up Interview Questions** and **Edge Cases to Discuss After Implementation** sections in each challenge README to probe depth, judgment, and design thinking in a live discussion.
