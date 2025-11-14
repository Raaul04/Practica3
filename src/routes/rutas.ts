import { Router } from "express";
import { getDB } from "../mongo";
import { ComicVault } from "../types";
import { NextFunction, Request, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";



const router = Router()

const coleccion = () => getDB().collection<ComicVault>("comics")


router.get("/", verifyToken, async (req:AuthRequest, res) => {
    try {

        const page = Number(req.query?.page) || 1
        const limit = Number(req.query?.limit) || 30
        const skip = (page - 1) * limit

        const comics = await coleccion().find().skip(skip).limit(limit).toArray()

        res.status(200).json(
            {
                info: {
                    page: page,
                    numeroComics: limit
                },
                comics: comics,

                message:"todo correcto",
                user:req.user
            }

        )


    } catch (error) {
        res.status(404).json(error);
    }
})

//router.post("/",)

//router.put("/:id",)

//router.delete("/:id")


export default router