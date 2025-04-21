import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to Mongo DB ${conn.connection.host}`);
    } catch (error) {
        console.log("Failed to Connect Mongo DB",error);
        process.exit(1);//1 is failure and 0 is success msg        
    }
}