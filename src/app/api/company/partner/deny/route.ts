import {connectToDatabase, logger} from '@lib';
import {PartnerRequest} from '@models';
import {NextRequest} from 'next/server';
import {ServerResponse} from '@helpers';

export const PUT = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const PARTNERSHIP_ID = request.nextUrl.searchParams.get('id');

    const PARTNER_REQUEST = await PartnerRequest.findById(PARTNERSHIP_ID);

    if (!PARTNER_REQUEST) {
      return ServerResponse.userError('Invalid ID');
    }

    if (PARTNER_REQUEST.status !== 'PENDING') {
      return ServerResponse.userError('This request has been closed');
    }

    await PartnerRequest.findByIdAndUpdate(PARTNERSHIP_ID, {
      status: 'DENY',
    });

    return ServerResponse.success('Successfully denied request');
  } catch (e) {
    logger.error(e);
    return ServerResponse.serverError();
  }
};
