import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import characterRoutes from "./routes/character.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Backend is running",
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);

export default app;