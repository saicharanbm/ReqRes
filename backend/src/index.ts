import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { router } from "./routes";
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin : ", origin);
      //for the dev environment i am allowing all the ports of localhost to access the api server
      if (!origin || origin === "http://localhost:5173") {
        // Allow if origin is from localhost with any port
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS")); // Block other origins
      }
    },
    credentials: true, // Enable credentials (cookies)
  })
);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", router);
app.listen(3000, () => {
  console.log("Server is listening to port 3000.");
});
