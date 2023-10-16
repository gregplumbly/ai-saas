import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
    const userGenerations = await prisma.userGenerations.findMany({
        where: {
            userId: "user_2WaEuGZIDaUQn7lyUHyhAVBRsGP&type",
        },
    });
    console.log(userGenerations);

    return new NextResponse(JSON.stringify({ userGenerations }));
}
