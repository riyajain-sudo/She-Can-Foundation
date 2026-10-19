import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: clientUrl }));
app.use(express.json({ limit: "16kb" }));
app.use((error, _req, res, next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large." });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, message: "Request body must be valid JSON." });
  }
  return next(error);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "She Can Foundation API" });
});
app.use("/api/contacts", contactRoutes);

await connectDB();
app.listen(port, () => console.log(`Server running on port ${port}`));
