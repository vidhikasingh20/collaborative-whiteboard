const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("✅ Whiteboard backend server is running.");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`🔗 User ${socket.id} joined room ${roomId}`);

    db.run(
      `INSERT OR IGNORE INTO sessions (session_id, created_by) VALUES (?, ?)`,
      [roomId, "anonymous"]
    );

    db.all(
      `SELECT * FROM strokes WHERE session_id = ? ORDER BY timestamp ASC`,
      [roomId],
      (err, rows) => {
        if (err) {
          console.error("❌ Failed to fetch strokes:", err.message);
          return;
        }

        rows.forEach((stroke) => {
          socket.emit("draw", {
            roomId,
            x: stroke.x,
            y: stroke.y,
            prevX: stroke.prevX,
            prevY: stroke.prevY,
            color: stroke.color,
            brushSize: stroke.brushSize,
          });
        });
      }
    );
  });

  socket.on("draw", (data) => {
    socket.to(data.roomId).emit("draw", data);

    db.run(
      `INSERT INTO strokes (session_id, x, y, prevX, prevY, color, brushSize) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.roomId,
        data.x,
        data.y,
        data.prevX,
        data.prevY,
        data.color,
        data.brushSize,
      ],
      (err) => {
        if (err) {
          console.error("❌ Error inserting stroke:", err.message);
        }
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
