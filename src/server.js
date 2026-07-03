import { pathToFileURL } from "node:url";

import "dotenv/config";

import app from "./app.js";
import { connectToDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT) || 8080;
const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
}

export {
  app,
};
