import { connectMongoDB } from "./db/mongo.con.js";
import { logger } from "./logger.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://gister:notebook@mongodb:27017/gisterdb?authSource=admin";

;(async () => {
  try {
    // Use MONGO_URI here directly
    await connectMongoDB(MONGO_URI);
    logger.info(
      { event: "MONGO_CONNECTED" },
      "MongoDb successfully connected"
    );
  } catch (error: unknown) {
    logger.error(error, "MongoDb connection error from mongo_config");
  }
})();