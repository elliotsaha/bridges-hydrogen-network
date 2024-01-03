import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PartnerRequestEmailProps {
  company_name: string;
}

export const PartnerRequestEmail = ({
  company_name,
}: PartnerRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>A company wants has sent a partnership request</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Partnership request from <b>{company_name}</b>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              <b>{company_name}</b> has sent a partnership request to your
              company. Please choose to accept or decline below.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button className="bg-[#232F6F] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1">
                Accept Request
              </Button>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button className="bg-[#232F6F] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1">
                Decline Request
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PartnerRequestEmail;
