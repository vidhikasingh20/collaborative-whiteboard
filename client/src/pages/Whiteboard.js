import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CanvasBoard from "../components/CanvasBoard";

const Whiteboard = () => {
  const { roomId } = useParams();
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const [tool, setTool] = useState("pen");

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    setTool(isEraser ? "pen" : "eraser");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        width: "200px",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRight: "1px solid #ccc"
      }}>
        <h3 style={{ marginBottom: "20px" }}>🧰 Tools</h3>

        <button onClick={() => { setTool("pen"); setIsEraser(false); }}>🖊️ Pen</button>
        <button onClick={() => { setTool("brush"); setIsEraser(false); }}>🖌️ Brush</button>
        <button onClick={() => { setTool("marker"); setIsEraser(false); }}>✒️ Marker</button>
        <button onClick={() => { setTool("eraser"); setIsEraser(true); }}>⬜ Eraser</button>

        {/* Color Picker */}
        <label style={{ marginTop: "20px", textAlign: "center" }}>
          🎨 Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={isEraser}
            style={{ marginTop: "5px" }}
          />
        </label>

        {/* Brush Size */}
        <label style={{ marginTop: "20px", textAlign: "center" }}>
          ✏️ Size
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ marginTop: "5px", width: "100%" }}
          />
          <div>{brushSize}px</div>
        </label>

        {/* Actions */}
        <button onClick={() => window.dispatchEvent(new CustomEvent("canvas-clear"))} style={{ marginTop: "20px" }}>🧹 Clear</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent("canvas-undo"))} style={{ marginTop: "10px" }}>↩️ Undo</button>
      </div>

      {/* Whiteboard + Room ID header */}
      <div style={{ flex: 1, padding: "20px", textAlign: "center" }}>
        <h2>🎨 Whiteboard Room: <span style={{ color: "darkslateblue" }}>{roomId}</span></h2>
        <CanvasBoard
          roomId={roomId}
          color={isEraser ? "#ffffff" : color}
          brushSize={brushSize}
          tool={tool}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
