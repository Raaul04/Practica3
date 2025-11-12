import { Router } from "express";
import { getDB } from "../mongo";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"



dotenv.config()

const router = Router()



type User = {
  _id?: ObjectId;
  name: string;
  password: string;
};

type JwtPayload = {
  id: string;
  name: string;
};


const coleccion = () => getDB().collection<User>("users")


router.get("/", async (req, res) => {
    res.send("Se ha conectado a la ruta de auth correctamente");
});


router.post("/register", async (req, res) => {
    try {




    } catch (error) {
        res.status(500).json({ message: error });
    }
})

router.post("/login", async (req, res) => {
    try {




    } catch (error) {
        res.status(500).json({ message: error });
    }
})




export default router