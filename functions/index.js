import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import { getAllGames, addGame } from "./src/games.js";
import { getGamerCard, patchGamerCard } from "./src/gamerCard.js";
import { addAdditionalEntryInfo, getAdditionalEntryInfo, getGamerLibrary, updateGamerLibrary } from "./src/gamerLibrary.js";

const app = express();
app.use(cors());

// To Interact with the Game Collection
app.get('/games', getAllGames);
app.post('/games', addGame);

// To Interact with the Gamer Card
app.get('/gamerCard', getGamerCard);
app.patch('/gamerCard/:username', patchGamerCard);

// To Interact with the Gamer Library
app.get('/gamerLibrary/:status', getGamerLibrary);
app.post('/gamerLibrary/:status', updateGamerLibrary);
app.get('/entryInfo/:gameId', getAdditionalEntryInfo);
app.post('/entryInfo', addAdditionalEntryInfo);

export const api = functions.https.onRequest(app);