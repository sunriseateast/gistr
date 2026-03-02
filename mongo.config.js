import { connectMongoDB } from "./db/mongo.con.js";
import { logger } from "./logger.js";

;(async()=>{
    try{
        await connectMongoDB('http://MONGO_IP:MOMGO_PORT')
        logger.info({
            event:"MONGO_CONNECTED"
        },"MongoDb successfully connected")
    }
    catch(error){
        logger.error(error,"MongoDb connection error from mongo_config")
    }
})()