import express from "express";

import accountRouter from "./routes/account.router.js";
import errorHandler from "./middlewares/error.middleware.js";
import forumRouter from "./routes/forum.router.js";

const app = express();

app.use(express.json());
app.use("/account", accountRouter);
app.use("/forum", forumRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

export default app;
