import express from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/v1", router);
app.listen(3000, () => {
  console.log("Server is listening to port 3000.");
});
