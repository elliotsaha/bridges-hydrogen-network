import {ServerResponse} from '@helpers';
import {logger} from '@lib';
import {
  Client,
  PlaceAutocompleteType,
} from '@googlemaps/google-maps-services-js';
import z from 'zod';

const queryCitySchema = z.object({
  input: z.string(),
});

export const POST = async (req: Request) => {
  const {input} = await req.json();

  const validation = queryCitySchema.safeParse({
    input,
  });

  if (validation.success) {
    try {
      const client = new Client({});

      const res = await client.placeAutocomplete({
        params: {
          input: input,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
          types: PlaceAutocompleteType.cities,
        },
      });

      return ServerResponse.success(res.data);
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
