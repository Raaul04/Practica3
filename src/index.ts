import express from "express"
import dotenv from "dotenv"
import { connectMongo } from "./mongo"
import rutas from "./routes/rutas"
import autentificacion from "./routes/auth"

dotenv.config()


connectMongo()
const app=express()
app.use(express.json())
app.use("/comics",rutas )
app.use("/auth", autentificacion)


app.listen(3000, () => console.log("El API ha comenzado baby"));