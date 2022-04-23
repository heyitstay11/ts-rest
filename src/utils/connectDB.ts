import mongoose from "mongoose";
import config  from "config";

const  MONGO_URI = config.get<string>('MONGO_URI');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {});
        console.log('Connected to DB');
    } catch (error) {
        console.log(error);
        process.exit(1);    
    }
}

export default connectDB;