
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import AuthRouter from './routes/AuthRoutes.js';
import FilesRoute from "./routes/FilesRoute.js";
const app = express();
dotenv.config();
app.use(express.json());


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongodb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

app.use(cors());
app.use('/api', AuthRouter);//////login, signup , forget password, change password, resend otp
app.use("/api/v2/file",FilesRoute);
const expressServer = app.listen(process.env.APP_PORT, () => {
  connect();
  console.log(`Running on ${process.env.APP_PORT}`);
});


