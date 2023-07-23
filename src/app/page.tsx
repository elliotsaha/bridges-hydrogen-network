"use client";
import { Hero } from "@/components/hero";
import {
  Box,
  Image,
  Flex,
  Spacer,
  Button,
  Stack,
  Link,
  Container,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";

const Home = () => {
  return (
    <Container maxW="container.xl">
      <Hero>
        <Heading as="h1" size="4xl">
          Heading example
        </Heading>
      </Hero>
    </Container>
  );
};

export default Home;
