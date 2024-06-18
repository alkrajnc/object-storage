import { pbkdf2Sync } from "crypto";

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
