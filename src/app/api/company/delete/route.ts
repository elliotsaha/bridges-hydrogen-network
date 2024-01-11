import {connectToDatabase, sendMail} from '@lib';
import {NextRequest} from 'next/server';
import {ServerResponse, getSession} from '@helpers';
import {Company, DeletedCompany} from '@models';
import {CompanyDeletionEmail} from '@emails';

export const GET = async (request: NextRequest) => {
  await connectToDatabase();

  const {session} = await getSession(request);

  if (!session) {
    return ServerResponse.unauthorizedError();
  }

  try {
    const userEmail = session.user.email_address;

    const userCompany = await Company.findOne({
      team: {$in: userEmail},
    }).lean<Company>();

    if (userCompany) {
      // make copy of company and put in deletedcompanies collection
      // remove userCompany from other partner lists
      const {_id, ...clonedUserCompany} = userCompany;

      await DeletedCompany.create(clonedUserCompany);

      const sendDeletionEmail = async (email_address: string) => {
        await sendMail({
          to: email_address,
          subject: `${userCompany.company_name} has been deleted`,
          emailComponent: CompanyDeletionEmail({
            company_name: userCompany.company_name,
            deleteRequestEmail: userEmail,
          }),
        });
      };

      [...userCompany.team].forEach((email: string) =>
        sendDeletionEmail(email)
      );

      await Company.updateMany(
        {_id: {$in: userCompany.partners}},
        {$pull: {partners: _id}}
      );

      await Company.deleteOne({_id}).orFail();

      return ServerResponse.success('Successfully deleted company');
    }

    return ServerResponse.userError('No company found');
  } catch (e) {
    console.log(e);
    return ServerResponse.serverError();
  }
};
