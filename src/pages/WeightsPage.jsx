import { Link } from "react-router-dom";
import "../styles/classforge.css";

export default function HomePage() {
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

        {/* Allocation Content */}
        <section id="allocation">
            <div class="container">
                <h2>Classroom Allocation</h2>
                <form id="allocationForm">
                    <div className="form-group">
                        <label for="academicWeight">Academic Performance Weight:</label>
                        <input type="range" id="academicWeight" name="academicWeight" min="0" max="100" value="50" />
                    </div>
                    <div className="form-group">
                        <label for="socialWeight">Social Integration Weight:</label>
                        <input type="range" id="socialWeight" name="socialWeight" min="0" max="100" value="50" />
                    </div>
                    <div className="form-group">
                        <label for="wellBeingWeight">Well-Being Weight:</label>
                        <input type="range" id="wellBeingWeight" name="wellBeingWeight" min="0" max="100" value="50" />
                    </div>
                    <button type="submit">Run Allocation</button>
                </form>
                <div id="resultsContainer">
                    <p>No results yet. Adjust preferences and run allocation.</p>
                </div>
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