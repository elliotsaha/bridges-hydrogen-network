import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {getDomain, parse} from 'tldts';
import z from 'zod';
import {ServerResponse} from '@helpers/serverResponse';

const emailSchema = z.object({
  email_address: z.string().email(),
});

type Email = z.infer<typeof emailSchema>;

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Email = await request.json();

  const validation = emailSchema.safeParse(body);
  if (validation.success) {
    if (
      !(
        getDomain(body.email_address) ===
        getDomain(
          'elliotsaha@gmail.com'
          // replace with session email
        )
      )
    ) {
      return ServerResponse.userError('New email must be from the same domain');
    }
    return ServerResponse.success('Email sent to inbox');
  } else {
    return ServerResponse.validationError(validation);
  }
};
