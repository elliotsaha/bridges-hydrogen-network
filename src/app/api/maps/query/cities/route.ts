import { ServerResponse } from "@helpers";
import { logger } from "@lib";

export const POST = async (req: Request) => {
  try {
    const body: { input: string } = await req.json();
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        body.input
      )}&types=(cities)&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
    );

    const mapData = await res.json();
    return ServerResponse.success(mapData);
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
