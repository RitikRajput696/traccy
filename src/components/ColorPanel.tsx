"use client";
import React, { useState, useEffect } from "react";
import { COLORS } from "@/lib/Colors";
import { ToolPropertiesType } from "@/types/Tool";

interface ColorPanelProps {
  onToolPropertiesChange: (properties: ToolPropertiesType) => void;
}

export default function ColorPanel({
  onToolPropertiesChange,
}: ColorPanelProps) {
  const [toolSize, setToolSize] = useState(1);
  const [toolColor, setToolColor] = useState(COLORS.panelColors[0]);

  useEffect(() => {
    onToolPropertiesChange({
      size: toolSize,
      color: toolColor,
    });
  }, [toolSize, toolColor]);

  return (
    <div className="absolute z-20 mt-2 ml-2 rounded-2xl border bg-white p-1">
      <div>
        <div className="flex flex-col">
          <label htmlFor="">colors</label>
          <div className="flex justify-around">
            {COLORS.panelColors.map((color, i) => (
              <div
                className={`h-8 w-8 rounded-lg border ${toolColor === color ? "ring-2 ring-blue-500" : "border"} `}
                key={i}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setToolColor(color);
                }}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="">size</label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={toolSize}
            onChange={(e) => setToolSize(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
