import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from '@helpers/serverResponse';
import {Company} from '@models/Company';

interface FormOptionData {
  name: string;
  description?: string;
}

interface YearsData {
  min?: number;
  max?: number;
}

type CompanyType = {
  company_name: string;
  market_focus: FormOptionData[];
  services: FormOptionData[];
  technologies: FormOptionData[];
  type_of_business: FormOptionData[];
  operating_regions: String[];
  years_in_business: YearsData;
};

const getName = (obj: FormOptionData): string => obj.name;

export const POST = async (request: NextRequest) => {
  try {
    await connectToDatabase();
    const body: CompanyType = await request.json();

    const queryBody = {
      market_focus: body.market_focus.map(getName),
      services: body.services.map(getName),
      technologies: body.technologies.map(getName),
      type_of_business: body.type_of_business.map(getName),
    };

    let yearQuery;

    if (body.years_in_business && body.years_in_business.min === 25) {
      yearQuery = {
        $gte: 25,
      };
    } else if (body.years_in_business && body.years_in_business.max === 2) {
      yearQuery = {
        $lte: 2,
      };
    } else {
      yearQuery = {
        $gte: body.years_in_business.min,
        $lte: body.years_in_business.max,
      };
    }
    const res = await Company.aggregate([
      {
        $search: {
          autocomplete: {
            fuzzy: {maxEdits: 1, maxExpansions: 256},
            query: body.company_name,
            path: 'company_name',
          },
        },
      },
      {
        $match: {
          market_focus: {
            $elemMatch: {
              name: {$in: queryBody.market_focus},
            },
          },
        },
      },
      {
        $match: {
          services: {
            $elemMatch: {
              name: {$in: queryBody.services},
            },
          },
        },
      },
      {
        $match: {
          technologies: {
            $elemMatch: {
              name: {$in: queryBody.technologies},
            },
          },
        },
      },
      {
        $match: {
          type_of_business: {
            $elemMatch: {
              name: {$in: queryBody.type_of_business},
            },
          },
        },
      },
      {
        $match: {
          operating_regions: {
            $elemMatch: {$in: body.operating_regions},
          },
        },
      },
      {
        $match: {
          years_in_business: yearQuery,
        },
      },
    ]);

    return ServerResponse.success(res);
  } catch (e) {
    console.log(e);
    return ServerResponse.serverError('An error occured');
  }
};
