
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import AuthRouter from './routes/AuthRoutes.js';
import FilesRoute from "./routes/FilesRoute.js";
import CompanyRoute from "./routes/CompanyRoute.js";
import FolderRoute from "./routes/FolderRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";

import bodyParser from 'body-parser';
import helmet from 'helmet';
import { Server } from 'socket.io';
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
app.use("/api/v2/folder", FolderRoute);
app.use("/api/v2/chat", chatRoute);
app.use("/api/v2/message", messageRoute);


const expressServer = app.listen(process.env.APP_PORT, () => {
  connect();
  console.log("Connected to backend");
});




const io = new Server(expressServer, {
  pingTimeout: 60000,
  cors: {
    origin: [
       process.env.PRDO_URL
      //"http://localhost:3000"
    ],
    path: "/" + "socketio"
    //process.env.NODE_ENV === 'production' ? process.env.PRDO_URL : process.env.DEV_URL
  }
})


// const expressServer = app.listen(process.env.APP_PORT, () => {
//   connect();
//   console.log(`Running on ${process.env.APP_PORT}`);
// });



io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  ///// Here setup the login user
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  })

  /////Check which chat is active;
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room");
  })

  ////// When user typeing start
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  ///// Check new recived message
  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return console.log("chat.user not defined");
    chat.users.forEach(user => {
      if (user._id === newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recived", newMessageRecived);
    });
  })

})

