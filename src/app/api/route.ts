import { NextResponse } from "next/server";
import { connectToDatabase } from "@lib/db";
import { usersCreation } from "@models/example";

export async function GET(request: Request) {
  await connectToDatabase();
  await usersCreation.create({ title: "test", description: "test" });
  return NextResponse.json({ success: true });
}
