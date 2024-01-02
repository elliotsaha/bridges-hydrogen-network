import {NextRequest} from 'next/server';
import {connectToDatabase, logger} from '@lib';
import {ServerResponse, getSession} from '@helpers';
import {Company} from '@models';

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  try {
    await Company.updateOne(
      {
        _id: body._id,
      },
      body
    );

    return ServerResponse.success('Successfully updated company');
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
