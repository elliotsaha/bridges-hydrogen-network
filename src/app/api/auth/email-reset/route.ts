import {NextRequest} from 'next/server';
import {connectToDatabase} from '@lib/mongoose';
import {getDomain} from 'tldts';
import z from 'zod';
import {ServerResponse, getSession} from '@helpers';
import ResetEmail from '@emails/ResetEmail';
import {logger, sendMail} from '@lib';

const emailSchema = z.object({
  email_address: z.string().email(),
  password: z.string(),
});

type Email = z.infer<typeof emailSchema>;

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body: Email = await request.json();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  const OLD_EMAIL = session.user.email_address;
  const NEW_EMAIL = body.email_address;

  const validation = emailSchema.safeParse(body);
  if (validation.success) {
    if (!(getDomain(OLD_EMAIL) === getDomain(NEW_EMAIL))) {
      return ServerResponse.userError(
        'New email must be from the same domain as previous email'
      );
    }
    try {
      const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/login`;

      await sendMail({
        to: NEW_EMAIL,
        subject: 'Reset your email',
        emailComponent: ResetEmail({
          first_name: session.user.first_name,
          last_name: session.user.last_name,
          url: url,
          old_email: OLD_EMAIL,
        }),
      });
    } catch (e) {
      logger.error(e);
      return ServerResponse.serverError('An unexpected error occurred');
    }
    return ServerResponse.success('Confirmation link has been sent to inbox');
  } else {
    return ServerResponse.validationError(validation);
  }
};
