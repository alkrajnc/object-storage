import { NextFunction, Request, Response } from "express";
import { getBucketInfoFromId, getBucketInfoFromName } from "../lib/fetcher";
import { authenticator } from "./auth";

export async function checkBucketType(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const bucket = await getBucketInfoFromName(req.params.bucketName);
    if (bucket.type === "private") {
        if (!authenticator(req, res, next)) {
            res.status(404);
            res.render("error", { title: "404", message: "Not Found" });
            return;
        }
    }
    next();
}
