import {connectToDatabase, logger} from '@lib';
import {PartnerRequest, Company} from '@models';
import {NextRequest, NextResponse} from 'next/server';
import {sendMail} from '@lib';
import {PartnerDenyEmail} from '@emails';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  try {
    const PARTNERSHIP_ID = request.nextUrl.searchParams.get('id');

    const PARTNER_REQUEST = await PartnerRequest.findById(PARTNERSHIP_ID);

    const originCompany = await Company.findById<Company>(PARTNER_REQUEST.from)
      .lean<Company>()
      .orFail();

    const recievingCompany = await Company.findById<Company>(PARTNER_REQUEST.to)
      .lean<Company>()
      .orFail();
    if (!PARTNER_REQUEST) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/my-company?status=ERR`
      );
    }

    switch (PARTNER_REQUEST.status) {
      case 'ACCEPT':
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${originCompany._id}?status=ALR_ACCEPT`
        );
      case 'DENY':
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${originCompany._id}?status=ALR_DENY`
        );
    }

    await PartnerRequest.findByIdAndUpdate(PARTNERSHIP_ID, {
      status: 'DENY',
    });

    const sendDenyEmail = async (
      company_name: string,
      email_address: string,
      id: string
    ) => {
      await sendMail({
        to: email_address,
        subject: `Partnership Request Declined from ${company_name}`,
        emailComponent: PartnerDenyEmail({
          company_name,
          id,
        }),
      });
    };

    [...originCompany.team].forEach((email: string) =>
      sendDenyEmail(recievingCompany.company_name, email, recievingCompany._id)
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${originCompany._id}?status=DENY`
    );
  } catch (e) {
    logger.error(e);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/my-company?status=ERR`
    );
  }
};
