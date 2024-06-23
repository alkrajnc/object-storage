import { randomBytes } from "crypto";
import { getAccessToken, getObject } from "./fetcher";
import { objectAccess } from "../db/schema";
import { db } from "../db/config";
import { eq } from "drizzle-orm";

export async function generateAccessToken(objectId: string): Promise<string> {
    const token = randomBytes(16).toString("hex");
    return token;
}
export async function createAccessEntry(
    objectName: string,
    token: string,
    expirationTime?: Date,
): Promise<void> {
    const objectToken = await getAccessToken(objectName);

    if (!objectToken) {
        await db.insert(objectAccess).values({
            token,
            objectName,
            expiringAt:
                expirationTime ||
                new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100),
        });
    } else {
        await db
            .update(objectAccess)
            .set({
                token: token,
                expiringAt:
                    expirationTime ||
                    new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100),
            })
            .where(eq(objectAccess.objectName, objectName));
    }
}
