import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import  errorMiddleware  from "./api/middlewares/error.Middleware";
import { UserRoute } from "./api/routes";

import { statusCode } from "./api/types/types";
import { Router } from "express";


// 📦 Importing Routes
import {
  AdminRoute,
  
} from "./api/routes";


// 🚀 Initialize express application
const app = express();

// 🛡️ Security and utility middlewares
app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(helmet());
app.use(morgan("dev"));
// app.use(
//   cors({
//     origin: [ENV.FRONTEND_URL as string, ENV.FRONTEND_URL1 as string],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//   })
// );
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //⌛ 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      status: 429,
      message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// 🩺 Health check endpoint
app.get("/", (_, res) => {
  res.send("Hello World");
});

// 🧭 API routes configuration
app.use("/api/v1/admin", AdminRoute);
 app.use("/api/v1/user", UserRoute);




// ⚠️ Global error handling middleware
app.use(errorMiddleware);

// 📤 Export the configured app
export default app;
