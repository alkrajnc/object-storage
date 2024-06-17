import { randomBytes } from "crypto";
import { getObject } from "./fetcher";
import { objectLinks } from "../db/schema";
import { db } from "../db/config";

export async function generateAccessLink(
    objectId: string,
): Promise<{ link: string; token: string }> {
    const object = await getObject(objectId);
    const token = randomBytes(16).toString("hex");
    return { link: `${object.name}?token=${token}`, token };
}
export async function createLink(
    objectName: string,
    token: string,
    link: string,
    expirationTime?: Date,
): Promise<void> {
    await db.insert(objectLinks).values({
        link,
        token,
        objectName,
        expiringAt:
            expirationTime ||
            new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100),
    });
}
