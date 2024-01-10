import {NextRequest} from 'next/server';
import {connectToDatabase, logger} from '@lib';
import {ServerResponse, getSession} from '@helpers';
import {Company} from '@models';
import axios from 'axios';

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  try {
    const existingCompanies = await Company.find<Company>({
      team: {$in: session.user.email_address},
    }).lean();

    if (existingCompanies.length !== 0) {
      return ServerResponse.userError('You have already registered a company');
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/validate`,
      body
    );

    await Company.create({
      ...res.data,
      team: [session.user.email_address], // the only team member is the creator when just created
      partners: [], // company should have no partners when just created
    });

    return ServerResponse.success('Successfully created company');
  } catch (e) {
    logger.error(e);
    console.log(e);
    if (axios.isAxiosError(e)) {
      return ServerResponse.userError('Invalid schema');
    }
    return ServerResponse.serverError();
  }
};
