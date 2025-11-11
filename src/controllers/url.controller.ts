import { NextFunction, Request, Response } from "express";
import * as service from "../services/url.services.js";
import { UrlError } from "@/utils/UrlError.js";
UrlError

const baseUrl = process.env.BASE_URL || `theust`;

export const shortenUrl = async (
  req: Request<
    {},
    {},
    {
      url: string;
      expiresAt?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url, expiresAt } = req.body;
    try {
      new URL(url);
    } catch {
      next(new UrlError(400, "Invalid URL format"));
      return;
    }
    const record = await service.createShortUrl(
      url,
      expiresAt ? new Date(expiresAt) : undefined
    );

    return res.status(201).json({
      success: true,
      shortUrl: `${baseUrl}/api/v1/${record.shortCode}`,
      expiresAt: record.expiresAt || null,
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const code = req.params.shortCode;
    const record = await service.findByShortCode(code);
    if (!record) {
      next(new UrlError(404, "Not found"));
      return;
    }

    if (record.expiresAt && record.expiresAt < new Date()) {
      next(new UrlError(410, "Link expired"));
      return;
    }

    if (!record.originalUrl) {
      next(new UrlError(500, "Original URL missing"));
      return;
    }

    await service.incrementAccess(code);

    return res.status(302).redirect(record.originalUrl);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  req: Request<{ shortCode: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const record = await service.getStats(req.params.shortCode);
    if (!record) {
      next(new UrlError(404, "Not found"));
    }

    return res.status(200).json({
      success: true,
      data: {
        stats: record,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const list = await service.getAllUrls();
  return res.status(200).json({
    success: true,
    data: {
      urls: list,
    },
  });
};

export const getTopLinks = async (_req: Request, res: Response) => {
  const top = await service.getTopLinks();
  return res.status(200).json({
    success: true,
    data: {
      topUrls: top,
    },
  });
};
