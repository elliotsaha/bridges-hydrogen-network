import {ServerResponse} from '@helpers';
import {logger} from '@lib';
import {Client} from '@googlemaps/google-maps-services-js';
import z from 'zod';
import {ZOD_ERR} from '@constants';

const validateCitySchema = z.object({
  place_id: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

export const POST = async (req: Request) => {
  const {place_id, city_address} = await req.json();

  const validation = validateCitySchema.safeParse({
    place_id,
    city_address,
  });

  if (validation.success) {
    try {
      const client = new Client({});

      const res = await client.placeDetails({
        params: {
          place_id: encodeURIComponent(place_id),
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
          fields: ['formatted_address'],
        },
      });

      return ServerResponse.success({
        formatted_address: res.data.result.formatted_address as string,
      });
    } catch (e) {
      logger.error(e);
      return ServerResponse.userError('Invalid query');
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
