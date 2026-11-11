# Code Quest — Interview Workflow

> **Important clarification:** The repository README describes Code Quest as a Java full-stack, Kanban-style **team task-management project**, not an online coding judge. This workflow follows the repository's documented project description. Verify every feature against source code before claiming it is complete.

## 1. Problem the project addresses

Code Quest aims to help teams organize work visually and move tasks through clear stages such as To Do, In Progress, and Done.

## 2. Main user workflow

1. A user opens the task board in the browser.
2. The user views the tasks grouped by status.
3. The user creates a task or opens an existing task.
4. The browser sends the action to the backend through an HTTP/REST request.
5. The Spring Boot application receives the request and validates the task data.
6. The service layer applies the task-management rules.
7. Spring Data JPA is documented as the data-access approach; the repository layer reads or updates task records in the database.
8. The backend returns a response and the browser refreshes or updates the board.
9. The user sees the task in its updated status column.

## 3. Intended component flow

`Browser (JavaScript / Fetch API) → REST Controller (Spring Boot) → Service Layer → Repository (Spring Data JPA) → Database`

- **Frontend:** JavaScript uses the Fetch API to communicate with backend endpoints.
- **Controller:** exposes REST endpoints for task operations.
- **Service:** contains task-management business logic.
- **Repository:** uses Spring Data JPA for persistence, as listed in the README.
- **Database:** stores task information; confirm the configured database in the project source.

## 4. Example task lifecycle

`To Do → In Progress → Done`

For example, when a member moves a task from To Do to In Progress, the browser sends an update request. The backend validates the requested status, saves the change, and returns a response so the board can display the new status.

## 5. Important implementation questions

- Which REST endpoints create, read, update, and delete tasks?
- What fields are stored for each task?
- How is invalid input handled?
- How does the frontend handle a failed API request?
- Is authentication or role-based access implemented?
- Which database is configured?

Do not claim authentication, real-time updates, notifications, or code execution unless those features exist in the source.

## 6. One-minute interview explanation

“Code Quest is a Java full-stack Kanban-style task-management project. It helps organize tasks into stages such as To Do, In Progress, and Done. The browser uses JavaScript Fetch API to communicate with REST endpoints in the Spring Boot backend. The backend handles validation and business logic, and Spring Data JPA is used for data access. After a task is updated, the response is reflected on the board. I can explain the exact endpoints and database schema from the implementation.”

## 7. Be ready for these questions

1. What is a REST API?
2. How does JavaScript Fetch API communicate with Spring Boot?
3. What is the responsibility of the Controller, Service, and Repository layers?
4. How do you update a task's status?
5. How do you handle API errors?
6. Why use Spring Data JPA?

## 8. Current repository status

The default branch currently exposes a README but no application source or build files. This workflow is based on the README's description and must be checked against the implementation before being used as a claim about completed features.