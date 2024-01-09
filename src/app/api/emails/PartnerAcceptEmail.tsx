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
} from '@react-email/components';
import * as React from 'react';

interface PartnerAcceptEmailProps {
  company_name: string;
  id: string;
}

export const PartnerAcceptEmail = ({
  company_name,
  id,
}: PartnerAcceptEmailProps) => {
  const VIEW_PAGE_URL = `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${id}`;

  return (
    <Html>
      <Head />
      <Preview>{company_name} has accepted your partnership</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <b>{company_name}</b> accepted your partnership request
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              <b>{company_name}</b> has accepted your partnership request. You
              can now contact their entire team and get in touch.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#232F6F] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1"
                href={VIEW_PAGE_URL}
              >
                Contact their team
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PartnerAcceptEmail;
