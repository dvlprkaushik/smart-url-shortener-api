import { Router } from "express";
import { v1UrlRouter } from "./v1/url.routes";

const urlRouter = Router();

urlRouter.use("/v1",v1UrlRouter);

export {urlRouter as urlRoutes};
