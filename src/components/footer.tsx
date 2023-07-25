"use client";
import {
  Container,
  Box,
  Text,
  Heading,
  VStack,
  Stack,
  Flex,
  Img,
  Link,
} from "@chakra-ui/react";
import { Subheader } from "./subheader";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <Container
      maxW="container.xl"
      bg="brand.500"
      borderTopRightRadius="lg"
      borderTopLeftRadius="lg"
      p="12"
      minH="220px"
    >
      <Stack
        spacing={{ base: "12", md: "16" }}
        direction={{ base: "column", md: "row" }}
      >
        <Img src="/static/images/logo_white.svg" w="36" />
        <VStack color="white" align="flex-start">
          <Subheader color="white">Account</Subheader>
          <Link as={NextLink} href="/">
            Get Started
          </Link>
          <Link as={NextLink} href="/">
            Forgot Password
          </Link>
          <Link as={NextLink} href="/">
            Login
          </Link>
        </VStack>

        <VStack color="white" align="flex-start">
          <Subheader color="white">Company</Subheader>
          <Link as={NextLink} href="/">
            Register company
          </Link>
          <Link as={NextLink} href="/">
            Manage Partners
          </Link>
        </VStack>

        <VStack color="white" align="flex-start">
          <Subheader color="white">Bridges</Subheader>
          <Link as={NextLink} href="/">
            Terms of Service
          </Link>
          <Link as={NextLink} href="/">
            Contact Us
          </Link>
        </VStack>
      </Stack>
    </Container>
  );
};
