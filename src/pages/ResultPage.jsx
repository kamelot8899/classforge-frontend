import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GraphVis from "../components/GraphVis";
import "../styles/classforge.css";

const EDGE_COLORS = {
  Feedback: "#00BFFF",
  Advice: "#32CD32",
  Friends: "#FFA500",
  Disrespect: "#DC143C",
  "School Activities": "#9370DB",
  "More Time": "#FF69B4"
};

export default function ResultPage() {
  const [groups] = useState([
    {
      name: "Class 1",
      nodeUrl: "/api/nodes_part_1/Class1",
      edgeUrl: "/api/edges_part_1/endpoint_1746674987"
    },
    {
      name: "Class 2",
      nodeUrl: "/api/nodes_part_2/Class2",
      edgeUrl: "/api/edges_part_2/relation2"
    },
    {
      name: "Class 3",
      nodeUrl: "/api/nodes_part_3/Class3",
      edgeUrl: "/api/edges_part_3/relation3"
    },
    {
      name: "Class 4",
      nodeUrl: "/api/nodes_part_4/Class4",
      edgeUrl: "/api/edges_part_4/relation4"
    }
  ]);

  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [allEdges, setAllEdges] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [edgeTypeFilter, setEdgeTypeFilter] = useState("All");

  const handleGroupChange = (e) => {
    setSelectedGroupIndex(Number(e.target.value));
  };

  const handleEdgeTypeChange = (e) => {
    const selected = e.target.value;
    setEdgeTypeFilter(selected);
    if (selected === "All") {
      setGraphData((prev) => ({ ...prev, edges: allEdges }));
    } else {
      const filtered = allEdges.filter((e) => e.label === selected);
      setGraphData((prev) => ({ ...prev, edges: filtered }));
    }
  };

  const selectedGroup = groups[selectedGroupIndex];

  useEffect(() => {
    const fetchData = async () => {
      const { nodeUrl, edgeUrl } = groups[selectedGroupIndex];

      try {
        const [nodesRes, edgesRes] = await Promise.all([
          fetch(nodeUrl),
          fetch(edgeUrl)
        ]);

        const nodesData = await nodesRes.json();
        const edgesData = await edgesRes.json();

        const students = nodesData.map(n => n.label);
        setStudentList(students);

        const nodes = nodesData.map(node => ({
          id: node.id.toString(),
          label: node.label
        }));

        const edges = edgesData.map(edge => ({
          from: edge.from.toString(),
          to: edge.to.toString(),
          label: edge.label || "",
          color: EDGE_COLORS[edge.label] || "#ccc"
        }));

        setAllEdges(edges);
        setGraphData({ nodes, edges });
      } catch (err) {
        console.error("Failed to fetch group data:", err);
      }
    };

    fetchData();
  }, [selectedGroupIndex]);

  const edgeTypes = ["All", ...Array.from(new Set(allEdges.map(e => e.label)))];

  return (
    <div>
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

      <section id="dashboard">
        <div className="container">
          <h2>Dashboard</h2>
          <div className="dashboard-layout">
            <div className="dashboard-left">
              <div className="group-selection">
                <label htmlFor="groupSelect"><strong>Select a Class:</strong></label>
                <select id="groupSelect" value={selectedGroupIndex} onChange={handleGroupChange}>
                  {groups.map((group, index) => (
                    <option key={index} value={index}>{group.name}</option>
                  ))}
                </select>
              </div>

              <div className="student-list">
                <h3>Students in {selectedGroup.name}:</h3>
                <ul>
                  {studentList.map((student, index) => (
                    <li key={index}>{student}</li>
                  ))}
                </ul>
              </div>

              <div className="edge-filter">
                <label htmlFor="edgeFilter"><strong>Filter by Relationship Type:</strong></label>
                <select id="edgeFilter" value={edgeTypeFilter} onChange={handleEdgeTypeChange}>
                  {edgeTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="dashboard-right">
              <h3>Student Relationships in {selectedGroup.name}:</h3>
              <GraphVis nodes={graphData.nodes} edges={graphData.edges} />
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2025 ClassForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
