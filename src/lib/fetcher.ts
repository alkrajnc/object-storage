import { db } from "../db/config";
import { Bucket, Object as ObjectType, buckets, objects } from "../db/schema";
import { and, eq } from "drizzle-orm";

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
