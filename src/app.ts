import "dotenv/config";
import cors from "cors";
import express from "express";

import routes from "./routes/index.ts";
import errorHandler from "./errors/errorHandler.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use("/users", routes.users);

app.use(errorHandler);

export default app;
