import { Router } from "express";
import * as controller from "../controllers/index";
import { bucketRouter } from "./bucket";
import { objectRouter } from "./object";

export const index = Router();

index.use("/bucket", bucketRouter);
index.use("/object", objectRouter);
