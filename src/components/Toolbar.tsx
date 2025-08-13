import React from "react";
import { ToolType } from "@/types/Tool";
import {
  Pencil,
  Circle,
  RectangleHorizontal,
  Trash2,
  Eraser,
} from "lucide-react";

interface ToolBarProps {
  onToolChange: (toolName: ToolType) => void;
  currentTool: ToolType | null;
}

const toolIcons = {
  clear: Trash2,
  pen: Pencil,
  rect: RectangleHorizontal,
  ellipse: Circle,
  eraser: Eraser,
};

function Toolbar({ onToolChange, currentTool }: ToolBarProps) {
  let tools: ToolType[] = ["clear", "pen", "rect", "ellipse", "eraser"];
  return (
    <div className="absolute -translate-1/2 left-1/2 top-10 z-10 flex ">
      {/* <button>first button</button> */}
      <div className="flex gap-1 p-4 select-none  bg-blue-300/30 backdrop-blur-lg rounded-2xl  ">
        {tools.map((tool, i) => {
          const IconComponent = toolIcons[tool];
          return (
            <button
              className={`px-2 py-2 rounded-lg font-semibold transition-colors duration-200 capitalize ${
                currentTool === tool
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              key={i}
              onClick={() => onToolChange(tool)}
            >
              <IconComponent size={20} />
            </button>
          );
        })}
      </div>
      {/* <button>last button</button> */}
    </div>
  );
}

export default Toolbar;
