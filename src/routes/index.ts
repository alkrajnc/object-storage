import { Router } from "express";
import * as controller from "../controllers/index";
import { bucketRouter } from "./bucket";
import { objectRouter } from "./object";
import { dashboardRouter } from "./dashboard";
import session from "express-session";

export const index = Router();

declare module "express-session" {
    export interface SessionData {
        user: { username: string; image?: string };
    }
}

index.use(
    session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        secret: process.env.SESSION_SECRET as string,
    }),
);

index.use("/bucket", bucketRouter);
index.use("/object", objectRouter);
index.use("/dashboard", dashboardRouter);
