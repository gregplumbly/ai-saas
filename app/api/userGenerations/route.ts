import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Extract userId from the query parameters
  const url = new URL(req.url);

  const userID = url.searchParams.get("userId");
  let type: string | null = null;
  type = url.searchParams.get("type");

  // Check if userId is provided
  if (!userID) {
    return NextResponse.error();
  }

  const userGenerations = await prisma.userGenerations.findMany({
    where: {
      userId: userID!,
      type: type || undefined,
    },
    orderBy: {
      createdAt: "desc", // Or replace 'createdAt' with the field you want to sort by
    },
  });

  return new NextResponse(JSON.stringify({ userGenerations }));
}
