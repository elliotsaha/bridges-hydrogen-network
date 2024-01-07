import {connectToDatabase} from '@lib/mongoose';
import {NextRequest} from 'next/server';
import {ServerResponse, getSession} from '@helpers';
import {Company} from '@models';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const {session} = await getSession(request);
    if (!session) {
      return ServerResponse.unauthorizedError();
    }

    const USER_EMAIL = session.user.email_address;

    const company = await Company.findOne({
      team: USER_EMAIL,
    }).lean<Company>();

    if (company) {
      const transformedPartners = await Company.find(
        {
          _id: {$in: company.partners},
        },
        {
          company_name: 1,
          operating_regions: 1,
        }
      );

      return ServerResponse.success({
        ...company,
        partners: transformedPartners,
      });
    }

    return ServerResponse.userError('Company not found');
  } catch (e) {
    return ServerResponse.serverError();
  }
};
