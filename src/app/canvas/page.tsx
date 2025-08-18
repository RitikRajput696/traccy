"use client";
import Toolbar from "@/components/Toolbar";
import React, { useState, useRef, useEffect } from "react";
import { ToolType, ToolPropertiesType } from "@/types/Tool";
import { COLORS } from "@/lib/Colors";
import CanvasBg from "@/components/CanvasBg";
import ColorPanel from "@/components/ColorPanel";

function CanvasPage() {
  const [tool, setTool] = useState<ToolType | null>("pen");
  const [toolProperties, setToolProperties] =
    useState<ToolPropertiesType | null>({
      size: 1,
      color: "#000000",
    });
  // const [penColor, setPenColor] = useState("rgba(255, 48, 162, 1)");
  // const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  //create canvas
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
      CanvasBg(canvas);
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
        CanvasBg(canvas);
      }
    }
  }, [tool]);

  function startDrawing(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!ctxRef.current || !canvasRef.current) return;
    let x1: number;
    let y1: number;

    // get starting coordinates
    if ("touches" in e) {
      const touch = e.touches[0];

      x1 = touch.clientX;
      y1 = touch.clientY;
    } else {
      x1 = e.nativeEvent.offsetX;
      y1 = e.nativeEvent.offsetY;
    }

    if (tool === "pen" || tool === "eraser") {
      ctxRef.current.beginPath();
      if (toolProperties) {
        if (tool === "eraser") {
          ctxRef.current.lineWidth = toolProperties.size * 3;
        } else {
          ctxRef.current.lineWidth = toolProperties.size;
        }

        ctxRef.current.strokeStyle =
          tool === "eraser" ? COLORS.canvasColor : toolProperties.color;
        ctxRef.current.moveTo(x1, y1);
      }

      // ctxRef.current.strokeStyle = penColor;
    }
    if (tool === "rect" || tool === "ellipse") {
      startPosRef.current = { x: x1, y: y1 };
      snapshotRef.current = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      if (toolProperties) {
        ctxRef.current.lineWidth = toolProperties.size;
        ctxRef.current.strokeStyle = toolProperties.color;
      }
    }

    setIsDrawing(true);
  }

  function draw(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) {
    if (!isDrawing || !ctxRef.current) return;

    // ending coordinates for shapes
    let x2: number, y2: number;

    // touch events for touch display
    if ("touches" in e) {
      const touch = e.touches[0];

      x2 = touch.clientX;
      y2 = touch.clientY;
    } else {
      x2 = e.nativeEvent.offsetX;
      y2 = e.nativeEvent.offsetY;
    }

    if (tool === "pen" || tool === "eraser") {
      ctxRef.current.lineTo(x2, y2);
      ctxRef.current.stroke();
    } else if (tool === "rect") {
      //check for starting position and previous image
      if (startPosRef.current && snapshotRef.current) {
        // put previous image
        ctxRef.current.putImageData(snapshotRef.current, 0, 0);
        const width = x2 - startPosRef.current.x;
        const height = y2 - startPosRef.current.y;
        // create rectangle
        ctxRef.current.strokeRect(
          startPosRef.current.x,
          startPosRef.current.y,
          width,
          height,
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
          2 * Math.PI,
        );
        ctxRef.current.stroke();
      }
    }
  }

  function stopDrawing() {
    setIsDrawing(false);
    snapshotRef.current = null;
    startPosRef.current = null;
  }

  return (
    <div>
      <Toolbar onToolChange={setTool} currentTool={tool} />
      <ColorPanel onToolPropertiesChange={setToolProperties} />
      <canvas
        ref={canvasRef}
        width={"100vw"}
        height={"100vh"}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block"
      ></canvas>
    </div>
  );
}

export default CanvasPage;
