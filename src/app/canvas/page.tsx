"use client";
import Toolbar from "@/components/Toolbar";
import React, { useRef, useEffect, useState } from "react";
import { ToolType } from "@/types/Tool";

function page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<ToolType | null>("pen");

  // Set canvas size based on container
  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;

    if (canvas && container) {
      const containerRect = container.getBoundingClientRect();

      canvas.width = containerRect.width;
      canvas.height = containerRect.height;

      // Initialize canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctxRef.current = ctx;
      }
    }
  };

  useEffect(() => {
    // Use ResizeObserver for better container size detection
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    // Initial setup
    setCanvasSize();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  function handleToolChange(selectedTool: ToolType) {
    if (selectedTool === "clear") {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (canvas && ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      setTool("pen");
    } else {
      setTool(selectedTool);
    }
  }

  function startDrawing(e: React.MouseEvent) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    setIsDrawing(true);

    if (tool === "pen") {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }

    if (tool === "rect") {
      startRef.current = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
    }
  }

  function draw(e: React.MouseEvent) {
    if (!isDrawing) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    if (tool === "pen") {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    } else if (tool === "rect") {
      const startX = startRef.current?.x;
      const startY = startRef.current?.y;

      if (startX !== undefined && startY !== undefined) {
        const width = e.nativeEvent.offsetX - startX;
        const height = e.nativeEvent.offsetY - startY;
        ctx.strokeRect(startX, startY, width, height);
      }
    }
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  return (
    <div className=" h-screen  relative">
      <Toolbar onToolChange={handleToolChange} currentTool={tool} />

      {/* Canvas container - adjust this div's size as needed */}
      <div
        ref={canvasContainerRef}
        className="w-full h-full border-2 border-gray-400 "
      >
        <canvas
          ref={canvasRef}
          className="block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}

export default page;
