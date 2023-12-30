import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from '@helpers/serverResponse';
import {Company} from '@models/Company';
import {PipelineStage} from 'mongoose';

interface YearsData {
  min?: number;
  max?: number;
}

type CompanyType = {
  company_name: string;
  market_focus: string[];
  services: string[];
  technologies: string[];
  type_of_business: string[];
  operating_regions: string[];
  years_in_business: string | undefined;
};

export const POST = async (request: NextRequest) => {
  try {
    await connectToDatabase();
    const body: CompanyType = await request.json();

    const aggregation: PipelineStage[] = [];

    let yearQuery = {};

    if (body.years_in_business) {
      const yearField: YearsData = JSON.parse(body.years_in_business);
      console.log(yearField);
      if (yearField.min === 25) {
        yearQuery = {
          $gte: 25,
        };
        aggregation.push({
          $match: {
            years_in_business: yearQuery,
          },
        });
      } else if (yearField.max === 2) {
        aggregation.push({
          $match: {
            less_than_2_years: true,
          },
        });
      } else {
        yearQuery = {
          $gte: yearField.min,
          $lte: yearField.max,
        };
        aggregation.push({
          $match: {
            years_in_business: yearQuery,
          },
        });
      }
    }

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

    if (body.market_focus.length !== 0) {
      aggregation.push({
        $match: {
          market_focus: {
            $elemMatch: {
              name: {$in: body.market_focus},
            },
          },
        },
      });
    }

    if (body.services.length !== 0) {
      aggregation.push({
        $match: {
          services: {
            $elemMatch: {
              name: {$in: body.services},
            },
          },
        },
      });
    }

    if (body.technologies.length !== 0) {
      aggregation.push({
        $match: {
          technologies: {
            $elemMatch: {
              name: {$in: body.technologies},
            },
          },
        },
      });
    }

    if (body.type_of_business.length !== 0) {
      aggregation.push({
        $match: {
          type_of_business: {
            $elemMatch: {
              name: {$in: body.type_of_business},
            },
          },
        },
      });
    }

    if (body.operating_regions.length !== 0) {
      aggregation.push({
        $match: {
          operating_regions: {
            $elemMatch: {$in: body.operating_regions},
          },
        },
      });
    }

    let res;

    if (aggregation.length !== 0) {
      res = await Company.aggregate(aggregation);
    } else {
      res = await Company.find();
    }

    return ServerResponse.success(res);
  } catch (e) {
    console.log(e);
    return ServerResponse.serverError('An error occured');
  }
};
