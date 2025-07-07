# 🎨 Collaborative Whiteboard:
The *Collaborative Whiteboard*, a real-time drawing application that lets multiple users sketch together on the same canvas — no matter where they are.
Built using React on the frontend and Node.js + Socket.io on the backend, this project supports live drawing, undo, clearing the board, and changing tools — all while keeping things synced between users and saved in a database.

## 🚀 What’s Working So Far:
- ✍️ **Tool Selection**: We’ve added Pen, Brush, Marker, and Eraser tools. You can pick your favorite one to draw with different effects.
- 🎯 **Dynamic Cursors**: When you select a tool, the cursor actually changes to show a pen, brush, or eraser emoji/icon. It makes the drawing feel natural and fun.
- ↩️ **Undo Last Stroke**: Made a mistake? Click the undo button and the last stroke will disappear.
- 🧹 **Clear the Canvas**: Want to start fresh? Just hit the clear button and everything gets wiped for everyone in the room.
- 🧠 **Tool Bar UI**: All tools now live in a neat sidebar on the left side of the screen.
- 💾 **Data Saved in Database**: Every stroke drawn is saved in a SQLite database so we can track session history.

  ## 🔧 Technology Stack:
  
  **Frontend (React)**  
- React (with hooks)  
- Socket.IO client  
- Custom CSS for toolbar and dynamic cursors  
**Backend (Node.js + Express)**  
- Express server  
- Socket.IO for real-time communication  
- SQLite3 for persistent stroke/session storage
- 
 ## 📁 Project Structure Overview
whiteboard-project/
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ │ └── CanvasBoard.js # Main whiteboard component
│ │ ├── canvas-cursors.css # Custom cursors based on tool
│ │ └── App.js, socket.js
├── server/ # Node.js Backend
│ ├── index.js # Socket.IO + Express server
│ └── db.js # SQLite setup for sessions and strokes

Start the Backend:
Go into the server/ folder and run the backend:
cd server
npm install
npm run dev
🟢 This will start the backend on http://localhost:5000
✅ You should see: “✅ Whiteboard backend server is running.”

 Start the Frontend:
 Now, start the React frontend:
cd ../client
npm install
npm start
🌐 It will run at: http://localhost:3000

Now after clicking on the url, you have to enter the roomID and you will be able to access the canvas or the whitebaord and you can draw, write through various tools like pen, brush, marker you can chose colour of your own from the colour pallette and incase of anything wrong you can undo the action or clear the page or just simple erase the wrong part using eraser. after that you will be able to save your whitebaord in the form of image as well. so you will be able to store all the information.





