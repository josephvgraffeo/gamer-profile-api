import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect.js";

// GET: All games from the games collection
export async function getAllGames(req, res) {
    const db = dbConnect();
    const collection = await db.collection("games").find({}).limit(20).toArray();
    
    console.table(collection);
    res.send(collection);
}

//POST: A game to the games collection
export async function addGame(req, res) {
    const newGame = req.body

    const db = dbConnect();
    const collection = db.collection("games").insertOne(newGame)
        .catch(err => {
            res.status(500).send(err)
            return
        });
        res.status(201).send({message: "New game added to collection"})
};