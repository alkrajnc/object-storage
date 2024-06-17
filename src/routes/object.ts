import { Router } from "express";
import { db } from "../db/config";
import { buckets } from "../db/schema";
import { Bucket } from "../db/schema";
import { readFileSync } from "fs";
import { createLink, generateAccessLink } from "../lib/link";

export const objectRouter = Router();

objectRouter.get("/:objectName/link/create", async (req, res) => {
    const { expiry }: { expiry?: string } = req.query;
    const { objectName } = req.params;
    const { link, token } = await generateAccessLink(objectName);
    await createLink(objectName, token, link, expiry && new Date(expiry));
    res.json({ link });
});
