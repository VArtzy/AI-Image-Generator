import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import handleError from "@/app/middleware/handleError";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(images);
  } catch (error) {
        return handleError(error);
  }
}
