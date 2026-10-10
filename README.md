# Vismo: Data Structure & Algorithm Visualizer

A full-stack interactive educational app for visualizing data structures (arrays, linked lists) and algorithms (sorting, searching, graph) step-by-step.

## Tech Stack

- **Frontend:** Angular 21, Angular Material, TypeScript, Vitest
- **Backend:** Spring Boot 4.0.5, Java 21, MySQL, Maven

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Java 21+](https://adoptium.net/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`

---

## Running Locally

### 1. Database

Create a MySQL database:

```sql
CREATE DATABASE vs_visualizer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd VS_Visualizer
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Or run from IntelliJ:
- Open `VS_Visualizer` as a project
- Run → Edit Configurations → add `-Dspring.profiles.active=local` to VM options
- Run `FirstOfAllApplication`

The backend starts on `http://localhost:8080`.

### 3. Frontend

```bash
cd VS_Visualizer_ui
npm install   # first time only
ng serve
```

Open `http://localhost:4200` in your browser.

---

## Running with the Online Backend

To point the frontend at the deployed Railway backend instead of your local one:

```bash
ng serve --configuration production
```

This uses the production environment file with the Railway API URL.

---

## Build for Production

```bash
ng build
```

Build artifacts are stored in `dist/`.

## Running Tests

```bash
ng test
```

Uses [Vitest](https://vitest.dev/) as the test runner.
