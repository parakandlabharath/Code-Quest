# Code Quest — Team Task Management

Code Quest is a Java full-stack Kanban-style task management application for organizing team work. Its stated goal is to help Agile teams move tasks through a workflow from **To Do** to **Done**, with REST APIs and a dynamic browser interface.

> **Repository note:** This README reflects the repository's current description. Confirm the feature list and run commands against the source code before presenting them as verified.

## Features

- **Kanban workflow:** Organize work across task states such as To Do, In Progress, and Done.
- **Task state transitions:** Update workflow state through the application.
- **REST API:** Backend endpoints support communication between the UI and server.
- **Dynamic interface:** JavaScript Fetch API can communicate with backend endpoints without a full page reload.
- **Persistence:** Spring Data JPA is listed in the project description for data access.

## Technology stack

- **Language:** Java
- **Backend:** Spring Boot
- **Data access:** Spring Data JPA
- **Frontend interaction:** JavaScript Fetch API
- **Architecture:** RESTful API

Add the exact database, build tool, and framework versions after verifying the project configuration files.

## Getting started

The current default branch listing available during this review did not expose application source or build files, so the correct setup command could not be verified here.

Once the source code is available, document these steps with confirmed commands:

1. Install the required JDK and build tool.
2. Clone this repository.
3. Configure the database and application settings, if required.
4. Run the application using the project's actual build configuration.
5. Open the local URL printed by the application.

## Screenshots and demo

Add genuine screenshots of the running application here. Recommended screenshots:

- The main Kanban board
- A task creation or edit form
- A task moving between workflow states

Store images in a `screenshots/` directory and reference them using relative paths, for example:

```md
![Code Quest Kanban board](screenshots/kanban-board.png)
```

Do not add mock screenshots that imply features work when they have not been tested.

## Quality checklist

- [ ] Verify setup instructions on a clean clone.
- [ ] Add screenshots captured from the running application.
- [ ] Document API endpoints and example requests.
- [ ] Add validation and error-handling tests.
- [ ] Provide a `.env.example` or sample configuration without secrets, if needed.
- [ ] Add a suitable `.gitignore` and license after checking the existing project files.

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-change`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push the branch and open a pull request.

## License

Add the appropriate license and link after confirming the project's licensing choice.
