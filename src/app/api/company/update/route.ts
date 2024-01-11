import {NextRequest} from 'next/server';
import {connectToDatabase, logger} from '@lib';
import {ServerResponse, getSession} from '@helpers';
import {Company} from '@models';
import axios, {AxiosResponse} from 'axios';

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  try {
    const existingCompany: Company | null = await Company.findOne({
      team: {$in: session.user.email_address},
    })
      .orFail()
      .lean();

    if (existingCompany) {
      const res: AxiosResponse<Omit<Company, 'partners' | 'team'>> =
        await axios.post(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/validate`,
          body
        );

      await Company.updateOne(
        {
          _id: existingCompany._id,
        },
        res.data
      );

      return ServerResponse.success('Successfully updated company');
    }
    return ServerResponse.serverError();
  } catch (e) {
    console.log(e);
    logger.error(e);
    return ServerResponse.serverError();
  }
};
