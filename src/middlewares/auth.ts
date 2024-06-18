import { getBucketInfoFromName } from "../lib/fetcher";
import { db } from "../db/config";
import { objectLinks } from "../db/schema";
import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";

export const validator = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { token } = req.query;
    const objectName = req.params.link.split("?")[0];
    if (await checkToken(token as string, objectName)) {
        next();
        return;
    }
    res.status(404);
    res.render("error", { title: "404", message: "Not Found" });
    return;
};

const checkToken = async (token: string, objectName: string) => {
    const objectLink = (
        await db
            .select()
            .from(objectLinks)
            .where(eq(objectLinks.objectName, objectName))
    )[0];
    const today = new Date();
    if (today.getTime() > objectLink.expiringAt.getTime()) {
        return false;
    }
    if (objectLink.token !== token) {
        return false;
    }
    return true;
};

export const restricted = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    if (req.session.user) {
        next();
    } else {
        res.redirect(`/dashboard/signin?ref=${req.baseUrl + req.path}`);
    }
};
