import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Text,
  Heading,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface CompanyDeletionEmailProps {
  company_name: string;
  deleteRequestEmail: string;
}

export const CompanyDeletionEmail = ({
  company_name,
  deleteRequestEmail,
}: CompanyDeletionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{company_name} has been deleted</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Img
              src={`${process.env.NEXT_BRIDGES_LOGO_URI}`}
              alt="Bridges"
              height="40"
              className="mx-auto mt-4 object-fill"
            />
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <b>{company_name}</b> has been deleted
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <b>{deleteRequestEmail}</b> from your team has actioned the
              deletion of {company_name}, we are sorry to see you go.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default CompanyDeletionEmail;
