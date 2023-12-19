'use client';
import React from 'react';
import {Container, Heading, VStack, Text, Button} from '@chakra-ui/react';
import {Subheader} from '@components';
import NextLink from 'next/link';

const VerifyEmail = () => {
  return (
    <>
      <Container maxW="container.xl" py={{base: '32', lg: '20'}}>
        <VStack px="4" align="center">
          <Heading as="h1" size="2xl" textAlign="center">
            Verification Email Sent
          </Heading>
          <Subheader textAlign="center" mb="1">
            Please verify your email before logging in
          </Subheader>
          <Text maxW="md" textAlign="center" color="gray.700" mb="3" px="5">
            A confirmation link should show up in your inbox soon asking you to
            verify your email address
          </Text>
          <Button as={NextLink} href="/login" size="lg">
            Login
          </Button>
        </VStack>
      </Container>
    </>
  );
};

export default VerifyEmail;
