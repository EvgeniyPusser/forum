import express from "express";

import forumRouter from "./routes/forum.router.js";

const app = express();

app.use(express.json());
app.use("/forum", forumRouter);

app.use((error, _request, response, next) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ message: "Invalid JSON body." });
    return;
  }

  if (error.name === "CastError") {
    response.status(404).json({ message: "Not found" });
    return;
  }

  if (error.name === "ValidationError") {
    response.status(400).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Internal server error." });
});

app.use((_request, response) => {
  response.status(404).json({ message: "Not found" });
});

export default app;
