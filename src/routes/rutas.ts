import { Router } from "express";
import { getDB } from "../mongo";
import { ComicVault } from "../types";
import { NextFunction, Request, Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";




const router = Router()

const coleccion = () => getDB().collection<ComicVault>("comics")


router.get("/", verifyToken, async (req: AuthRequest, res) => {
    try {

        const page = Number(req.query?.page) || 1
        const limit = Number(req.query?.limit) || 30
        const skip = (page - 1) * limit

        const usercito= req.userJwt as {
            id:string,
            name:"string"
        }

        const comics = await coleccion().find({userId:usercito.id}).skip(skip).limit(limit).toArray()

        res.status(200).json(
            {
                info: {
                    page: page,
                    numeroComics: limit
                },
                comics: comics,

                message: "todo correcto",
                user: req.userJwt
            }

        )


    } catch (error) {
        res.status(404).json(error);
    }
})

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
    try {

        const { title, author, year, publisher } = req.body as ComicVault

        if (!title || !author || !year || !publisher) {
            return res.status(400).json({ message: "Faltan datos" });
        }
        
        const usercito = req.userJwt as {
            id: string,
            name: string
        }

        const comics = coleccion()

        const nuevoComic: ComicVault = {
            title,
            author,
            year,
            publisher,
            userId: usercito.id
        }

        const result = await comics.insertOne(nuevoComic)
        res.status(201).json(
            {
                message: "Se ha creado el comic ",
                nuevoComic: nuevoComic,
                id: result.insertedId
            },

        )

    } catch (error) {
        res.status(500).json({message:error})
    }
})

//router.put("/:id",)

//router.delete("/:id")


export default router