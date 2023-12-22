import {ServerResponse} from '@helpers';
import {logger} from '@lib';
import {Client} from '@googlemaps/google-maps-services-js';

export const POST = async (req: Request) => {
  try {
    const body: {place_id: string} = await req.json();
    const client = new Client({});

    const res = await client.placeDetails({
      params: {
        place_id: encodeURIComponent(body.place_id),
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        fields: ['name'],
      },
    });

    return ServerResponse.success(res.data);
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
