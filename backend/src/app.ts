import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.routes";
import characterRoutes from "./routes/character.routes";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/generated-images",
  express.static(path.join(process.cwd(), "generated-images"))
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    message: "Backend is running",
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/characters", characterRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;