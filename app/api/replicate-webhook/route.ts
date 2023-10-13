import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

// Handles POST requests to /api
export async function POST(request: Request) {
    // ...
    const body = await request.json();
    console.log("post", body);
    const { userId } = auth();

    const userID = body.webhook.split("=")[1];
    console.log("userID", userID);

    await prismadb.userGenerations.create({
        data: {
            userId: userID,
            url: body.output.audio,
        },
    });

    return NextResponse.json({ message: "Hello World" });
}
