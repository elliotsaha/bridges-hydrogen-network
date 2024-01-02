import {connectToDatabase} from '@lib/mongoose';
import z from 'zod';
import {logger} from '@lib/winston';
import type {NextRequest} from 'next/server';
import {ServerResponse} from '@helpers/serverResponse';
import {Token} from '@models/Token';
import {auth} from '@lib/lucia';
import {isWithinExpiration} from 'lucia/utils';
import {Company} from '@models/Company';
import {EmailToken} from '@models/EmailToken';

export const POST = async (
  request: NextRequest,
  {
    params,
  }: {
    params: {
      token: string;
    };
  }
) => {
  await connectToDatabase();

  try {
    const {token} = params;

    const storedToken = await EmailToken.findOne({
      _id: token,
    });

    if (!storedToken) {
      return ServerResponse.userError('Invalid token');
    }

    const tokenExpires = Number(storedToken.expires);

    if (!isWithinExpiration(tokenExpires)) {
      return ServerResponse.userError('Expired token');
    }

    const userToUpdate = await auth.getUser(storedToken.user_id);

    const OLD_EMAIL = userToUpdate.email_address; // previous email from session
    const NEW_EMAIL = storedToken.email_address; // email to be updated

    await auth.invalidateAllUserSessions(userToUpdate.userId);
    await auth.updateUserAttributes(userToUpdate.userId, {
      email_address: NEW_EMAIL,
    });

    const companyToUpdate = await Company.findOne({
      team: OLD_EMAIL,
    });

    const UPDATED_TEAM = [
      NEW_EMAIL,
      ...companyToUpdate.team.filter((email: string) => email !== OLD_EMAIL),
    ];

    const res = await Company.updateOne(
      {_id: companyToUpdate._id},
      {team: UPDATED_TEAM}
    );

    if (!res.acknowledged) {
      return ServerResponse.success('Mongoose error');
    }
    return ServerResponse.success('Email successfully updated');
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError('Server error');
  }
};