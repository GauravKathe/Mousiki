//const express = require("express");
import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./lib/db.js";
import fileUpload from "express-fileupload";
import path from "path";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";


dotenv.config();

const app = express();
const __dirname=path.resolve();
const PORT = process.env.PORT;

app.use(express.json());  // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:path.join(__dirname,"tmp"),
    createParentPath:true,
    limits:{
        fileSize:10 * 1024 * 1024 // 10 MB maax file size
    }
    
}));

app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statRoutes);

app.use((err,req,res,next) => {
    res.status(500).jason({message: process.env.NODE_ENV === "production" ? "Internal server error":err.message});
})

app.listen(PORT,() =>{
    console.log("Server is running on port "+PORT);
    connectDB();
})

