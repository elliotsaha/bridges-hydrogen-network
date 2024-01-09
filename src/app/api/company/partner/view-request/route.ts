import {getSession} from '@helpers/getSession';
import {ServerResponse} from '@helpers';
import {NextRequest} from 'next/server';
import {logger, connectToDatabase} from '@lib';
import {Company, PartnerRequest} from '@models';

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const USER_EMAIL = session.user.email_address;

  try {
    const {id} = await request.json();

    const COMPANY_FROM = await Company.findOne<Company>({
      team: USER_EMAIL,
    });

    if (!COMPANY_FROM) {
      return ServerResponse.userError('You are not registered in a company');
    }

    // if accepted
    if (COMPANY_FROM.partners.includes(id)) {
      const COMPANY_TO = await Company.findOne<Company>({
        _id: id,
      });

      if (COMPANY_TO) {
        return ServerResponse.success({
          status: 'ACCEPT',
          team: COMPANY_TO.team,
        });
      }

      return ServerResponse.serverError('Company not found');
    }

    // if pending
    const validPartnerRequest = await PartnerRequest.findOne({
      from: COMPANY_FROM._id,
      to: id,
      status: 'PENDING',
    }).lean<PartnerRequest>();

    if (validPartnerRequest) {
      return ServerResponse.success({status: 'PENDING'});
    }

    return ServerResponse.success({status: 'NO_REQ'});
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
