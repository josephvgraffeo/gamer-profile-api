import { ObjectId } from "mongodb";
import { dbConnect } from "./dbConnect.js";

// get all library games
export async function getGamerLibrary(req, res) {
    const { status } = req.params;
    const db = dbConnect();
    const collection = db.collection("userLibrary");

    const getGameFromGames = [
        {
            $match: { status: status }
        },
        {
            $unwind: "$gameId"
        },
        {
            $lookup: {
                from: "games",
                localField: "gameId",
                foreignField: "_id",
                as: "foundGame"
            }
        },
        {
            $unwind: "$foundGame"
        },
        {
            $group: {
                _id: "$_id",
                status: { $first: "$status" },
                games: {
                    $push: {
                        title: "$foundGame.title",
                        cover_image: "$foundGame.cover_image"
                    }
                }
            }
        }
    ];

    collection.aggregate(getGameFromGames).toArray().then((result) => {
        res.json(result);
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

// post a game from a dropdown to the library status collection you want
export async function updateGamerLibrary(req, res) {
    const { status } = req.params;
    const { gameId, _id } = req.body;
    const db = dbConnect();
    const collection = db.collection("userLibrary")

    await db.collection("userLibrary")
        .updateOne({ status: status }, { $addToSet: { gameId: new ObjectId(_id) } })
        .then(() => getGamerLibrary(req, res))
        .catch(err => res.status(500).send({ message: err.message }));
}

// add additional information from user library to database
export async function addAdditionalEntryInfo(req, res) {
    const { gameId, rating, hours, platform, comments } = req.body;
    const db = dbConnect();

    await db.collection("userLibraryEntryInfo")
        .insertOne({ gameId: gameId, rating: rating, hours: hours, platform: platform, comments: comments })
        .then(() => getGamerLibrary(req, res))
        .catch(err => res.status(500).send({ message: err.message }));
}

// get extra info about user entry in library
export async function getAdditionalEntryInfo(req, res) {
    const { gameId } = req.params;
    const db = dbConnect();
    const collection = await db.collection("userLibraryEntryInfo").findOne({ gameId: gameId });
    
    res.send(collection);
}

// delete game from library
export async function removeLibraryEntry(req, res) {
    const { status, gameId } = req.params;
    const db = dbConnect();
    const collection = db.collection("userLibrary")

    collection.updateOne(
        { status: status },
        { $pull: { gameId: new ObjectId(gameId) } })
            .then(result => res.send({ message: "game removed" }))
            .catch(err => console.error(err))
}