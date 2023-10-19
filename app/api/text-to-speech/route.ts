import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://139f-82-19-141-108.ngrok-free.app"; // or ngrok url

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    const encodedPrompt = encodeURIComponent(prompt);

    console.log("prompt", prompt);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse(
        "Free trial has expired. Please upgrade to pro.",
        { status: 403 }
      );
    }

    const response = await replicate.predictions.create({
      version:
        "e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71",
      input: {
        text: prompt,
      },
      webhook: `${HOST}/api/replicate-webhook?userId=${userId}&prompt=${encodedPrompt}&type=tts`,
      webhook_events_filter: ["completed"],
    });

    // const response = await replicate.run(
    //   "afiaka87/tortoise-tts:e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71",
    //   {
    //     input: {
    //       prompt_a: prompt,
    //     },
    //     webhook: `${HOST}/api/replicate-webhook?userId=${userId}&prompt=${encodedPrompt}&type=tts`,
    //   }
    // );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
