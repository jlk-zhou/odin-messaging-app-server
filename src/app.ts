import "dotenv/config";
import cors from "cors";
import express from "express";

import routes from "./routes/index.ts";
import errorHandler from "./errors/errorHandler.ts";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";

const app = express();
app.all("/api/auth/{*any}", toNodeHandler(auth));

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/chats", routes.chats);
app.use("/users", routes.users);

app.use(errorHandler);

export default app;
