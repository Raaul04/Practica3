import { Router } from "express";
import { getDB } from "../mongo";
import { ComicVault } from "../types";
import { NextFunction, Request, Response } from "express";



const router = Router()

const coleccion = () => getDB().collection<ComicVault>("comics")


router.get("/", async (req, res) => {
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
                comics: comics
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