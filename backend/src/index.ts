import express from "express";
import cors from "cors";
import TaskRoute from "./routes/TaskRoute.js";
import AuthRouter from "./routes/AuthRoute.js"
import UserRoute from "./routes/UserRoute.js"
import HistoryRoute from "./routes/HistoryRoute.js"
import path from "path";
import dotenv from "dotenv"

dotenv.config()
const app = express();

const port = 3010;

// CORS pour permettre les requêtes depuis le frontend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // URLs du frontend Vite
  credentials: true
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

app.use("/tasks", TaskRoute);
app.use("/auth", AuthRouter)
app.use("/users", UserRoute);
app.use("/history", HistoryRoute);

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
