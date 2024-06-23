import { Router } from "express";
import { db } from "../db/config";
import { buckets } from "../db/schema";
import { Bucket } from "../db/schema";
import { readFileSync } from "fs";
import { createAccessEntry, generateAccessToken } from "../lib/link";
import { restricted } from "../middlewares/auth";

export const objectRouter = Router();

objectRouter.get("/:objectName/token/create", restricted, async (req, res) => {
    const { expiry }: { expiry?: string } = req.query;
    const { objectName } = req.params;
    const token = await generateAccessToken(objectName);
    await createAccessEntry(objectName, token, expiry && new Date(expiry));
    res.json({ token });
});
