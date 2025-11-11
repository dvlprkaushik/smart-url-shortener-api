import express, { Request, Response } from "express";
import dotenv from "dotenv";
import pkg from "../package.json";
import { listener } from "./listener.js";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// ✅ Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running 🚀",
  });
});

// ✅ Info route from package.json
app.get("/info", (_req: Request, res: Response) => {
  res.status(200).json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    repository: pkg.repository?.url.split("+")[1] || "N/A",
    license: pkg.license,
  });
});

// Server Listen
listener(app, PORT, pkg);
