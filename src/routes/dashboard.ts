import bodyParser from "body-parser";
import { Router } from "express";
import { restricted } from "../middlewares/auth";
import session from "express-session";
import "dotenv/config";
import { pbkdf2Sync, randomBytes } from "crypto";
import { accounts, buckets } from "../db/schema";
import { db } from "../db/config";
import { eq } from "drizzle-orm";
import { comparePassword } from "../lib/auth";
import { SessionData } from "express-session";
import {
    getBucketInfoFromId,
    getBuckets,
    getObjectCount,
    getObjectsFromBucket,
    getSharedObjectCount,
    getStoredSize,
} from "../lib/fetcher";

export const dashboardRouter = Router();


export const navlist = [
    { name: "Dashboard", href: "/dashboard" },
    {
        name: "Buckets",
        href: "/dashboard/buckets",
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
    },
];


dashboardRouter.use(bodyParser.urlencoded({ extended: true }));

dashboardRouter.get("/signin", (req, res) => {
    res.render("signin", { title: "Sign In" });
});
dashboardRouter.get("/", restricted, async (req, res) => {
    res.render("dashboard", {
        user: {
            username: req.session.user.username,
            image: req.session.user.image,
        },
        title: "Dashboard",
        activeLink: "Dashboard",
        navlist,
        stats: [
            {
                name: "Objects stored",
                value: await getObjectCount(),
            },
            {
                name: "Stored size",
                value: `${await getStoredSize()} GB`,
            },
            {
                name: "Bandwith",
                value: `GB`,
            },
            {
                name: "Objects shared",
                value: await getSharedObjectCount(),
            },
        ],
    });
});
dashboardRouter.get("/buckets", restricted, async (req, res) => {
    const buckets = await getBuckets();

    res.render("buckets", {
        user: {
            username: req.session.user.username,
            image: req.session.user.image,
        },
        buckets,
        title: "Buckets",
        activeLink: "Buckets",
        navlist,
    });
});
dashboardRouter.get("/bucket/:bucketId", restricted, async (req, res) => {
    const { bucketId } = req.params;
    const objects = await getObjectsFromBucket(Number(bucketId));
    const bucketInfo = await getBucketInfoFromId(Number(bucketId));
    res.render("objects", {
        user: {
            username: req.session.user.username,
            image: req.session.user.image,
        },
        objects,
        bucket: bucketInfo,
        title: `Bucket::${bucketInfo.name}`,
        activeLink: "Buckets",
        navlist,
    });
});
dashboardRouter.get("/buckets/new", restricted, (req, res) => {
    res.render("new-bucket", {
        user: {
            username: req.session.user.username,
            image: req.session.user.image,
        },
        possiblePaths: process.env.STORAGE_PATH,
        title: "Bucket::New",
        activeLink: "Buckets",
        navlist,
    });
});
dashboardRouter.post("/buckets/new", restricted, async (req, res) => {
    await db.insert(buckets).values({ ...req.body });
    res.redirect("/dashboard/buckets");
});
dashboardRouter.get(
    "/bucket/:bucketId/objects/new",
    restricted,
    async (req, res) => {
        res.render("new-object", {
            user: {
                username: req.session.user.username,
                image: req.session.user.image,
            },
            bucketId: req.params.bucketId,
            title: `Bucket::Upload`,
            activeLink: "Buckets",
            navlist,
        });
    },
);
dashboardRouter.post("/signin", async (req, res) => {
    const { ref } = req.query;
    if (req.session.user) {
        res.redirect((ref as string) ?? "/dashboard");
        return;
    }
    const userData = (
        await db
            .select()
            .from(accounts)
            .where(eq(accounts.username, req.body.username))
    )[0];

    if (
        !userData ||
        !comparePassword(req.body.password, userData.hash, userData.salt)
    ) {
        res.status(401).render("signin", {
            message: "Invalid username or password",
            username: req.body.username,
        });
        return;
    }

    req.session.regenerate(() => {
        req.session.user = {
            username: userData.username,
            image: userData.image,
        };
        res.redirect((ref as string) ?? "/dashboard");
    });
});
dashboardRouter.get("/signout", (req, res) => {
    req.session.destroy(function () {
        res.redirect("/dashboard/signin");
    });
});

/* dashboardRouter.post("/new-account", async (req, res) => {
    const salt = randomBytes(64).toString("hex");
    const hash = pbkdf2Sync(
        req.body.password,
        salt,
        1000,
        64,
        "sha512",
    ).toString("hex");
    await db
        .insert(accounts)
        .values({ username: req.body.username, hash, salt });
    res.send("Signup successful!");
}); */
