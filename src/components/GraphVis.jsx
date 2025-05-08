import { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone/esm/vis-network";

const GraphVis = ({ nodes, edges }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: "dot",
        size: 22,
        font: { size: 16 },
        borderWidth: 2
      },
      edges: {
        arrows: { to: { enabled: true, scaleFactor: 1 } },
        font: { align: "top", size: 12 },
        color: { color: "#848484", highlight: "#f00" },
        smooth: { type: "cubicBezier", forceDirection: "vertical", roundness: 0.4 }
      },
      layout: {
        improvedLayout: true
      },
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -50,
          springLength: 100,
          springConstant: 0.05
        },
        stabilization: {
          iterations: 150
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      }
    };

    const network = new Network(containerRef.current, data, options);

    return () => network.destroy();
  }, [nodes, edges]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "500px",
        border: "1px solid #ccc",
        marginTop: "1rem",
        borderRadius: "5px",
        background: "#fff"
      }}
    />
  );
};

export default GraphVis;
