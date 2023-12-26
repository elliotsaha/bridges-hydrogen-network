import {NextRequest} from 'next/server';
import {z} from 'zod';
import {connectToDatabase} from '@lib';
import {logger, sendMail} from '@lib';
import {ServerResponse} from '@helpers';
import ContactEmail from '@emails/ContactEmail';

const ContactEmailSchema = z.object({
  username: z.string({required_error: 'Username is required'}),
  email_address: z
    .string({required_error: 'Email Address is required'})
    .email({message: 'Invalid email address!'}),
  message: z.string({required_error: 'Message is required'}),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const body = await request.json();

  const {username, email_address, message} = structuredClone(body);
  const validation = ContactEmailSchema.safeParse({
    username,
    email_address,
    message,
  });

  if (validation.success) {
    try {
      const subject = 'Email from ' + username;
      const emailaddressee = `${process.env.NEXT_CONTACT_EMAIL}`;
      await sendMail({
        to: emailaddressee,
        subject: subject,
        emailComponent: ContactEmail({
          username,
          email_address,
          message,
        }),
      });
      return ServerResponse.success('Successfully sent the email');
    } catch (e) {
      logger.error(e);

      return ServerResponse.serverError();
    }
  } else {
    return ServerResponse.validationError(validation);
  }
};
