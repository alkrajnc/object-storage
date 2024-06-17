import { Router } from "express";
import * as controller from "../controllers/index";
import { upload } from "../middlewares/fileUpload";
import { getUrl, newObject } from "../lib/fetcher";
import { db } from "../db/config";
import { Bucket, buckets, objects } from "../db/schema";
import { eq } from "drizzle-orm";
import { checkBucketType } from "../middlewares/checkBucketType";
import { readFileSync, statSync } from "fs";
import { validator } from "../middlewares/auth";

export const bucketRouter = Router();

bucketRouter.post("/new", async (req, res) => {
    const { bucket } = req.body;
    await db.insert(buckets).values({ ...bucket });
    res.json({ message: "Success", data: { ...bucket } });
});
bucketRouter.post(
    "/:bucketId/object/upload/single",
    upload.single("myfile"),
    (req, res) => {
        if (req.file) {
            newObject({
                path: req.file.path,
                name: req.file.filename,
                bucketId: Number(req.params.bucketId),
                id: 0,
            });
            console.log("File uploaded successfully:", req.file);
            res.send("File uploaded! Correctly");
        } else {
            console.error("Upload failed!");
            res.status(400).send("Failed to upload file!");
        }
    },
);
bucketRouter.get("/:bucketId/objects/list", async (req, res) => {
    const objectList = await db
        .select()
        .from(objects)
        .where(eq(objects.bucketId, Number(req.params.bucketId)));
    res.json({ objectList });
});
bucketRouter.get("/:bucketName/:link", validator, async (req, res) => {
    const filePath = await getUrl(
        req.params.bucketName,
        req.params.link.split("?")[0],
    );
    const fileBuffer = readFileSync(filePath);
    res.header("Content-Type", "image/png");
    res.send(fileBuffer);
});
