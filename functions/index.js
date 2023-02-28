import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { getAllGames, addGame } from "./src/games.js";
import { getGamerCard, patchGamerCard } from "./src/gamerCard.js";

const app = express();
app.use(cors());

// To Interact with the Game Collection
app.get('/games', getAllGames);
app.post('/games', addGame);

// To Interact with the Gamer Card
app.get('/gamerCard', getGamerCard);
app.patch('/gamerCard/:username', patchGamerCard);

// To Interact with the Gamer Library


export const api = functions.https.onRequest(app);