"use client";
import { Container, Heading, VStack, Text, Button } from "@chakra-ui/react";
import { Subheader } from "@/components/subheader";
import NextLink from "next/link";

const VerificationEmail = () => {
  return (
    <>
      <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
        <VStack px="4" align="center">
          <Heading as="h1" size="2xl" textAlign="center">
            Verification Email Sent
          </Heading>
          <Subheader textAlign="center" mb="3">
            Thank you for registering
          </Subheader>
          <Text maxW="sm" textAlign="center" color="gray.700" mb="5" px="5">
            A confirmation link should show up in your inbox soon asking you to
            verify your email address
          </Text>
          <Button as={NextLink} href="/">
            Back Home
          </Button>
        </VStack>
      </Container>
    </>
  );
};

export default VerificationEmail;
