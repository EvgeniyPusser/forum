import mongoose from "mongoose";

import { ensureDefaultAdmin } from "../services/account.service.js";

export async function connectToDatabase() {
  const { MONGO_URI, DB_NAME } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not set.");
  }

  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME || undefined,
  });

  await ensureDefaultAdmin();
}
