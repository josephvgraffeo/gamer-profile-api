import { MongoClient } from "mongodb";
import { mongoCredentials } from "../service_account.js";

export function dbConnect() {
    const client = new MongoClient(mongoCredentials.URI);
    return client.db(mongoCredentials.DB);
};