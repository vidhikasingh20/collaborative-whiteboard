COLLABORATIVE WHITEBOARD
This is a simple real-time collaborative whiteboard app where multiple users can draw, add shapes, and pick colors together in shared rooms. Perfect for brainstorming, teaching, or just doodling with friends.

HOW THE PROJECT IS ORGANIZED:
client/ — This is the React frontend. It has all the UI stuff like the canvas, buttons, color picker, and pages you interact with.
server/ — This is the backend built with Node.js and Express. It handles the real-time communication using Socket.IO and stores drawing data in a SQLite database.
.gitignore — Keeps unwanted files out of git.

Getting it running on your machine:
1. First, start the backend:
cd server
npm install
node index.js

2. Then, in another terminal, start the frontend:
cd ../client
npm install
npm start

Open your browser and go to http://localhost:3000.
You’ll see a simple page where you can create or join a whiteboard room by entering a Room ID.

What you can do:
Draw freely with a pen tool and erase stuff
Pick colors and adjust brush size
Add shapes like rectangles, circles, triangles, arrows, and straight lines
Save your whiteboard as a PNG image
Work together in real-time with anyone in the same Room ID
All drawings get saved so you can come back later and see what you drew.

A few things to know:
Backend runs on port 5001, so make sure it’s up before starting the frontend
The frontend uses port 3000 by default
The app uses WebSockets (Socket.IO) for real-time syncing
Your strokes get saved in a SQLite database on the backend

