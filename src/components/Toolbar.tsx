import React from "react";

// Define the props interface for type-checking
interface ToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  const tools = ["pen", "rectangle", "square", "clear"];

  return (
    <div style={{ marginBottom: "10px" }}>
      {tools.map((tool) => (
        <button
          key={tool}
          onClick={() => onToolChange(tool)}
          style={{
            backgroundColor: activeTool === tool ? "lightblue" : "white",
            marginRight: "5px",
            padding: "5px 10px",
            border: "1px solid black",
            cursor: "pointer",
          }}
        >
          {tool.charAt(0).toUpperCase() + tool.slice(1)}{" "}
          {/* Capitalize first letter */}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
