import mongoose from 'mongoose'; //mongoose for structure mongo db
import dotenv from 'dotenv';

dotenv.config();

//connect mongoose to the database
const connectDB = async () => {
  try {
    // Dual database local database for development and atles database for production
    const dbURL = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : process.env.LOCAL_MONGO_URL;
    if(!dbURL){
      console.log("URL is missing")
    }
    const connect = await mongoose.connect(dbURL);
    console.log("mongoose connected");
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};


export default connectDB;