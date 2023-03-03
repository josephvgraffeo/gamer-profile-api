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
        .catch((err) => {
            console.error(err);
            res.status(500).send("Could not get importedGame from games");
        })
}

// post a game from a dropdown to the library status collection you want
export async function postToGamerLibrary(req, res) {
    const { status } = req.params;
    const { _id } = req.params;
    const db = dbConnect();
    const collection = db.collection("userLibrary")
}
