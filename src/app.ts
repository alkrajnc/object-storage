import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { index } from "./routes/index";
import { authenticator } from "./middlewares/auth";
// Create Express server
export const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use(logger("dev"));

app.use("/assets", express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
    if (req.url.startsWith("/storage")) {
        authenticator(req, res, next);
    } else {
        next();
    }
});

app.use("/storage", express.static(path.join(__dirname, "../public")));

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.use("/", index);
