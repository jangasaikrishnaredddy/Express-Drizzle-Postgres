import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationAccountProps {
  baseUrl: string;
  name: string;
  email: string;
  code: string;
}

export function VerificationAccount({
  baseUrl,
  name,
  email,
  code,
}: VerificationAccountProps) {
  const url = `${baseUrl}/user/verify?email=${email}&code=${code}`;

  return (
    <Html lang="en">
      <Head>
        <title>Confirm Your Account!</title>
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v13/rP2Hp2ywxg089UriCZOIHQ.woff2',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>Confirm your email to complete registration</Preview>
      <Tailwind>
        <Body className="bg-[#f4f7fb] my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded-lg mt-12 mb-5 mx-auto p-8 w-[465px] bg-white shadow-lg">
            <Section className="text-center">
              <Heading className="text-3xl font-semibold text-[#1f2937]">Confirm Your Account</Heading>
              <Text className="text-lg text-[#4b5563] mt-4">
                Hello
                {' '}
                <strong>{name}</strong>
                ,
                <br />
                We're excited to have you join us! To finalize your account setup, click the button below to confirm your email address.
              </Text>
              <Button
                href={url}
                className="bg-[#007bff] text-white font-bold text-lg px-8 py-3 rounded-full mt-6 shadow-md"
              >
                Confirm Email
              </Button>
            </Section>
            <Section className="flex justify-center mt-6">
              <Text className="text-gray-600 text-center">
                If you did not sign up for this account, you can safely ignore this message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
