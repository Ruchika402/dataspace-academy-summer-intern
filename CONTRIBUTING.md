# Contributing to CustomerIQ

Thank you for your interest in contributing to **CustomerIQ**! As a part of the AI & Machine Learning Summer Internship 2026 at DataSpace Academy, this repository enforces clean code standards, automation, and structured development workflows.

Please review these guidelines to ensure a smooth contribution process.

---

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Branching and Commits](#branching-and-commits)
3. [Development Environment Setup](#development-environment-setup)
4. [Code Style & Standards](#code-style--standards)
5. [Submitting a Pull Request](#submitting-a-pull-request)

---

## Code of Conduct
We expect all contributors to maintain a professional, respectful, and inclusive environment. Please be collaborative, open to feedback, and constructive in review processes.

---

## Branching and Commits

### Branch Naming Conventions
Always create a new branch from `main` for your work. Never commit directly to `main`. Use the following prefixes:
* `feature/your-feature-name` (e.g., `feature/login-validation`)
* `bugfix/issue-description` (e.g., `bugfix/csrf-token-fix`)
* `docs/update-info` (e.g., `docs/api-documentation`)
* `ci/update-workflows` (e.g., `ci/action-runner-fix`)

### Commit Messages
We follow **Conventional Commits** guidelines. Your commit messages should be formatted as follows:
```text
<type>: <short summary in present tense>

[optional description]
```
Common types:
* `feat`: A new user-facing feature.
* `fix`: A bug fix.
* `docs`: Documentation updates.
* `style`: Code formatting, semicolons, spacing (no logical changes).
* `refactor`: Rewriting code without changing its external behavior.
* `ci`: Workflow adjustments, runner setup, build tools.

---

## Development Environment Setup

### Prerequisites
* **Node.js** (v22 or newer)
* **Python** (v3.10 or newer)
* **pnpm** (exclusively used for package management in this repository)

### Installation
1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/DebaA17/dataspace-academy-summer-intern.git
   cd dataspace-academy-summer-intern
   ```
2. Install the workspace dependencies:
   ```bash
   pnpm install
   ```

### Running the Project Locally
You can run the frontend, backend, or both concurrently using our cross-platform pnpm scripts:

* **Start both Frontend and Backend concurrently (Recommended):**
   ```bash
   pnpm start
   ```
* **Start Frontend Server Only:**
   ```bash
   pnpm start:frontend
   ```
* **Start Backend Server Only:**
   ```bash
   pnpm start:backend
   ```
   *(Note: The backend script will automatically check for your Python environment, configure a `.venv` directory, verify dependencies from `requirements.txt`, and run the Django server.)*

---

## Code Style & Standards

### Backend (Python/Django)
* Follow **PEP 8** guidelines for Python code style.
* Keep your code clean, modular, and maintain security configurations (endpoints must require token authentication unless specifically whitelisted).
* Ensure any database schema changes are followed by creating migrations (`python backend/manage.py makemigrations`).

### Frontend (React/JS/CSS)
* Follow ESLint and Prettier formatting specifications.
* Do not leave active console warnings or uncaught runtime exceptions in the development console.
* Keep styling cohesive with the current CSS styling system (responsive, dark-mode support, premium glassmorphism elements).

---

## Submitting a Pull Request

1. **Lint and Test:** Before opening a PR, ensure all local tests pass:
   * Frontend tests: `pnpm test`
   * Backend tests: `python backend/manage.py test customer`
2. **Push Changes:** Push your branch to the remote repository.
3. **Open PR:** Open a Pull Request from your branch to `main`.
4. **Follow Template:** Fill out the provided **Pull Request Template** completely.
5. **CI Pipeline:** Ensure the automated GitHub Actions CI tests pass successfully.
6. **Code Review:** Address any code review comments or feedback requested by project maintainers before merging.
