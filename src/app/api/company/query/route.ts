import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from '@helpers/serverResponse';
import {Company} from '@models/Company';
import {PipelineStage} from 'mongoose';
import {SearchCompanyRequest} from '@types';
import z from 'zod';

interface YearsData {
  min?: number;
  max?: number;
}

// Filters that follow the schema of Array<{ name: string, description?: string }>
type NameFilterKeys = keyof Omit<
  SearchCompanyRequest,
  'company_name' | 'years_in_business' | 'operating_regions'
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

      const arrayAggregator = (key: NameFilterKeys) => {
        if (body[key].length !== 0) {
          aggregation.push({
            $match: {
              [key]: {
                $elemMatch: {
                  name: {$in: body[key]},
                },
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

      // operating regions need to be done seperately from rest
      // of array filters because it doesn't have { name, description } schema
      if (body.operating_regions.length !== 0) {
        aggregation.push({
          $match: {
            operating_regions: {
              $elemMatch: {$in: body.operating_regions},
            },
          },
        });
      }

      const arrayFilters: NameFilterKeys[] = [
        'market_focus',
        'services',
        'technologies',
        'type_of_business',
      ];

      arrayFilters.map((i: NameFilterKeys) => arrayAggregator(i));

      let res;

      if (aggregation.length !== 0) {
        res = await Company.aggregate(aggregation);
      } else {
        // if empty aggregation, return all companies
        res = await Company.find();
      }

      return ServerResponse.success(res);
    } catch (e) {
      console.log(e);
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
