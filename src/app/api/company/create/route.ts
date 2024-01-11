import {NextRequest} from 'next/server';
import {connectToDatabase, logger} from '@lib';
import {ServerResponse, getSession} from '@helpers';
import {Company, User} from '@models';
import axios from 'axios';
import {getDomain} from 'tldts';

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

    const domain = getDomain(session.user.email_address);

    const users = await User.find(
      {domain, email_verified: true},
      {email_address: 1}
    ).lean<User[]>();

    const userEmailList = users.map((i: User) => i.email_address);

    await Company.create({
      ...res.data,
      team: userEmailList,
      partners: [], // company should have no partners when just created
      domain,
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
