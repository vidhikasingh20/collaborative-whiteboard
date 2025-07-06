import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!roomId.trim()) {
      alert("Please enter a valid Room ID");
      return;
    }
    navigate(`/whiteboard/${roomId}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🎨 Join or Create a Whiteboard Session</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px", marginBottom: "20px" }}
      />
      <button
        onClick={handleJoin}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Enter Room
      </button>
    </div>
  );
};

export default Home;
