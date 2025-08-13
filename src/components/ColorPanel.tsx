"use client";
import React, { useState } from "react";
import { COLORS } from "@/lib/Colors";

export default function ColorPanel() {
  const [toolSize, setToolSize] = useState(1);
  return (
    <div className="bg-white  border rounded-2xl">
      <div>
        <div className="flex flex-col">
          <label htmlFor="">colors</label>
          <div className="flex justify-around">
            {COLORS.panelColors.map((color, i) => (
              <div
                className="w-4 h-4 rounded-full border "
                key={i}
                style={{ backgroundColor: color }}
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
