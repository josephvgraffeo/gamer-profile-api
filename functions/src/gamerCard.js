import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect.js";

export async function getGamerCard(req, res) {
    const db = dbConnect();
    const collection = await db.collection("userGamerCard").find({}).limit(10).toArray();
    
    console.table(collection);
    res.send(collection);
}