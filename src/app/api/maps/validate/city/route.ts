import {ServerResponse} from '@helpers';
import {logger} from '@lib';
import {Client} from '@googlemaps/google-maps-services-js';
import z from 'zod';
import {ZOD_ERR} from '@constants';

const validateCitySchema = z.object({
  place_id: z.string().min(1, ZOD_ERR.REQ_FIELD),
  city_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

export const POST = async (req: Request) => {
  const {place_id, city_name} = await req.json();

  const validation = validateCitySchema.safeParse({
    place_id,
    city_name,
  });

  if (validation.success) {
    try {
      const client = new Client({});

      const res = await client.placeDetails({
        params: {
          place_id: encodeURIComponent(place_id),
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
          fields: ['name'],
        },
      });

      if (res?.data?.result?.name === city_name) {
        return ServerResponse.success('Valid city query');
      } else {
        return ServerResponse.userError('Invalid city query');
      }
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
