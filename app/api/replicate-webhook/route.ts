import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

function sanitizeInput(input: string) {
  // Remove HTML tags
  const sanitizedInput = input.replace(/<[^>]+>/g, "");

  // Trim leading and trailing whitespace
  const trimmedInput = sanitizedInput.trim();

  return trimmedInput;
}

// Handles POST requests to /api
export async function POST(request: Request) {
  console.log("🪝 incoming webhook!", request);
  const body = await request.json();
  console.log("body. webook", body.webhook);
  const userID = body.webhook.split("=")[1].split("&")[0];
  const encodedPrompt = body.webhook.split("&")[1].split("=")[1];
  const type = body.webhook.split("&")[2].split("=")[1];
  const prompt = decodeURIComponent(encodedPrompt);
  const sanitizedPrompt = sanitizeInput(prompt);
  console.log("userID", userID);

  if (!userID) {
    throw new Error("User ID is null");
  }

  let audio;

  if (type === "tts") {
    audio = await fetch(body.output);
  } else if (type === "music") {
    audio = await fetch(body.output.audio);
  } else {
    throw new Error(`Invalid type: ${type}`);
  }

  const audioBuffer = await audio.arrayBuffer();
  const blob = new Blob([audioBuffer]);

  const { url } = await put("myAudioFile", blob, { access: "public" });

  const existingRecord = await prismadb.userGenerations.findFirst({
    where: {
      userId: userID,
      prompt: sanitizedPrompt,
    },
  });

  if (existingRecord) {
    console.log("Record already exists. Skipping save to database.");
  } else {
    console.log("save to database");
    await prismadb.userGenerations.create({
      data: {
        userId: userID,
        url: url,
        prompt: prompt,
        type: type,
      },
    });
  }

  return NextResponse.json({ message: "success" });
}
