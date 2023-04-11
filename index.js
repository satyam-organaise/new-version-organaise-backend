
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import AuthRouter from './routes/AuthRoutes.js';
import FilesRoute from "./routes/FilesRoute.js";
import CompanyRoute from "./routes/CompanyRoute.js";
import FolderRoute from "./routes/FolderRoute.js";

import bodyParser from 'body-parser';
import helmet from 'helmet';
const app = express();
dotenv.config();
app.use(express.json());


mongoose.set("strictQuery", true);
app.use(helmet({
  referrerPolicy: { policy: 'no-referrer-when-downgrade' }
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



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
app.use("/api/v2/file", FilesRoute);
app.use("/api/v2/company", CompanyRoute);
app.use("/api/v2/folder",FolderRoute);



const expressServer = app.listen(process.env.APP_PORT, () => {
  connect();
  console.log(`Running on ${process.env.APP_PORT}`);
});


