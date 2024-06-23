import { Router } from "express";
import * as controller from "../controllers/index";
import { upload } from "../middlewares/fileUpload";
import { getObject, getUrl, newObject } from "../lib/fetcher";
import { db } from "../db/config";
import { Bucket, buckets, objects } from "../db/schema";
import { eq } from "drizzle-orm";
import mime from "mime-types";
import { readFileSync, statSync } from "fs";
import { isBucketPublic, validator } from "../middlewares/auth";
import "dotenv/config";
import { navlist } from "./dashboard";
import { validateAccessToken } from "../lib/auth";
export const bucketRouter = Router();

bucketRouter.post("/new", async (req, res) => {
    const { bucket } = req.body;
    await db.insert(buckets).values({ ...bucket });
    res.json({
        message: "Success",
        data: { ...bucket },
    });
});
bucketRouter.post(
    "/:bucketId/object/upload/single",
    upload.single("object"),
    (req, res) => {
        if (req.file) {
            newObject({
                path: req.file.path,
                name: req.file.filename,
                bucketId: Number(req.params.bucketId),
                size: req.file.size,
                mimetype: req.file.mimetype,
                id: 0,
            });
            console.log("File uploaded successfully:", req.file);
            res.render("new-object", {
                message: "File uploaded successfully!",
                error: false,
                user: {
                    username: req.session.user.username,
                    image: req.session.user.image,
                },
                bucketId: req.params.bucketId,
                title: `Bucket::Upload`,
                activeLink: "Buckets",
                navlist,
            });
        } else {
            console.error("Upload failed!");
            res.render("new-object", {
                message: "Failed to upload file",
                error: true,
                user: {
                    username: req.session.user.username,
                    image: req.session.user.image,
                },
                bucketId: req.params.bucketId,
                title: `Bucket::Upload`,
                activeLink: "Buckets",
                navlist,
            });
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
/* bucketRouter.get("/:bucketName/:link", validator, async (req, res) => {
    const filePath = await getUrl(
        req.params.bucketName,
        req.params.link.split("?")[0],
    );
    const fileBuffer = readFileSync(filePath);
    res.header("Content-Type", "image/png");
    res.send(fileBuffer);
}); */

bucketRouter.get("/:bucketName/:objectName", async (req, res) => {
    const { bucketName, objectName } = req.params;
    const { accessToken } = req.query;
    const isPublic = await isBucketPublic(bucketName);
    if (isPublic) {
        const object = await getObject(objectName);
        const file = readFileSync(object.path);
        res.header("Content-Type", object.mimetype);
        res.send(file);
        return;
    }
    if (accessToken) {
        if (await validateAccessToken(objectName, accessToken as string)) {
            const object = await getObject(objectName);
            const file = readFileSync(object.path);
            res.header("Content-Type", object.mimetype);
            res.send(file);
            return;
        }
    }
    res.status(401).json({
        message: "Unauthorized access to private bucket",
    });
});
