import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CanvasBoard from "../components/CanvasBoard";
import { FaEraser, FaPen, FaSave } from "react-icons/fa"; 

const Whiteboard = () => {
  const { roomId } = useParams();
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);

  const toggleEraser = () => setIsEraser(!isEraser);

  const downloadImage = () => {
    const canvas = document.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `whiteboard-${roomId}.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🎨 Whiteboard Room: <span style={{ color: "darkslateblue" }}>{roomId}</span></h2>

      {/* Tools */}
      <div style={{ marginBottom: "15px", display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
        {/* Color Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={isEraser}
          title="Choose Brush Color"
        />

        {/* Eraser Toggle */}
        <button
          onClick={toggleEraser}
          title={isEraser ? "Switch to Pen" : "Switch to Eraser"}
          style={{
            fontSize: "20px",
            padding: "8px",
            borderRadius: "6px",
            cursor: "pointer",
            border: "1px solid #aaa",
            backgroundColor: isEraser ? "#f8d7da" : "#e2e3e5"
          }}
        >
          {isEraser ? <FaPen /> : <FaEraser />}
        </button>

        {/* Brush Size Slider */}
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          title="Brush Size"
        />
        <span>{brushSize}px</span>

        {/* Save Image Button */}
        <button
          onClick={downloadImage}
          title="Save Whiteboard"
          style={{
            fontSize: "16px",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "#d4edda",
            border: "1px solid #28a745",
            cursor: "pointer"
          }}
        >
          <FaSave style={{ marginRight: "5px" }} /> Save
        </button>
      </div>

      {/* Canvas Board */}
      <CanvasBoard
        roomId={roomId}
        color={isEraser ? "#ffffff" : color}
        brushSize={brushSize}
      />
    </div>
  );
};

export default Whiteboard;
