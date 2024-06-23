import { db } from "../db/config";
import {
    Bucket,
    Object as ObjectType,
    buckets,
    objectAccess,
    objects,
} from "../db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function getBucketInfoFromId(bucketId: number): Promise<Bucket> {
    const bucketInfo = (await db
        .select()
        .from(buckets)
        .where(eq(buckets.id, bucketId))) as Bucket[];
    return bucketInfo[0];
}
export async function getBucketInfoFromName(
    bucketName: string,
): Promise<Bucket> {
    const bucketInfo = (await db
        .select()
        .from(buckets)
        .where(eq(buckets.name, bucketName))) as Bucket[];
    return bucketInfo[0];
}
export async function newObject(object: ObjectType): Promise<boolean> {
    try {
        await db.insert(objects).values({
            path: object.path,
            bucketId: object.bucketId,
            name: object.name,
            size: object.size,
            mimetype: object.mimetype,
        });
        return true;
    } catch (error) {
        return false;
    }
}
export async function getUrl(
    bucketName: string,
    filename: string,
): Promise<string> {
    const bucket = await getBucketInfoFromName(bucketName);
    const object = (await db
        .select()
        .from(objects)
        .where(
            and(eq(objects.name, filename), eq(objects.bucketId, bucket.id)),
        )) as ObjectType[];
    return object[0].path;
}
export async function getObject(
    objectId: number | string,
): Promise<ObjectType> {
    const object = (await db
        .select()
        .from(objects)
        .where(
            typeof objectId === "string"
                ? eq(objects.name, String(objectId))
                : eq(objects.id, Number(objectId)),
        )) as ObjectType[];
    return object[0];
}
export async function getBuckets(): Promise<Bucket[]> {
    return (await db.select().from(buckets)) as Bucket[];
}
export async function getObjectsFromBucket(
    bucketId: number,
): Promise<ObjectType[]> {
    return (await db
        .select()
        .from(objects)
        .where(eq(objects.bucketId, bucketId))) as ObjectType[];
}
export async function getObjectCount(): Promise<number> {
    return (await db.select().from(objects)).length;
}
export async function getSharedObjectCount(): Promise<number> {
    return (await db.select().from(objectAccess)).length;
}
export async function getStoredSize(): Promise<number> {
    const size = (
        await db
            .select({ size: sql<number>`cast(sum(${objects.size}) as int)` })
            .from(objects)
    )[0];
    return +(size.size / 1024 / 1024 / 1024).toFixed(4);
}
export async function getAccessToken(
    objectName: string,
): Promise<string | null> {
    const token = await db
        .select()
        .from(objectAccess)
        .where(eq(objectAccess.objectName, objectName));
    if (token.length === 0) return null;
    return token[0].token;
}
