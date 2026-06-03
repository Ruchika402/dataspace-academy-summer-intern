import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
  <nav className="navbar navbar-expand-lg navbar-light app-navbar">
  <div className="container">
    <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
      {/* Logo content goes here */}
    </Link>
    {/* Rest of your navbar content */}
      </div>
    </nav>
          <span className="brand-title">
            CustomerIQ
          </span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <Link
                className={`nav-link app-nav-link ${location.pathname === "/" ? "is-active" : ""}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link app-nav-link ${location.pathname === "/predict" ? "is-active" : ""}`}
                to="/predict"
              >
                Predict
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
