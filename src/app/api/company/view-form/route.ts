import {connectToDatabase} from '@lib/mongoose';
import {NextRequest} from 'next/server';
import {ServerResponse, getSession} from '@helpers';
import {Company} from '@models/Company';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const {session} = await getSession(request);
    if (!session) {
      return ServerResponse.unauthorizedError();
    }

    const USER_EMAIL = session.user.email_address;

    const res: Company | null = await Company.findOne(
      {
        team: USER_EMAIL,
      },
      {
        'market_focus._id': 0,
        'services._id': 0,
        'technologies._id': 0,
        'type_of_business._id': 0,
      }
    ).lean();

    if (res) {
      const formBody = {
        profile: res.profile,
        description: res.description,
        company_name: res.company_name,
        headquarters_location: res.headquarters_location,
        less_than_2_years: res.less_than_2_years || false,
        years_in_business: res.years_in_business?.toString() || '',
        market_focus: res.market_focus.map(i => JSON.stringify(i)),
        operating_regions: res.operating_regions,
        services: res.services.map(i => JSON.stringify(i)),
        technologies: res.technologies.map(i => JSON.stringify(i)),
        type_of_business: res.type_of_business.map(i => JSON.stringify(i)),
      };

      return ServerResponse.success(formBody);
    }
    return ServerResponse.serverError();
  } catch (e) {
    return ServerResponse.serverError();
  }
};
