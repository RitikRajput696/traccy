"use client";
import Toolbar from "@/components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import { ToolType } from "@/types/Tool";
import { COLORS } from "@/lib/Colors";

function CanvasPage() {
  const [tool, setTool] = useState<ToolType | null>("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = COLORS.canvasColor;
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
        ctx.fillStyle = COLORS.canvasColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Reset the tool back to 'pen'
        setTool("pen");
      }
    }
  }, [tool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current || !canvasRef.current) return;

    const x1 = e.nativeEvent.offsetX;
    const y1 = e.nativeEvent.offsetY;

    if (tool === "pen") {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x1, y1);
    }
    if (tool === "rect" || tool === "ellipse") {
      startPosRef.current = { x: x1, y: y1 };
      snapshotRef.current = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    const x2 = e.nativeEvent.offsetX;
    const y2 = e.nativeEvent.offsetY;

    if (tool === "pen") {
      ctxRef.current.lineTo(x2, y2);
      ctxRef.current.stroke();
    } else if (tool === "rect") {
      if (startPosRef.current && snapshotRef.current) {
        ctxRef.current.putImageData(snapshotRef.current, 0, 0);
        const width = x2 - startPosRef.current.x;
        const height = y2 - startPosRef.current.y;
        ctxRef.current.strokeRect(
          startPosRef.current.x,
          startPosRef.current.y,
          width,
          height
        );
      }
    } else if (tool === "ellipse") {
      if (startPosRef.current && snapshotRef.current) {
        ctxRef.current.putImageData(snapshotRef.current, 0, 0);

        const startX = startPosRef.current.x;
        const startY = startPosRef.current.y;

        const centerX = startX + (x2 - startX) / 2;
        const centerY = startY + (y2 - startY) / 2;
        const radiusX = Math.abs((x2 - startX) / 2);
        const radiusY = Math.abs((y2 - startY) / 2);

        ctxRef.current.beginPath();
        // Draw the ellipse using the calculated center and radii
        ctxRef.current.ellipse(
          centerX,
          centerY,
          radiusX,
          radiusY,
          0,
          0,
          2 * Math.PI
        );
        ctxRef.current.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    snapshotRef.current = null;
    startPosRef.current = null;
  };

  return (
    <div>
      <Toolbar onToolChange={setTool} currentTool={tool} />

      <canvas
        ref={canvasRef}
        width={"100vw"}
        height={"100vh"}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 block"
      ></canvas>
    </div>
  );
}

export default CanvasPage;
