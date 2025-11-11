import { validateShorten } from "@/middleware/validation.middleware";
import * as controller from "../../controllers/url.controller";
import { Router } from "express";

const v1UrlRouter = Router();

v1UrlRouter.post("/shorten", validateShorten, controller.shortenUrl);
v1UrlRouter.get("/stats/:shortCode", controller.getStats);
v1UrlRouter.get("/all",controller.getAll);
v1UrlRouter.get("/top",controller.getTopLinks);
v1UrlRouter.get("/:shortCode", controller.redirectUrl);

export {v1UrlRouter};
