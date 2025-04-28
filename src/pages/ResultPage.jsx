import { Link } from "react-router-dom";
import "../styles/classforge.css";

export default function ResultPage() {
  return (
    <div>
      {/* Header Section */}
        <header>
            <div className="header-container">
                <div className="logo">
                    <a href="index.html" className="logo-link">ClassForge</a>
                </div>
                <nav className="navbar">
                    <ul className="nav-list">
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/result">Dashboard</Link></li>
                        <li><Link to="/weights">Allocation</Link></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        {/* Dashboard Content */}
        <section id="dashboard">
            <div class="container">
                <h2>Dashboard</h2>
                <div className="chart-container">
                    <h3>Student Performance</h3>
                    <canvas id="performanceChart"></canvas>
                </div>
                {/* Add additional dashboard components as needed */}
            </div>
        </section>

        {/* Footer */}
        <footer>
            <div className="container">
                <p>&copy; 2025 ClassForge. All rights reserved.</p>
            </div>
        </footer>
      </div>
  );
}