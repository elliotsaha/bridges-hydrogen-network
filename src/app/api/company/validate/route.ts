import {z} from 'zod';
import {NextRequest} from 'next/server';
import {ServerResponse} from '@helpers/serverResponse';
import {ZOD_ERR} from '@constants/error-messages';
import {strictFormOptions} from '@forms/company/register';
import axios from 'axios';

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

const CompanySchema = z.object({
  company_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
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
      val => val.every(str => strictFormOptions.operatingRegions.includes(str)),
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
});

type CompanyType = z.infer<typeof CompanySchema>;

export const POST = async (request: NextRequest) => {
  const body: CompanyType = await request.json();

  const zodValidation = CompanySchema.safeParse(body);
  if (zodValidation.success) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/validate/city`,
        {
          place_id: body.headquarters_location.value,
          city_address: body.headquarters_location.label,
        }
      );

      return ServerResponse.success('Valid schema');
    } catch (e) {
      return ServerResponse.userError('Invalid city name and place ID');
    }
  } else {
    return ServerResponse.userError('Bad schema');
  }
};
