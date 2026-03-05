import express from "express"
import 'dotenv/config'


//middlewares
import serverErrorHandler from "./middlewares/serverErrorhandler.js"

//routes
import analytics_routes from './routes/analytics.routes.js'
import search_routes from './routes/search.routes.js'
import tag_routes from './routes/tags.routes.js'

//connect mongodb
import "./mongo.config.js";

const app = express()
const PORT = process.env.PORT || 7000


//middlewares
app.use(express.json());
app.use('/app/get-analytics',analytics_routes)
app.use('/app',search_routes)
app.use('/app',tag_routes)


app.use(serverErrorHandler) //user define error handler


app.listen(PORT, () => {
  console.log(`server is listening on port:${PORT}`);
});
