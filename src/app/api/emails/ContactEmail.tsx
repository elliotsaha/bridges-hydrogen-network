import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  username: string;
  email_address: string;
  message: string;
}

export const ContactEmail = ({
  username,
  email_address,
  message,
}: ContactEmailProps) => {
  const email_link = 'mailto:' + email_address;
  return (
    <Html>
      <Head />
      <Preview>Message from client</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Message from {username}
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              {message}
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Reply to:{' '}
              <a href={email_link}>
                <span className="text-black">{email_address}</span>
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactEmail;
