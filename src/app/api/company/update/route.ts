import {z} from 'zod';
import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {getSession} from '@helpers/getSession';
import {ServerResponse} from '@helpers/serverResponse';
import {Validator} from '@helpers/validateRemaining';
import {Company} from '@models/Company';
import axios from 'axios';

const validator = new Validator();

const CompanySchema = z.object({
  company_name: z.string({
    required_error: 'Substring of company name is required',
  }),
  headquarters_location: z.string({
    required_error: 'Location of company headquarters is required',
  }),
  market_segment_focus: z
    .string()
    .array()
    .nonempty('At least 1 market segment focus is required')
    .refine(val => validator.segments(val), {
      message: 'Invalid market segments',
    }),
  operating_regions: z
    .string()
    .array()
    .nonempty('At least 1 operating region is required')
    .refine(val => validator.regions(val), {
      message: 'Invalid operating regions',
    }),
  services_or_products: z
    .string()
    .array()
    .nonempty('At least a service or a product is required')
    .refine(val => validator.services(val), {
      message: 'Invalid services or products',
    }),
  technologies_used: z
    .string()
    .array()
    .nonempty('At least 1 technology is required')
    .refine(val => validator.technologies(val), {
      message: 'Invalid technologies',
    }),
  type_of_business: z
    .string()
    .array()
    .nonempty('At least 1 type of business is required')
    .refine(val => validator.businesses(val), {
      message: 'Invalid businesses',
    }),
  years_in_business: z.number({
    required_error: 'Number of years in business is required',
  }),
  less_than_2_years: z.boolean(),
});

type CompanyType = z.infer<typeof CompanySchema>;

const validatePlaceId = async (value: string) => {
  try {
    const cityName = await axios.post(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/maps/query/cities`,
      {
        place_id: value,
      }
    );
    return cityName;
  } catch (e) {
    return ServerResponse.userError('Invalid city name');
  }
};

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: CompanyType = await request.json();

  const session = getSession(request);

  if (!session) {
    ServerResponse.unauthorizedError();
  }

  const zodValidation = CompanySchema.safeParse(body);

  if (zodValidation.success) {
    try {
      const cityName = validatePlaceId(body.headquarters_location);
      return cityName;
    } catch (e) {
      return ServerResponse.userError('Invalid city name');
    }

    const res = await Company.find({
      $and: [
        {company_name: {$text: {$search: body.company_name}}},
        {market_segment_focus: {$in: body.market_segment_focus}},
        {operating_regions: {$in: body.operating_regions}},
        {services_or_products: {$in: body.services_or_products}},
        {technologies_used: {$in: body.technologies_used}},
        {type_of_business: {$in: body.type_of_business}},
        {years_in_business: {$gte: body.years_in_business}},
        {less_than_2_years: body.less_than_2_years},
      ],
    });
    return res;
  } else {
    return ServerResponse.userError('bad schema');
  }
};
