import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import userRoute from "./router/user.route.js";


// __dirname setup for ES Module--
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3003",
  "https://job-portal-user-frontend.vercel.app",
  "https://job-portal-frontend-sigma-silk.vercel.app",
  "http://192.168.10.101:3000",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("hi i am bhalojob...");
});

// Static file serve

app.use('/public/upload', express.static(path.join(__dirname, '../public/upload')));



// Routes
app.use("/api/v1", userRoute);


export { app };
