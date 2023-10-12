import { NextResponse } from "next/server";

// Handles GET requests to /api
export async function GET(request: Request) {
    // ...
    console.log("get", request.body);
    return NextResponse.json({ message: "Hello World" });
}

// Handles POST requests to /api
export async function POST(request: Request) {
    // ...
    const body = await request.json();
    console.log("post", body);
    return NextResponse.json({ message: "Hello World" });
}
