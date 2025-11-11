import { UrlError } from "@/utils/UrlError.js";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const shortenSchema = z.object({
  url: z.url(),
  expiresAt: z.string().datetime().optional(),
});

export const validateShorten = (req : Request, _res : Response, next : NextFunction) => {
  const result = shortenSchema.safeParse(req.body);
  if (!result.success){
    const errors = result.error;
    next(new UrlError(400,errors.message));
  }
  req.body = result.data;
  next();
};
