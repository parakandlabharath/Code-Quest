# Code Quest — Price Tracking Web App

Code Quest is documented in this repository as a Java full-stack application for monitoring product prices from e-commerce pages. It uses scheduled checks and a browser dashboard to help users compare prices with target budgets.

## Features

- **Product price extraction:** Jsoup parses price information from product pages.
- **Scheduled monitoring:** Spring scheduling can run checks automatically.
- **Target price tracking:** Compare extracted prices against a budget.
- **Browser dashboard:** Thymeleaf and Bootstrap provide the interface.
- **Local data storage:** H2 and Spring Data JPA support persistence.

## Tech stack

| Area | Technology |
| --- | --- |
| Language | Java 17+ |
| Backend | Spring Boot |
| HTML parsing | Jsoup |
| Data access | Spring Data JPA |
| Database | H2 |
| UI | Thymeleaf, Bootstrap |
| Build tool | Maven |

## Getting started

### Prerequisites

- JDK 17 or newer
- Git
- Maven, if the project does not include the Maven Wrapper

### 1. Clone the repository

```bash
git clone https://github.com/parakandlabharath/Code-Quest.git
cd Code-Quest
```

### 2. Start the application

```bash
mvn spring-boot:run
```

If the repository includes the Maven Wrapper, use `./mvnw spring-boot:run` on macOS/Linux or `mvnw.cmd spring-boot:run` on Windows.

### 3. Open the application

Visit [http://localhost:8080](http://localhost:8080) after startup.

## Usage

1. Add a product and its page URL.
2. Specify the CSS selector used to find the price.
3. Set a target price.
4. Review the tracked product information on the dashboard.

## Important notes

- Website markup can change, so selectors may need updating.
- Some sites may block automated requests or have terms that limit scraping.
- Confirm that the repository's current source code matches the features and commands described above.

## Contributing

1. Fork this repository.
2. Create a branch: `git checkout -b feature/your-change`.
3. Commit your changes: `git commit -m "Describe your change"`.
4. Push the branch and open a pull request.

## License

See the [LICENSE](LICENSE) file if included in this repository.
