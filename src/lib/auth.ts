import { pbkdf2Sync } from "crypto";
import { getAccessToken } from "./fetcher";

export function comparePassword(
    password: string,
    hash: string,
    salt: string,
): boolean {
    const hashedPassword = pbkdf2Sync(password, salt, 1000, 64, "sha512");
    if (hashedPassword.toString("hex") === hash) {
        return true;
    }
    return false;
}

export async function validateAccessToken(
    objectName: string,
    accessToken: string,
): Promise<boolean> {
    const token = await getAccessToken(objectName);
    console.log(token, accessToken);
    if (token === accessToken) {
        return true;
    }
    return false;
}
