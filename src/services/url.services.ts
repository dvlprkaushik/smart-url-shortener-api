import { nanoid } from "nanoid";
import { prisma } from "../utils/prisma.js";

export const createShortUrl = async (originalUrl: string, expiresAt?: Date) => {
  const shortCode = nanoid(Number(process.env.NANO_LEN));
  return await prisma.url.create({
    data: {
      originalUrl: originalUrl,
      shortCode: shortCode,
      expiresAt: expiresAt,
    },
  });
};

export const findByShortCode = async (shortCode: string) => {
  return await prisma.url.findUnique({
    where: { shortCode: shortCode },
  });
};

export const incrementAccess = async (shortCode: string) => {
  return await prisma.url.update({
    where: { shortCode: shortCode },
    data: {
      accessCount: { increment: 1 },
      lastAccess: new Date(),
    },
  });
};

export const getStats = async (shortCode: string) => {
  return await prisma.url.findUnique({
    where: { shortCode: shortCode },
    select: {
      originalUrl: true,
      shortCode: true,
      accessCount: true,
      createdAt: true,
      lastAccess: true,
      expiresAt: true,
    },
  });
};

export const getAllUrls = async () => {
  return await prisma.url.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
};

export const getTopLinks = async () => {
  return await prisma.url.findMany({
    orderBy: { accessCount: "desc" },
    take: 5,
  });
};
