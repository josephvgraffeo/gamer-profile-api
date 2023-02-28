import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect.js";

// get gamer card
export async function getGamerCard(req, res) {
    const db = dbConnect();
    const collection = await db.collection("userGamerCard").find({}).limit(10).toArray();
    
    console.table(collection);
    res.send(collection);
}

// update gamercard by username
export async function patchGamerCard(req, res) {
    const { username } = req.params;
    const { greeting, about, gamertags } = req.body;
    const db = dbConnect();
    
    await db.collection("userGamerCard")
        .updateOne({ username: username }, { $set: {greeting: greeting, about: about, gamertags: gamertags } })
        .then(() => getGamerCard(req, res))
        .catch(err => res.status(500).send({ message: err.message }));
}