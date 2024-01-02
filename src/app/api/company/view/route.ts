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

    return ServerResponse.success(res);
  } catch (e) {
    return ServerResponse.serverError();
  }
};
