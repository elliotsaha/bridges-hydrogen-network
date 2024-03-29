import {connectToDatabase} from '@lib';
import {NextRequest} from 'next/server';
import {ServerResponse, getSession} from '@helpers';
import z from 'zod';
import {ZOD_ERR} from '@constants';
import {Company, User} from '@models';

const detailSchema = z.object({
  id: z.string().min(1, ZOD_ERR.REQ_FIELD),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const {id} = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const validation = detailSchema.safeParse({id});

  if (validation.success) {
    try {
      const company = await Company.findById(id).lean<Company>();

      const userCompany = await Company.findOne<Company>({
        team: {$in: session.user.email_address},
      }).lean<Company>();

      if (userCompany?._id.toString() === company?._id.toString()) {
        return ServerResponse.success({status: 'REDIRECT', company: null});
      }

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

        console.log(company.team);
        const transformedTeam = await User.find(
          {email_address: {$in: company.team}},
          {
            email_address: 1,
            role: 1,
          }
        );

        console.log(transformedTeam);

        return ServerResponse.success({
          status: 'FOUND',
          company: {
            ...company,
            partners: transformedPartners,
            team: transformedTeam,
          },
        });
      }

      return ServerResponse.userError('Company not found');
    } catch (e) {
      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
