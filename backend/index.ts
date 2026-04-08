import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { employeeRouter } from "./routes/employees";
import { authRouter } from "./routes/auth";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "change-me-in-production",
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
