import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { del } from "@vercel/blob";
import handleError from "@/app/middleware/handleError";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from Vercel Blob
    await del(image.url);

    // Delete from database
    await prisma.image.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
	return handleError(error);
  }
}
