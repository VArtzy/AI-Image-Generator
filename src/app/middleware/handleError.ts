import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { APIError } from "openai";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BlobError } from "@vercel/blob";

export default function handleError(error: unknown): NextResponse {
    console.error(error);

    if (error instanceof NextResponse) {
        if (error.status === 429) {
            return new NextResponse("Too many requests", { status: 429 });
        } else {
            return new NextResponse("Internal server error", { status: 500 });
        }
    }

    if (error instanceof ZodError) {
        return new NextResponse("Invalid input data", { status: 400 });
    }

    if (error instanceof APIError) {
        return new NextResponse("OpenAI API error", { status: 502 });
    }

    if (error instanceof PrismaClientKnownRequestError) {
        return new NextResponse("Database operation failed", { status: 500 });
    }

    if (error instanceof BlobError) {
        return new NextResponse("Blob operation failed", { status: 502 });
    }

    if (error instanceof Error) {
        return new NextResponse(error.message, { status: 500 });
    }

    return new NextResponse("An unexpected error occurred", { status: 500 });
}
