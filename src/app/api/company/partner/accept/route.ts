import {connectToDatabase, logger} from '@lib';
import {Company, PartnerRequest} from '@models';
import {NextRequest, NextResponse} from 'next/server';
import {sendMail} from '@lib';
import {PartnerAcceptEmail} from '@emails';

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
      status: 'ACCEPT',
    });

    await Company.findByIdAndUpdate(PARTNER_REQUEST.to, {
      $push: {partners: PARTNER_REQUEST.from},
    });

    await Company.findByIdAndUpdate(PARTNER_REQUEST.from, {
      $push: {partners: PARTNER_REQUEST.to},
    });

    const sendAcceptanceEmail = async (
      company_name: string,
      email_address: string,
      id: string
    ) => {
      await sendMail({
        to: email_address,
        subject: `Partnership Acceptance from ${company_name}`,
        emailComponent: PartnerAcceptEmail({
          company_name,
          id,
        }),
      });
    };

    [...originCompany.team].forEach((email: string) =>
      sendAcceptanceEmail(
        recievingCompany.company_name,
        email,
        recievingCompany._id
      )
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${originCompany._id}?status=ACCEPT`
    );
  } catch (e) {
    logger.error(e);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/my-company?status=ERR`
    );
  }
};
