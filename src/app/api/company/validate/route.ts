import {z} from 'zod';
import {NextRequest} from 'next/server';
import {ServerResponse} from '@helpers/serverResponse';
import {ZOD_ERR} from '@constants/error-messages';
import {formOptions} from '@/app/(pages)/(protected)/my-company/register/form-stages/index';
import axios from 'axios';

interface FormOptionData {
  name: string;
  description: string;
}

const arrayToJSONSchema = z
  .string()
  .array()
  .transform((arr, ctx) => {
    try {
      return arr.map(str => JSON.parse(str));
    } catch (e) {
      ctx.addIssue({code: 'custom', message: 'Invalid JSON'});
      return z.NEVER;
    }
  });

const CompanySchema = z.object({
  company_name: z.string().min(1, ZOD_ERR.REQ_FIELD),
  headquarters_location: z.object({
    label: z.string(),
    value: z.string(),
  }),
  less_than_2_years: z.boolean(),
  market_focus: arrayToJSONSchema.refine(
    val =>
      val.every((obj: FormOptionData) =>
        formOptions.marketFocuses.includes(obj)
      ),
    {
      message: 'Invalid market focus',
    }
  ),
  operating_regions: z
    .string()
    .array()
    .refine(
      val => val.every(str => formOptions.operatingRegions.includes(str)),
      {
        message: 'Invalid operating region',
      }
    ),
  services: arrayToJSONSchema.refine(
    val =>
      val.every((obj: string) => formOptions.operatingRegions.includes(obj)),
    {message: 'Invalid service'}
  ),
  technologies: arrayToJSONSchema.refine(
    val =>
      val.every((obj: FormOptionData) =>
        formOptions.technologies.includes(obj)
      ),
    {message: 'Invalid technology'}
  ),
  type_of_business: arrayToJSONSchema.refine(
    val =>
      val.every((obj: FormOptionData) =>
        formOptions.typesOfBusinesses.includes(obj)
      ),
    {message: 'Invalid type of business'}
  ),
  years_in_business: z.number(),
});

type CompanyType = z.infer<typeof CompanySchema>;

export const POST = async (request: NextRequest) => {
  const body: CompanyType = await request.json();

  const zodValidation = CompanySchema.safeParse(body);

  if (zodValidation.success) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/validate/city`,
        body.headquarters_location
      );

      return ServerResponse.success('Valid schema');
    } catch (e) {
      return ServerResponse.userError('Invalid city name and place ID');
    }
  } else {
    return ServerResponse.userError('Bad schema');
  }
};
