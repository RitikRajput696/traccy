"use client";
import Toolbar from "@/components/Toolbar";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { ToolType } from "@/types/Tool";

interface Point {
  x: number;
  y: number;
}

interface ViewPort {
  x: number;
  y: number;
  zoom: number;
}

interface DrawingElement {
  type: "pen" | "rect" | "circle";
  points?: Point[];
  startPoint?: Point;
  endPoint?: Point;
  id: string;
}

function page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const startRef = useRef<Point | null>(null);
  const lastPanPointRef = useRef<Point | null>(null);

  // Store all drawing elements
  const elementsRef = useRef<DrawingElement[]>([]);
  const currentElementRef = useRef<DrawingElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [tool, setTool] = useState<ToolType | null>("pen");
  const [viewport, setViewport] = useState<ViewPort>({ x: 0, y: 0, zoom: 1 });

  // Transform screen coordinates to world coordinates
  const screenToWorld = useCallback(
    (screenX: number, screenY: number): Point => {
      return {
        x: (screenX - viewport.x) / viewport.zoom,
        y: (screenY - viewport.y) / viewport.zoom,
      };
    },
    [viewport]
  );

  // Transform world coordinates to screen coordinates
  const worldToScreen = useCallback(
    (worldX: number, worldY: number): Point => {
      return {
        x: worldX * viewport.zoom + viewport.x,
        y: worldY * viewport.zoom + viewport.y,
      };
    },
    [viewport]
  );

  // Set canvas size based on container
  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;

    if (canvas && container) {
      const containerRect = container.getBoundingClientRect();
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;

      // Setup preview canvas (invisible overlay for smooth previews)
      if (!previewCanvasRef.current) {
        const previewCanvas = document.createElement("canvas");
        previewCanvas.width = containerRect.width;
        previewCanvas.height = containerRect.height;
        previewCanvas.style.position = "absolute";
        previewCanvas.style.top = "0";
        previewCanvas.style.left = "0";
        previewCanvas.style.pointerEvents = "none";
        previewCanvas.style.zIndex = "10";
        container.appendChild(previewCanvas);
        previewCanvasRef.current = previewCanvas;
        previewCtxRef.current = previewCanvas.getContext("2d");
      } else {
        previewCanvasRef.current.width = containerRect.width;
        previewCanvasRef.current.height = containerRect.height;
      }

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctxRef.current = ctx;
        redrawCanvas();
      }
    }
  }, []);

  // Draw circle using bezier curves for smooth rendering
  const drawcircle = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number
  ) => {
    const kappa = 0.5522848;
    const ox = radiusX * kappa;
    const oy = radiusY * kappa;

    ctx.beginPath();
    ctx.moveTo(centerX - radiusX, centerY);
    ctx.bezierCurveTo(
      centerX - radiusX,
      centerY - oy,
      centerX - ox,
      centerY - radiusY,
      centerX,
      centerY - radiusY
    );
    ctx.bezierCurveTo(
      centerX + ox,
      centerY - radiusY,
      centerX + radiusX,
      centerY - oy,
      centerX + radiusX,
      centerY
    );
    ctx.bezierCurveTo(
      centerX + radiusX,
      centerY + oy,
      centerX + ox,
      centerY + radiusY,
      centerX,
      centerY + radiusY
    );
    ctx.bezierCurveTo(
      centerX - ox,
      centerY + radiusY,
      centerX - radiusX,
      centerY + oy,
      centerX - radiusX,
      centerY
    );
    ctx.closePath();
    ctx.stroke();
  };

  // Redraw entire canvas with current viewport
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height);

    // Save context and apply viewport transformation
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.zoom, viewport.zoom);

    // Set drawing styles
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2 / viewport.zoom; // Maintain consistent line width
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw all elements
    elementsRef.current.forEach((element) => {
      drawElement(ctx, element);
    });

    ctx.restore();
  }, [viewport]);

  // Draw preview on overlay canvas
  const drawPreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCtxRef.current;
    if (!previewCanvas || !previewCtx || !currentElementRef.current) return;

    // Clear preview canvas
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Save context and apply viewport transformation
    previewCtx.save();
    previewCtx.translate(viewport.x, viewport.y);
    previewCtx.scale(viewport.zoom, viewport.zoom);

    // Set drawing styles
    previewCtx.strokeStyle = "rgba(0, 0, 0, 0.7)";
    previewCtx.lineWidth = 2 / viewport.zoom;
    previewCtx.lineCap = "round";
    previewCtx.lineJoin = "round";

    // Draw current element preview
    drawElement(previewCtx, currentElementRef.current);

    previewCtx.restore();
  }, [viewport]);

  // Draw grid background
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const gridSize = 20 * viewport.zoom;
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;

    ctx.strokeStyle = "#e1e5e9";
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    // Vertical lines
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }

    ctx.stroke();
  };

  // Draw individual element
  const drawElement = (
    ctx: CanvasRenderingContext2D,
    element: DrawingElement
  ) => {
    if (element.type === "pen" && element.points && element.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x, element.points[i].y);
      }
      ctx.stroke();
    } else if (
      element.type === "rect" &&
      element.startPoint &&
      element.endPoint
    ) {
      const width = element.endPoint.x - element.startPoint.x;
      const height = element.endPoint.y - element.startPoint.y;
      ctx.strokeRect(element.startPoint.x, element.startPoint.y, width, height);
    } else if (
      element.type === "circle" &&
      element.startPoint &&
      element.endPoint
    ) {
      const centerX = (element.startPoint.x + element.endPoint.x) / 2;
      const centerY = (element.startPoint.y + element.endPoint.y) / 2;
      const radiusX = Math.abs(element.endPoint.x - element.startPoint.x) / 2;
      const radiusY = Math.abs(element.endPoint.y - element.startPoint.y) / 2;

      drawcircle(ctx, centerX, centerY, radiusX, radiusY);
    }
  };

  // Handle mouse wheel for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomFactor));

      // Zoom towards mouse position
      const worldPoint = screenToWorld(mouseX, mouseY);

      setViewport((prev) => {
        const newViewport = { ...prev, zoom: newZoom };
        const newScreenPoint = worldToScreen(worldPoint.x, worldPoint.y);

        return {
          x: prev.x + (mouseX - newScreenPoint.x),
          y: prev.y + (mouseY - newScreenPoint.y),
          zoom: newZoom,
        };
      });
    },
    [viewport, screenToWorld, worldToScreen]
  );

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    // Add wheel event listener
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    setCanvasSize();

    return () => {
      resizeObserver.disconnect();
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
      // Clean up preview canvas
      if (previewCanvasRef.current) {
        previewCanvasRef.current.remove();
      }
    };
  }, [setCanvasSize, handleWheel]);

  // Redraw when viewport changes
  useEffect(() => {
    redrawCanvas();
    if (currentElementRef.current && (tool === "rect" || tool === "circle")) {
      drawPreview();
    }
  }, [viewport, redrawCanvas, drawPreview, tool]);

  function handleToolChange(selectedTool: ToolType) {
    if (selectedTool === "clear") {
      elementsRef.current = [];
      currentElementRef.current = null;
      redrawCanvas();
      // Clear preview canvas
      if (previewCtxRef.current && previewCanvasRef.current) {
        previewCtxRef.current.clearRect(
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height
        );
      }
      setTool("pen");
    } else {
      setTool(selectedTool);
      // Clear any existing preview when switching tools
      if (previewCtxRef.current && previewCanvasRef.current) {
        previewCtxRef.current.clearRect(
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height
        );
      }
    }
  }

  function startDrawing(e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Handle middle mouse or ctrl+click for panning
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      setIsPanning(true);
      lastPanPointRef.current = { x: screenX, y: screenY };
      return;
    }

    // Handle drawing
    const worldPoint = screenToWorld(screenX, screenY);
    setIsDrawing(true);

    if (tool === "pen") {
      currentElementRef.current = {
        type: "pen",
        points: [worldPoint],
        id: Date.now().toString(),
      };
    } else if (tool === "rect") {
      startRef.current = worldPoint;
      currentElementRef.current = {
        type: "rect",
        startPoint: worldPoint,
        endPoint: worldPoint,
        id: Date.now().toString(),
      };
    } else if (tool === "circle") {
      startRef.current = worldPoint;
      currentElementRef.current = {
        type: "circle",
        startPoint: worldPoint,
        endPoint: worldPoint,
        id: Date.now().toString(),
      };
    }
  }

  function draw(e: React.MouseEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;

    // Handle panning
    if (isPanning && lastPanPointRef.current) {
      const deltaX = screenX - lastPanPointRef.current.x;
      const deltaY = screenY - lastPanPointRef.current.y;

      setViewport((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      lastPanPointRef.current = { x: screenX, y: screenY };
      return;
    }

    if (!isDrawing || !currentElementRef.current) return;

    const worldPoint = screenToWorld(screenX, screenY);

    if (tool === "pen" && currentElementRef.current.points) {
      currentElementRef.current.points.push(worldPoint);
      // For pen tool, draw in real-time on main canvas
      redrawCanvas();
    } else if (tool === "rect" || tool === "circle") {
      // Update the end point for shape tools
      currentElementRef.current.endPoint = worldPoint;
      // Draw preview on overlay canvas
      drawPreview();
    }
  }

  function stopDrawing(e: React.MouseEvent) {
    if (isPanning) {
      setIsPanning(false);
      lastPanPointRef.current = null;
      return;
    }

    if (isDrawing && currentElementRef.current) {
      // For rect and circle, make sure we have the final position
      if ((tool === "rect" || tool === "circle") && e) {
        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const screenX = e.clientX - rect.left;
          const screenY = e.clientY - rect.top;
          const worldPoint = screenToWorld(screenX, screenY);
          currentElementRef.current.endPoint = worldPoint;
        }
      }

      // Add the completed element to the elements array
      elementsRef.current.push({ ...currentElementRef.current });
      currentElementRef.current = null;

      // Clear preview canvas
      if (previewCtxRef.current && previewCanvasRef.current) {
        previewCtxRef.current.clearRect(
          0,
          0,
          previewCanvasRef.current.width,
          previewCanvasRef.current.height
        );
      }

      // Redraw the main canvas with the new element
      redrawCanvas();
    }

    setIsDrawing(false);
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Reset viewport with 'R' key
      if (e.key === "r" || e.key === "R") {
        setViewport({ x: 0, y: 0, zoom: 1 });
      }
      // Fit to content with 'F' key
      if (e.key === "f" || e.key === "F") {
        // This is a basic implementation - you can enhance it
        setViewport({ x: 0, y: 0, zoom: 1 });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCursor = () => {
    if (isPanning) return "grabbing";
    if (tool === "pen") return "crosshair";
    if (tool === "rect" || tool === "circle") return "crosshair";
    return "default";
  };

  return (
    <div className="h-screen relative">
      <Toolbar onToolChange={handleToolChange} currentTool={tool} />

      {/* Instructions */}
      <div className="absolute top-16 left-4 bg-white p-2 rounded shadow-md text-sm z-20">
        <div>🖱️ Middle click or Ctrl+click to pan</div>
        <div>🔍 Mouse wheel to zoom</div>
        <div>⌨️ Press 'R' to reset view</div>
        <div>🔧 Tools: Pen, Rectangle, circle</div>
      </div>

      <div
        ref={canvasContainerRef}
        className="w-full h-full border-2 border-gray-400 overflow-hidden relative"
        style={{ cursor: getCursor() }}
      >
        <canvas
          ref={canvasRef}
          className="block absolute top-0 left-0"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}

export default page;
