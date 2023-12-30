import {connectToDatabase} from '@lib';
import {NextRequest} from 'next/server';
import {ServerResponse, getSession} from '@helpers';
import z from 'zod';
import {ZOD_ERR} from '@constants';
import {Company} from '@models';

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
      const company = await Company.findById(id);
      return ServerResponse.success(company);
    } catch (e) {
      return ServerResponse.userError('Could not find company');
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
