import { NextFunction, Request, Response } from "express";

export const authenticator = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const key = req.headers.authorization;

    if (key !== "somevalue") {
        res.status(404);
        res.render("error", { title: "404", message: "Not Found" });
        return;
    }
    next();
};
