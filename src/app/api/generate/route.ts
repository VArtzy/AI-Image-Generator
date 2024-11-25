import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import rateLimit from "@/app/middleware/rateLimiter";
import handleError from "@/app/middleware/handleError";

const REQUEST_LIMIT = 3;
const env = process.env.NODE_ENV;

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const schema = z.object({
  prompt: z.string().min(1).max(1000),
});

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 100,
});

export async function POST(req: Request) {
  try {
    await limiter.check(REQUEST_LIMIT, "CACHE_TOKEN");

    const body = await req.json();
    const { prompt } = schema.parse(body);
    let response;

    if (env === 'development') {
        response = { data: [{url: 'https://picsum.photos/1024'}] }
    } else {
        response = await openai.images.generate({
                model: "dall-e-3",
                prompt,
                n: 1,
                size: "1024x1024",
            });
        }

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL received from OpenAI");
    }

    // Download image and upload to Vercel Blob
    const imageResponse = await fetch(imageUrl);
    const blob = await imageResponse.blob();
    const { url } = await put(`${Date.now()}.png`, blob, {
      access: "public",
    });

    // Save to database
    await prisma.image.create({
      data: {
        prompt,
        url,
      },
    });

    return NextResponse.json({ imageUrl: url });
  } catch (error) {
      return handleError(error);
  }
}
