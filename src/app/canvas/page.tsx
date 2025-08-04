"use client"; // This is crucial for using hooks like useState and useEffect
import Toolbar from "@/components/Toolbar";
import React, { useState, useRef, useEffect } from "react";

function CanvasPage() {
  // 1. State is "lifted up" to the parent component
  const [tool, setTool] = useState("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctxRef.current = ctx; // Store the context in a ref
      }
    }
  }, []);

  // This effect handles the 'clear' action
  useEffect(() => {
    if (tool === "clear") {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (canvas && ctx) {
        // Clear the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fill it with the background color again
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Reset the tool back to 'pen'
        setTool("pen");
      }
    }
  }, [tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    // This is where you'll check the 'tool' state
    if (tool === "pen") {
      ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctxRef.current.stroke();
    }
    // else if (tool === "rectangle") { ... logic for rectangle ... }
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      {/* 2. Pass the state and the setter function to the Toolbar */}
      <Toolbar activeTool={tool} onToolChange={setTool} />

      {/* 3. The canvas uses the state to determine its behavior */}
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
}

export default CanvasPage;
