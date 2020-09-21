import mongoose from "mongoose";
// import config from "config";

// const db: string = config.get("mongoURI");

const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log(`Error connecting to database: ${error}`);
  }
};

export { connectDB };
