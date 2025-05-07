import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import CytoscapeComponent from "react-cytoscapejs";
import "../styles/classforge.css";

export default function ResultPage() {
  // Enhanced data for a richer graph visualization
  const [groups] = useState([
    { 
      name: "Group A", 
      students: ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah"],
      relations: "Alice-Bob, Bob-Charlie, Alice-Charlie, Diana-Alice, Ethan-Charlie, Fiona-Alice, George-Bob, Hannah-Diana, Charlie-Diana, Ethan-George, Fiona-Hannah, Bob-Diana" 
    },
    { 
      name: "Group B", 
      students: ["David", "Eva", "Frank", "Gina", "Henry", "Isabel", "Jack"],
      relations: "David-Eva, Eva-Frank, Frank-Gina, Gina-Henry, Henry-Isabel, Isabel-Jack, Jack-David, David-Frank, Eva-Henry, Frank-Isabel" 
    },
    { 
      name: "Group C", 
      students: ["Frank", "Grace", "Hank", "Irene", "Jason", "Kate", "Leo", "Mia", "Noah"],
      relations: "Frank-Grace, Grace-Hank, Hank-Irene, Irene-Jason, Jason-Kate, Kate-Leo, Leo-Mia, Mia-Noah, Noah-Frank, Frank-Jason, Grace-Leo, Hank-Noah" 
    },
    {
      name: "Group D",
      students: ["Olivia", "Peter", "Quinn", "Rachel", "Sam", "Taylor", "Uma", "Victor"],
      relations: "Olivia-Peter, Peter-Quinn, Quinn-Rachel, Rachel-Sam, Sam-Taylor, Taylor-Uma, Uma-Victor, Victor-Olivia, Olivia-Rachel, Peter-Sam, Quinn-Victor"
    }
  ]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const cyRef = useRef(null);
  
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
        // Random position values for visual variety with more vibrant colors
        color: `hsl(${Math.floor(Math.random() * 360)}, ${70 + Math.floor(Math.random() * 20)}%, ${65 + Math.floor(Math.random() * 15)}%)` 
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
              // Add variable weights for more visual interest
              weight: 1 + Math.floor(Math.random() * 3)
            }
          });
        }
      });
    }

    setGraphData({ nodes, edges });
  }, [selectedGroup]);

  // Enhanced Cytoscape style configuration
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
        'width': 'data(weight)',
        'line-color': '#aaa',
        'curve-style': 'bezier',
        'opacity': 0.8
      }
    },
    {
      selector: ':selected',
      style: {
        'background-color': '#ff0',
        'line-color': '#f00',
        'target-arrow-color': '#f00',
        'source-arrow-color': '#f00'
      }
    }
  ];

  // Optimized Cytoscape layout configuration for better visualization
  const layout = {
    name: 'cose',
    fit: true,
    padding: 50,
    nodeRepulsion: 8000,
    nodeOverlap: 20,
    idealEdgeLength: 100,
    randomize: true,
    componentSpacing: 100,
    animate: true,
    refresh: 20
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
                    {group.name} ({group.students.length} students)
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
            <div style={{ height: '400px', width: '80%', margin: '0 auto', border: '1px solid #ddd', borderRadius: '5px' }}>
            {graphData.nodes.length > 0 && (
                <CytoscapeComponent
                key={selectedGroupIndex} // Add this key prop to force re-render
                elements={[...graphData.nodes, ...graphData.edges]}
                stylesheet={cytoscapeStylesheet}
                layout={layout}
                style={{ width: '100%', height: '100%' }}
                cy={(cy) => {
                    cyRef.current = cy;
                    
                    // Run the layout again to ensure proper positioning
                    cy.layout(layout).run();
                    
                    // Add event handlers
                    cy.on('tap', 'node', function(evt) {
                    const node = evt.target;
                    console.log('Tapped node: ' + node.id());
                    });
                }}
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