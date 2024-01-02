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

    const res = await Company.findOne({
      team: USER_EMAIL,
    });

    const stringfiedCompany = {
      company_name: res.company_name,
      headquarters_location: res.headquarters_location,
      less_than_2_years: res.less_than_2_years,
      market_focus: res.market_focus.map(JSON.stringify),
      operating_regions: res.operating_regions,
      partners: res.partners,
      services: res.services.map(JSON.stringify),
      team: res.team,
      technologies: res.technologies.map(JSON.stringify),
      type_of_business: res.type_of_business.map(JSON.stringify),
    };

    return ServerResponse.success(stringfiedCompany);
  } catch (e) {
    return ServerResponse.serverError();
  }
};
