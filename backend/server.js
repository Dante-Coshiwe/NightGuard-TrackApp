import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import guardRoutes from "./routes/guardRoutes.js";
import patrolsRoutes from "./routes/patrolsRoutes.js";
import vehiclesRoutes from "./routes/vehiclesRoutes.js";
import pedestriansRoutes from "./routes/pedestriansRoutes.js";
import incidentsRoutes from "./routes/incidentsRoutes.js";
import deliveriesRoutes from "./routes/deliveriesRoutes.js";
import wheelClampsRoutes from "./routes/wheelClampsRoutes.js";
import obEntriesRoutes from "./routes/obEntriesRoutes.js";
import guardsRoutes from "./routes/guardsRoutes.js";
import sitesRoutes from "./routes/sitesRoutes.js";
import devicesRoutes from "./routes/devicesRoutes.js";
import docketsRoutes from "./routes/docketsRoutes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", locationRoutes);
app.use("/api", guardRoutes);
app.use("/api", patrolsRoutes);
app.use("/api", vehiclesRoutes);
app.use("/api", pedestriansRoutes);
app.use("/api", incidentsRoutes);
app.use("/api", deliveriesRoutes);
app.use("/api", wheelClampsRoutes);
app.use("/api", obEntriesRoutes);
app.use("/api", guardsRoutes);
app.use("/api", sitesRoutes);
app.use("/api", devicesRoutes);
app.use("/api", docketsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("join-device", (deviceId) => socket.join(`device:${deviceId}`));
  socket.on("join-site", (siteId) => socket.join(`site:${siteId}`));
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export { io };