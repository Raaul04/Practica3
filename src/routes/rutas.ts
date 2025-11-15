import { Router } from "express";
import { getDB } from "../mongo";
import { ComicVault } from "../types";
import { Response } from "express";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";
import { ObjectId } from "mongodb";




const router = Router()

const coleccion = () => getDB().collection<ComicVault>("comics")


router.get("/", verifyToken, async (req: AuthRequest, res) => {
    try {

        const page = Number(req.query?.page) || 1
        const limit = Number(req.query?.limit) || 30
        const skip = (page - 1) * limit

        const usercito = req.userJwt as {
            id: string,
            name: string
        }

        const comics = await coleccion().find({ userId: usercito.id }).skip(skip).limit(limit).toArray()

        res.status(200).json(
            {
                info: {
                    page: page,
                    numeroComics: limit
                },
                comics: comics,

                user: req.userJwt,
                message: "todo correcto",


            }

        )


    } catch (error) {
        res.status(404).json(error);
    }
})

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
    try {

        const { title, author, year, publisher } = req.body as ComicVault

        if (!title || !author || !year) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        if (publisher && typeof publisher !== "string") {
            return res.status(400).json({ message: "Publisher no válido" });
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
        res.status(500).json({ message: error })
    }
})

router.put("/:id", verifyToken, async (req: AuthRequest, res: Response) => {
    try {

        const { title, author, year, publisher } = req.body as ComicVault
        const comics = coleccion()

        if (!title || !author || !year) {
            return res.status(400).json({ message: "Faltan datos en el body" })
        }

        if (publisher && typeof publisher !== "string") {
            return res.status(400).json({ message: "Publisher no válido" });
        }

        const usercito = req.userJwt as {
            id: string,
            name: string
        }

        const comicUpdate = await comics.updateOne(
            { _id: new ObjectId(req.params.id), userId: usercito.id },
            { $set: req.body }
        )

        if (comicUpdate.matchedCount === 0) {
            return res.status(400).json({ message: "No se encontro el comic o no pertenece a ese usuario" })
        }
        if (comicUpdate.modifiedCount === 0) {
            return res.status(400).json({ message: "No se ha modificado nada" })
        }

        res.status(200).json({
            IdComicActualizado: req.params.id,
            cambios: req.body,
            message: "Comic Actualizado",

        })




    } catch (error) {
        res.status(500).json({ message: error })

    }
})

//router.delete("/:id")


export default router