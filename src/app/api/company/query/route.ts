import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {getSession, ServerResponse} from '@helpers';
import {Company} from '@models/Company';
import {PipelineStage} from 'mongoose';
import {SearchCompanyRequest} from '@types';
import {logger} from '@lib/winston';
import z from 'zod';

interface YearsData {
  min?: number;
  max?: number;
}

// years in business has to be omitted because it doesn't follow
// the conventional filtering array pattern
type NameFilterKeys = keyof Omit<
  SearchCompanyRequest,
  'company_name' | 'years_in_business'
>;

const searchSchema = z.object({
  company_name: z.string(),
  operating_regions: z.string().array().optional(),
  market_focus: z.string().array().optional(),
  services: z.string().array().optional(),
  technologies: z.string().array().optional(),
  years_in_business: z.string().optional(),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: SearchCompanyRequest = await request.json();

  const validation = searchSchema.safeParse(body);

  if (validation.success) {
    try {
      const aggregation: PipelineStage[] = [];

      const filterProjection = {
        _id: 1,
        company_name: 1,
        headquarters_location: 1,
        market_focus: '$market_focus.name',
        services: '$services.name',
        technologies: '$technologies.name',
        type_of_business: '$type_of_business.name',
        years_in_business: 1,
        less_than_2_years: 1,
        operating_regions: 1,
        team: 1,
        partners: 1,
      };

      aggregation.push({$project: filterProjection});

      const arrayAggregator = (key: NameFilterKeys) => {
        if (body[key].length !== 0) {
          aggregation.push({
            $match: {
              $expr: {
                $setIsSubset: [body[key], `$${key}`],
              },
            },
          });
        }
      };

      // seach query needs to be before matching queries
      if (body.company_name !== '') {
        aggregation.unshift({
          $search: {
            autocomplete: {
              fuzzy: {maxEdits: 1, maxExpansions: 256},
              query: body.company_name,
              path: 'company_name',
            },
          },
        });
      }

      const YEARS_UPPER_LIMIT = 25;
      const YEARS_LOWER_LIMIT = 2;

      // Handles query for years_in_business & if less_than_2_years
      if (body.years_in_business) {
        const yearField: YearsData = JSON.parse(body.years_in_business);

        if (yearField.min === YEARS_UPPER_LIMIT) {
          aggregation.push({
            $match: {
              years_in_business: {
                $gte: YEARS_UPPER_LIMIT,
              },
            },
          });
        } else if (yearField.max === YEARS_LOWER_LIMIT) {
          aggregation.push({
            $match: {
              less_than_2_years: true,
            },
          });
        } else {
          aggregation.push({
            $match: {
              years_in_business: {
                $gte: yearField.min,
                $lte: yearField.max,
              },
            },
          });
        }
      }
      const arrayFilters: NameFilterKeys[] = [
        'market_focus',
        'services',
        'technologies',
        'type_of_business',
        'operating_regions',
      ];

      arrayFilters.map((i: NameFilterKeys) => arrayAggregator(i));

      const {session} = await getSession(request);

      if (session) {
        const existingCompany = await Company.findOne<Company>({
          team: {$in: session.user.email_address},
        }).lean<Company>();

        if (existingCompany) {
          aggregation.push({
            $match: {
              _id: {
                $ne: existingCompany._id,
              },
            },
          });
        }
      }

      let res;

      if (aggregation.length !== 0) {
        res = await Company.aggregate(aggregation);
      } else {
        // if empty aggregation, return all companies
        res = await Company.find();
      }

      return ServerResponse.success(res);
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
