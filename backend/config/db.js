import mongoose from 'mongoose';

const connectWithRetry = async (retries = 5, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 10000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i}/${retries} failed: ${error.message}`);
      if (i < retries) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  console.warn('⚠️  Could not connect to MongoDB after multiple attempts.');
  console.warn('   → The server will start but database features will not work.');
  console.warn('   → Fix: Whitelist your IP in MongoDB Atlas Network Access settings.');
  console.warn('   → Atlas URL: https://cloud.mongodb.com → Security → Network Access');
};

export const connectDB = async () => {
  await connectWithRetry();
};
