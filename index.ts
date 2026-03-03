import express from "express";


//middlewares
import serverErrorHandler from "./middlewares/serverErrorhandler";

const app = express();
const PORT = 9000;


//middlewares
app.use(express.json());

app.use(serverErrorHandler); //user define error handler

app.listen(PORT, () => {
  console.log("server is listening");
});
