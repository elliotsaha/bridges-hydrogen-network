import {ServerResponse} from '@helpers';
import {logger} from '@lib';
import {
  Client,
  PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';

export const POST = async (req: Request) => {
  try {
    const body: {input: string} = await req.json();
    const client = new Client({});

    const res = await client.placeAutocomplete({
      params: {
        input: encodeURIComponent(body.input),
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
        types: PlaceAutocompleteType.cities,
      },
    });

    return ServerResponse.success(res.data);
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
