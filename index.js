import express from 'express'
import cors from 'cors'



const app=express()
const PORT= 9000


//middlewares
app.use(cors())
app.use(express.json())



app.listen(PORT,()=>{
    console.log("server is listening")
})