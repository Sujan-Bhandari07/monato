import express from "express";
import { connectdb } from "./config/db.js";

import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import { userrouter } from "./routes/userroutes.js";
dotenv.config()
import{app,server} from "./socket/socket.js"
import { resturantrouter } from "./routes/resturantroute.js";



const port = process.env.PORT || 9000;



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/user",userrouter)
app.use("/api/v1/resturant",resturantrouter)


server.listen(port, () => {
    console.log("app listening");
    connectdb()
});


