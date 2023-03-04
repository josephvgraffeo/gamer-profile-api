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
                as: "importedGame"
            }
        },
        {
            $unwind: "$importedGame"
        },
        {
            $group: {
                _id: "$_id",
                status: { $first: "$status" },
                games: {
                    $push: {
                        title: "$importedGame.title",
                        cover_image: "$importedGame.cover_image"
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
    const { gameId } = req.body;
    const db = dbConnect();
    const collection = db.collection("userLibrary")

    await db.collection("userLibrary")
        .updateOne({ _id: [_id] })
        .then(() => getGamerLibrary(req, res))
        .catch(err => res.status(500).send({ message: err.message }));
}
