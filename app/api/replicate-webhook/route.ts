import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

// Handles POST requests to /api
export async function POST(request: Request) {
  console.log("🪝 incoming webhook!", request);
  const body = await request.json();

  const userID = body.webhook.split("=")[1];

  console.log("userID", userID);

  if (!userID) {
    throw new Error("User ID is null");
  }

  console.log("download the audio file");
  const audio = await fetch(body.output.audio);
  const audioBuffer = await audio.arrayBuffer();
  console.log("audioBuffer", audioBuffer);
  const blob = new Blob([audioBuffer]);

  const { url } = await put("myAudioFile", blob, { access: "public" });

  console.log("save to database");
  await prismadb.userGenerations.create({
    data: {
      userId: userID,
      url: url,
      prompt: "test",
    },
  });

  return NextResponse.json({ message: "success" });
}
