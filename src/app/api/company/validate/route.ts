import {z} from 'zod';
import {NextRequest} from 'next/server';
import {ServerResponse, dataURLtoFile} from '@helpers';
import {ZOD_ERR} from '@constants/error-messages';
import {strictFormOptions} from '@forms/company/register';
import axios from 'axios';
import {logger} from '@lib';
import {UTApi} from 'uploadthing/server';

interface FormOptionData {
  name: string;
  description: string;
}

const validatePreprocess = (src: FormOptionData[], errmsg: string) =>
  z.preprocess(
    (arr, ctx) => {
      try {
        return (arr as string[]).map(str => JSON.parse(str));
      } catch (e) {
        ctx.addIssue({code: 'custom', message: 'Invalid JSON'});
        return z.NEVER;
      }
    },
    z
      .object({name: z.string(), description: z.string().optional()})
      .array()
      .refine(
        val => {
          return val.every(i =>
            src.some(j => j.name === i.name && j.description === i.description)
          );
        },
        {message: errmsg}
      )
  );

const CompanySchema = z
  .object({
    company_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
    profile: z.string().min(1, ZOD_ERR.REQ_FIELD),
    description: z.string().min(1, ZOD_ERR.REQ_FIELD),
    headquarters_location: z.object({
      label: z.string(),
      value: z.string(),
    }),
    less_than_2_years: z.boolean(),
    market_focus: validatePreprocess(
      strictFormOptions.marketFocuses,
      'Invalid market focus'
    ),

    operating_regions: z
      .string()
      .array()
      .refine(
        val =>
          val.every(str => strictFormOptions.operatingRegions.includes(str)),
        {
          message: 'Invalid operating region',
        }
      ),
    services: validatePreprocess(strictFormOptions.services, 'Invalid service'),
    technologies: validatePreprocess(
      strictFormOptions.technologies as FormOptionData[],
      'Invalid technology'
    ),
    type_of_business: validatePreprocess(
      strictFormOptions.typesOfBusinesses,
      'Invalid type of business'
    ),
    years_in_business: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.less_than_2_years) {
      if (
        !z
          .string()
          .transform(i => parseInt(i))
          .pipe(z.number().int().min(2))
          .safeParse(data.years_in_business).success
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['years_in_business'],
          message: 'Invalid years in business',
        });
      }
    }
  });

const parseJSONArray = (arr: Array<string>) => arr.map(i => JSON.parse(i));

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const validation = CompanySchema.safeParse(body);
  if (validation.success) {
    try {
      const {
        company_name,
        profile,
        description,
        headquarters_location,
        less_than_2_years,
        market_focus,
        operating_regions,
        services,
        technologies,
        type_of_business,
        years_in_business,
      } = body;

      let profileURL = profile;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/validate/city`,
        {
          place_id: headquarters_location.value,
          city_address: headquarters_location.label,
        }
      );

      // either less_than_2_years or years_in_business (yib) is
      // to be removed from success data object
      const yib_obj = less_than_2_years
        ? {less_than_2_years}
        : {years_in_business: parseInt(years_in_business)};

      const base64ImageType = profile.match(/^data:(.+);base64/)?.[1];

      if (base64ImageType?.split('/')[0] !== 'image' && !profileURL) {
        return ServerResponse.userError('Invalid company image');
      }

      if (base64ImageType?.split('/')[0] === 'image') {
        // uploading image to uploadthing if base64
        const utapi = new UTApi({
          apiKey: process.env.NEXT_UPLOADTHING_SECRET,
        });

        const file = await dataURLtoFile(
          profile,
          company_name,
          base64ImageType
        );

        // bytes -> kb -> mb is greater than 2mb
        if (file.size > 1024 ** 2 * 2) {
          return ServerResponse.serverError('Company logo image is too big');
        }

        const uploadRes = await utapi.uploadFiles([file]);

        if (uploadRes[0].error) {
          return ServerResponse.serverError(
            'Could not process company logo image'
          );
        }

        profileURL = uploadRes[0].data.url;
      }

      return ServerResponse.success({
        company_name,
        profile: profileURL,
        description,
        headquarters_location: {
          label: res.data.formatted_address,
          value: headquarters_location.value,
        },
        ...yib_obj,
        operating_regions: operating_regions,
        market_focus: parseJSONArray(market_focus),
        services: parseJSONArray(services),
        technologies: parseJSONArray(technologies),
        type_of_business: parseJSONArray(type_of_business),
      });
    } catch (e) {
      logger.error(e);
      return ServerResponse.userError('Invalid city name and place ID');
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
