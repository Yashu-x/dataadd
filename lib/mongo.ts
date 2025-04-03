import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || "mongodb+srv://nthashenu:yashu2001@cluster0.548vb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongo():Promise<void> {
    if(!mongoURI){
        console.error("Mongo URI is not defined. Please set the MONGO_URI environment variable.");
    }

    try{
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    }catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectToMongo();

export {connectToMongo};