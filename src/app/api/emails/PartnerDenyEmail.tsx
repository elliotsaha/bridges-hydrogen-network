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

interface PartnerDenyEmailProps {
  company_name: string;
  id: string;
}

export const PartnerDenyEmail = ({company_name, id}: PartnerDenyEmailProps) => {
  const VIEW_PAGE_URL = `${process.env.NEXT_PUBLIC_HOSTNAME}/company/detail/${id}`;

  return (
    <Html>
      <Head />
      <Preview>{company_name} has accepted your partnership</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <b>{company_name}</b> denied your partnership request
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              Unfortunately, <b>{company_name}</b> has denied your partnership
              request. You can can choose to re-request partnership to their
              company if you believe this was a mistake.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#A4A4A4] rounded text-white text-[12px] font-semibold no-underline text-center px-6 py-4 col-start-1 row-start-1"
                href={VIEW_PAGE_URL}
              >
                Re-request partnership
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PartnerDenyEmail;
