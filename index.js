import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import Routers
import userRouter from "./routes/auth.routes.js";

// Import custom middlewares
import { sendErrorResponse } from "./middlewares/general.middlewares.js";

// ENV setup & DB Connection
dotenv.config();
mongoose
  .connect(process.env.DB_CONN_STR)
  .then((res) => console.log("Connected to the database."))
  .catch((err) => console.log("Couldn't connect to the Database.", err));

// Create server & use necessary middlewares
const app = express();
app.use(express.json());
app.use(express.static("static"));

// use routers
app.use("/api/users/", userRouter);

// use custom middlewares
app.use(sendErrorResponse);

// Bind server to PORT & start listening
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});