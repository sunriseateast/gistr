// mongo_config.ts
import { connectMongoDB } from "./db/mongo.con.js";
import { logger } from "./logger";

(async ()=>{
  try {
    // Make sure to replace with proper Mongo URI
    await connectMongoDB("http://MONGO_IP:MONGO_PORT");
    logger.info(
      {
        event: "MONGO_CONNECTED",
      },
      "MongoDb successfully connected"
    );
  } 
  catch (error: unknown) {
    logger.error(error, "MongoDb connection error from mongo_config");
  }
})();