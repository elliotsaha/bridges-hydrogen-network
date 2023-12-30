import {User} from '@models';
import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {z} from 'zod';
import {ServerResponse} from '@helpers/serverResponse';
import {auth} from '@lib/lucia';

type Email = {
  email_address: string;
};

const emailSchema = z.object({
  email_address: z.string().email(),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Email = await request.json();

  const validation = emailSchema.safeParse(body);

  if (validation.success) {
    const res = await User.findOne({
      email_address: body.email_address,
    });

    if (!res) {
      return ServerResponse.userError('User does not exist');
    }
    return ServerResponse.success('Password reset email sent to inbox');
  } else {
    return ServerResponse.validationError(validation);
  }
};
