import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";
import "../canvas-cursors.css"; // Make sure this exists

const CanvasBoard = ({ roomId, color, brushSize, tool }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.7;
    canvas.style.border = "1px solid #000";

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctxRef.current = ctx;

    socket.emit("join-room", roomId);

    socket.on("draw", (data) => {
      drawStroke(data, false);
    });

    socket.on("clear", () => {
      clearCanvas();
    });

    // Listen to undo and clear events from parent
    const undoListener = () => handleUndo();
    const clearListener = () => handleClear();

    window.addEventListener("canvas-undo", undoListener);
    window.addEventListener("canvas-clear", clearListener);

    return () => {
      socket.off("draw");
      socket.off("clear");
      window.removeEventListener("canvas-undo", undoListener);
      window.removeEventListener("canvas-clear", clearListener);
    };
  }, [roomId]);

  useEffect(() => {
    if (ctxRef.current) {
      applyToolSettings();
    }
  }, [color, brushSize, tool]);

  const applyToolSettings = () => {
    const ctx = ctxRef.current;
    switch (tool) {
      case "pen":
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1;
        break;
      case "brush":
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.globalAlpha = 0.8;
        break;
      case "marker":
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.4;
        break;
      case "eraser":
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 10;
        ctx.globalAlpha = 1;
        break;
      default:
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.globalAlpha = 1;
    }
  };

  const drawStroke = ({ x, y, prevX, prevY, color, brushSize, tool }, save = true) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    applyToolSettings();
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (save) {
      setStrokes((prev) => [...prev, { x, y, prevX, prevY, color, brushSize, tool }]);
    }
  };

  const startDraw = ({ nativeEvent }) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    ctxRef.current.prevX = offsetX;
    ctxRef.current.prevY = offsetY;
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const prevX = ctxRef.current.prevX;
    const prevY = ctxRef.current.prevY;

    drawStroke({ x: offsetX, y: offsetY, prevX, prevY, color, brushSize, tool }, true);

    socket.emit("draw", {
      roomId,
      x: offsetX,
      y: offsetY,
      prevX,
      prevY,
      color,
      brushSize,
      tool,
    });

    ctxRef.current.prevX = offsetX;
    ctxRef.current.prevY = offsetY;
  };

  const stopDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
  };

  const handleClear = () => {
    clearCanvas();
    socket.emit("clear", { roomId });
  };

  const handleUndo = () => {
    const updatedStrokes = strokes.slice(0, -1);
    setStrokes(updatedStrokes);
    redrawFromStrokes(updatedStrokes);
  };

  const redrawFromStrokes = (strokesArray) => {
    clearCanvas();
    strokesArray.forEach((stroke) => {
      drawStroke(stroke, false);
    });
  };

  const getCursorClass = () => {
    switch (tool) {
      case "pen":
        return "cursor-pen";
      case "brush":
        return "cursor-brush";
      case "marker":
        return "cursor-marker";
      case "eraser":
        return "cursor-eraser";
      default:
        return "";
    }
  };

  return (
    <div>
      <canvas
        className={getCursorClass()}
        ref={canvasRef}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
      />
    </div>
  );
};

export default CanvasBoard;
