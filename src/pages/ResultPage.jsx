import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import "../styles/classforge.css";

export default function ResultPage() {
  // Sample data for demonstration. Replace with your actual data.
  const [groups] = useState([
    { 
      name: "Group A", 
      students: ["Alice", "Bob", "Charlie"], 
      relations: "Alice-Bob, Bob-Charlie, Alice-Charlie" 
    },
    { 
      name: "Group B", 
      students: ["David", "Eva"], 
      relations: "David-Eva" 
    },
    { 
      name: "Group C", 
      students: ["Frank", "Grace", "Hank"], 
      relations: "Frank-Grace, Grace-Hank" 
    }
  ]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  
  const handleGroupChange = (e) => {
    setSelectedGroupIndex(Number(e.target.value));
  };

  const selectedGroup = groups[selectedGroupIndex];

  // Create graph data when selected group changes
  useEffect(() => {
    // Create nodes from student list
    const nodes = selectedGroup.students.map(student => ({
      data: { 
        id: student, 
        label: student,
        // Random position values for visual variety
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)` 
      }
    }));

    // Parse relations and create edges
    const edges = [];
    if (selectedGroup.relations) {
      const relationships = selectedGroup.relations.split(',').map(rel => rel.trim());
      relationships.forEach((rel, index) => {
        const [source, target] = rel.split('-');
        if (source && target) {
          edges.push({
            data: {
              id: `e${index}`,
              source,
              target,
              weight: 1
            }
          });
        }
      });
    }

    setGraphData({ nodes, edges });
  }, [selectedGroup]);

  // Cytoscape style configuration
  const cytoscapeStylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'label': 'data(label)',
        'color': '#000',
        'text-outline-width': 2,
        'text-outline-color': '#fff',
        'font-size': 14,
        'width': 40,
        'height': 40
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#aaa',
        'curve-style': 'bezier'
      }
    }
  ];

  // Cytoscape layout configuration
  const layout = {
    name: 'cose', // force-directed layout, resembles the uploaded image
    fit: true,
    padding: 50,
    nodeRepulsion: 8000,
    nodeOverlap: 20,
    idealEdgeLength: 100,
    randomize: true
  };

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

      {/* Dashboard Content Section */}
      <section id="dashboard">
        <div className="container">
          <h2>Dashboard</h2>

          {/* Group Selection & Student List (Parts 1 & 2) */}
          <div className="group-section">
            <div className="group-selection">
              <label htmlFor="groupSelect"><strong>Select a Group:</strong></label>
              <select id="groupSelect" value={selectedGroupIndex} onChange={handleGroupChange}>
                {groups.map((group, index) => (
                  <option key={index} value={index}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="student-list">
              <h3>Students in {selectedGroup.name}:</h3>
              <ul>
                {selectedGroup.students.map((student, index) => (
                  <li key={index}>{student}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Relationship Display (Part 3) with Network Graph */}
          <div className="relationship-section" style={{ marginTop: "2rem" }}>
            <h3>Student Relationships in {selectedGroup.name}:</h3>
            <div style={{ height: '300px', width: '80%', margin: '0 auto', border: '1px solid #ddd', borderRadius: '5px' }}>
              {graphData.nodes.length > 0 && (
                <CytoscapeComponent
                  elements={[...graphData.nodes, ...graphData.edges]}
                  stylesheet={cytoscapeStylesheet}
                  layout={layout}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
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