import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const CanvasBoard = ({ roomId, color, brushSize }) => {
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
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;

    socket.emit("join-room", roomId);

    socket.on("draw", (data) => {
      drawStroke(data, false); 
    });

    socket.on("clear", () => {
      clearCanvas();
    });

    return () => {
      socket.off("draw");
      socket.off("clear");
    };
  }, [roomId]);

  
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const drawStroke = ({ x, y, prevX, prevY, color, brushSize }, save = true) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();

    if (save) {
      setStrokes((prev) => [
        ...prev,
        { x, y, prevX, prevY, color, brushSize },
      ]);
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

    drawStroke({ x: offsetX, y: offsetY, prevX, prevY, color, brushSize });
    socket.emit("draw", { roomId, x: offsetX, y: offsetY, prevX, prevY, color, brushSize });

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

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `whiteboard-${roomId}.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleClear}>🧹 Clear</button>
        <button onClick={handleUndo} style={{ marginLeft: "10px" }}>
          ↩️ Undo
        </button>
        <button onClick={downloadImage} style={{ marginLeft: "10px" }}>
          💾 Save Whiteboard
        </button>
      </div>
      <canvas
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
