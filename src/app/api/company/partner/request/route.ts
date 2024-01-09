import {NextRequest} from 'next/server';
import {Company, PartnerRequest} from '@models';
import {ServerResponse} from '@helpers';
import PartnerRequestEmail from '@emails/PartnerRequestEmail';
import {sendMail, logger, connectToDatabase} from '@lib';
import {getSession} from '@helpers';

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const {session} = await getSession(request);
  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const USER_EMAIL = session.user.email_address;

  const sendPartnerRequest = async (
    company_name: string,
    email_address: string,
    id: string
  ) => {
    await sendMail({
      to: email_address,
      subject: `Partnership request from ${company_name}`,
      emailComponent: PartnerRequestEmail({
        company_name,
        id,
      }),
    });
  };

  try {
    const {id} = await request.json();

    const COMPANY_FROM = await Company.findOne({
      team: USER_EMAIL,
    });

    if (!COMPANY_FROM) {
      return ServerResponse.userError('You are not registered in a company');
    }

    const COMPANY_TO = await Company.findById(id);

    if (!COMPANY_TO) {
      return ServerResponse.userError('Invalid company ID');
    }

    const partnerRequest = await PartnerRequest.create({
      from: COMPANY_FROM._id,
      to: COMPANY_TO._id,
      status: 'PENDING',
    });

    const RES_ID = partnerRequest._id;

    const COMPANY_TEAM = COMPANY_TO.team;

    [...COMPANY_TEAM].forEach((team: string) =>
      sendPartnerRequest(COMPANY_FROM.company_name, team, RES_ID)
    );

    return ServerResponse.success('Successfully sent a partnership request');
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
