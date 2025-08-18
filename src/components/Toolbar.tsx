import React from "react";
import { ToolType } from "@/types/Tool";
import ColorPanel from "@/components/ColorPanel";
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
    <div className="absolute top-10 left-1/2 z-10 mt-2 mr-2 ml-2 flex -translate-1/2 items-center justify-between">
      {/* <ColorPanel /> */}
      <div className="flex gap-1 rounded-2xl bg-blue-300/30 p-4 backdrop-blur-lg select-none">
        {tools.map((tool, i) => {
          const IconComponent = toolIcons[tool];
          return (
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-lg font-semibold capitalize transition-colors duration-200 ${
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
      <div></div>
    </div>
  );
}

export default Toolbar;
