import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      body?.input
    )}&types=(cities)&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
