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

## 👥 Team Information

- **Team Name**: Threat Hunters
- **College**: B.P.Poddar Institute of Management & Technology
- **Department**: BCA
- **Internship Program**: DataSpace Academy Summer Internship
- **Organization**: DataSpace Academy

---


## 🧑‍💻 Core Contributors

| Name | Role | Contributions |
|------|------|---------------|
| **Ruchika Adak** | Data Engineer & Backend Developer | Data Engineering (EDA, Data Cleaning, Feature Engineering), Feature Engineering, Scaling, Encoding ,  Django REST API, Model Integration |
| **Debasis Biswas** | DevOps & Backend Lead | Repository Management, CI/CD (GitHub Actions), Docker Configuration, Backend Integration, Testing, Pull Request Reviews |

---

## 🤝 Contributors

- **[Sadikul Sekh]** – Model Training (Random Forest, XGBoost), Hyperparameter Tuning
- **[Payel Hazra]** – Frontend Development (React Dashboard, UI/UX)
- **[Rupsa Haldar]** – In Charge of making PPT and files

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS,Bootstrap,Recharts,pnpm
- **Backend**: Django5.2, Django REST Framework,CORS Headers
- **ML**: XGBoost, Random Forest, Scikit-learn,numpy, pandas
- **Database**: SQLite
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

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
