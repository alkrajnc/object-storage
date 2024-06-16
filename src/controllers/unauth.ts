import { Request, Response } from "express";

/**
 * GET /
 * Unauthorized page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    res.render("unauth", { title: "Express" });
};
