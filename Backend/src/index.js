import express from 'express' ;
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import goalRoutes from './routes/goal.route.js';
import scheduleRoutes from './routes/schedule.route.js'

const app = express() ;

import path from 'path';
import { ConnectDB } from './lib/db.js';

dotenv.config();

const PORT = process.env.PORT ;
const __dirname = path.resolve();

app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({limit:"10mb" , extended:true}));

app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}
))

app.use("/api/auth" , authRoutes) ;
app.use("/api/goal" , goalRoutes) ;
app.use("/api/schedule" , scheduleRoutes) ;

app.listen(PORT , () => {
    console.log("Server is running on PORT:" +PORT);
    ConnectDB();
});