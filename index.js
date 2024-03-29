import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routers
import userRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";

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
app.use(cors({ origin: process.env.FRONTEND_ENDPOINT }));
app.use(express.json());
app.use(express.static("static"));

// use api routes
app.use("/api/users/", userRouter);
app.use("/api/chats/", chatRouter);
app.use("/api/messages/", messageRouter);

// use custom middlewares
app.use(sendErrorResponse);

// Bind server to PORT & start listening
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
