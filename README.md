<h1 align="center">Customer Categorization System</h1>

<p align="center">
  <a href="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/python-ci.yml">
    <img src="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/python-ci.yml/badge.svg" alt="Python CI" />
  </a>
  <a href="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/frontend-ci.yml">
    <img src="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/frontend-ci.yml/badge.svg" alt="Frontend CI" />
  </a>
  <a href="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/pr-validation.yml">
    <img src="https://github.com/DebaA17/dataspace-academy-summer-intern/actions/workflows/pr-validation.yml/badge.svg" alt="PR Validation" />
  </a>
  <a href="https://threathunter-api.onrender.com/health">
    <img src="https://img.shields.io/website?url=https://threathunter-api.onrender.com/health&amp;label=API%20Status" alt="API Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
  </a>
</p>

<p align="center">
  An AI/ML-powered customer segmentation and categorization platform developed during the DataSpace Academy Internship.
</p>

<p align="center">
  <img src="docs/assets/dashboard.png" alt="CustomerIQ AI Dashboard" width="100%" />
</p>

---

## 🛠️ Technology Stack

* **Frontend**: React 19, React Router, Bootstrap, Recharts, pnpm
* **Backend**: Django 5.2, Django REST Framework, SQLite, CORS Headers
* **Machine Learning**: Python 3.11+, pandas, numpy, scikit-learn, XGBoost

---

## 🚀 Local Development Setup

### Prerequisites
* Python 3.10+
* Node.js (v22+ or newer)
* `pnpm` package manager

### Quick Start (Start both Frontend & Backend)
You can launch both the frontend and backend servers concurrently with a single command from the project root:
```bash
pnpm install
pnpm start
```
*(Note: The backend bootstrapper will automatically check your Python environment, create a `.venv` if one is missing, install the required Python packages from `requirements.txt`, and boot the Django backend alongside the React frontend.)*

### Running Servers Separately
If you prefer to run the servers in separate terminals:
* **Start Django Backend:**
  ```bash
  pnpm start:backend
  ```
* **Start React Frontend:**
  ```bash
  pnpm start:frontend
  ```

### Database Migrations
If you need to run database migrations:
```bash
# Activate the virtual environment (.venv) and run migrations:
python backend/manage.py migrate
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
