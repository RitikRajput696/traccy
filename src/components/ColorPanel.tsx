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
    <div className="absolute bottom-0 left-1/2 z-20 mb-1 -translate-x-1/2 rounded-2xl border bg-white pr-2 pl-2 sm:top-2 sm:bottom-auto sm:left-2 sm:-translate-x-0">
      <div className="flex sm:flex-col">
        <div className="flex flex-col p-1">
          <label htmlFor="">colors</label>
          <div className="flex justify-around gap-1">
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
