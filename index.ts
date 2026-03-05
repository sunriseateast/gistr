import express from "express"

//middlewares
import serverErrorHandler from "./middlewares/serverErrorhandler.ts"

//routes
import analytics_routes from './routes/analytics.routes.ts'
import search_routes from './routes/search.routes.ts'
import tag_routes from './routes/tags.routes.ts'



const app = express()
const PORT = 9000


//middlewares
app.use(express.json());
app.use('/app',analytics_routes)
app.use('/app',search_routes)
app.use('/app',tag_routes)


app.use(serverErrorHandler) //user define error handler


app.listen(PORT, () => {
  console.log("server is listening");
});
