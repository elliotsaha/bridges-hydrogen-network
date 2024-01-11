import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface PartnerRequestEmailProps {
  company_name: string;
  id: string;
}

export const PartnerRequestEmail = ({
  company_name,
  id,
}: PartnerRequestEmailProps) => {
  const ACCEPT_URL = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/partner/accept?id=${id}`;
  const DENY_URL = `${process.env.NEXT_PUBLIC_HOSTNAME}/api/company/partner/deny?id=${id}`;

  return (
    <Html>
      <Head />
      <Preview>{company_name} has sent a partnership request</Preview>
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
              Partnership request from <b>{company_name}</b>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <b>{company_name}</b> has sent a partnership request to your
              company. Please choose to accept or decline below.
            </Text>

            <Section className="text-center mt-[32px] mb-[16px]">
              <Button
                className="bg-[#232F6F] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1"
                href={ACCEPT_URL}
              >
                Accept Request
              </Button>
            </Section>
            <Section className="text-center mt-[16px] mb-[32px]">
              <Button
                className="bg-[#EB2417] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1"
                href={DENY_URL}
              >
                Decline Request
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PartnerRequestEmail;
