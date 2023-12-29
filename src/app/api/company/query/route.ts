import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {ServerResponse} from '@helpers/serverResponse';
import {Company} from '@models/Company';

interface FormOptionData {
  name: string;
  description?: string;
}

type CompanyType = {
  company_name: string;
  market_focus: FormOptionData[];
  services: FormOptionData[];
  technologies: FormOptionData[];
  type_of_business: FormOptionData[];
  operating_regions: String[];
  years_in_business: number;
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
          years_in_business: {
            $gte: body.years_in_business,
          },
        },
      },
    ]);

    return ServerResponse.success(res);
  } catch (e) {
    console.log(e);
    return ServerResponse.serverError('An error occured');
  }
};
