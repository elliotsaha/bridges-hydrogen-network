import {connectToDatabase} from '@lib/mongoose';
import {logger} from '@lib/winston';
import {ServerResponse} from '@helpers/serverResponse';
import {auth} from '@lib/lucia';
import {isWithinExpiration} from 'lucia/utils';
import {Company} from '@models/Company';
import {EmailToken} from '@models/EmailToken';
import {NextRequest, NextResponse} from 'next/server';
import {createKeyId} from 'lucia';
import {Key} from '@models';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const token = request.nextUrl.searchParams.get('token');

    const storedToken = await EmailToken.findOne({
      _id: token,
    });

    if (!storedToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/login?confirmation-status=false`
      );
    }

    const tokenExpires = Number(storedToken.expires);

    if (!isWithinExpiration(tokenExpires)) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/login?confirmation-status=false`
      );
    }

    const userToUpdate = await auth.getUser(storedToken.user_id);

    const OLD_EMAIL = userToUpdate.email_address; // previous email from session
    const NEW_EMAIL = storedToken.email_address; // email to be updated

    await auth.invalidateAllUserSessions(userToUpdate.userId);
    await auth.updateUserAttributes(userToUpdate.userId, {
      email_address: NEW_EMAIL,
    });

    //    const oldKey = await auth.getKey('email_address', userToUpdate.user_id);
    const newKeyId = createKeyId('email_address', storedToken.email_address);

    const key = await Key.findOne({
      user_id: storedToken.user_id,
    }).lean<Key>();

    await Key.deleteOne({user_id: storedToken.user_id});

    const newKey = {...key, _id: newKeyId};

    await Key.create(newKey);

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
      return ServerResponse.serverError();
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/login?confirmation-status=true&invalidate=true`
    );
  } catch (e) {
    logger.error(e);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/login?confirmation-status=false`
    );
  }
};
