"use client";
import { useEffect, useState } from "react";
import {
  Container,
  Heading,
  HStack,
  VStack,
  Text,
  Box,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Button,
  SlideFade,
} from "@chakra-ui/react";
import { useAuth } from "@hooks";
import { Subheader } from "@components";
import NextLink from "next/link";

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <SkeletonProfile />;
  }

  return (
    <SlideFade in={!loading} offsetY="24">
      <Container maxW="container.xl" py={{ base: "32", lg: "20" }}>
        <VStack px="4" align="center">
          <Heading as="h1">Register your company</Heading>
          <Subheader textAlign="center" mb="1">
            List your company on bridges
          </Subheader>
          <Text maxW="md" textAlign="center" color="gray.700">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque.
            Lorem ipsum dolor sit amet.
          </Text>
          <Button
            mt="3"
            colorScheme="brand"
            size="lg"
            as={NextLink}
            href="/my-company/register"
          >
            Get Started
          </Button>
        </VStack>
      </Container>
    </SlideFade>
  );
};

const SkeletonProfile = () => {
  return (
    <Container maxW="container.xl">
      <Box my="24" mx="4">
        <VStack align="flex-start" spacing="4" w={{ base: "100%", lg: "65%" }}>
          <SkeletonCircle size="32" />
          <Skeleton w="100%" h="12" borderRadius="lg" />
          <SkeletonText
            borderRadius="lg"
            noOfLines={4}
            spacing="4"
            skeletonHeight="2"
            mt="4"
            w="100%"
          />
          <HStack w="100%" spacing="6" mt="8">
            <Skeleton w="50%" h="24" borderRadius="lg" />
            <Skeleton w="50%" h="24" borderRadius="lg" />
          </HStack>
          <HStack w="100%" spacing="6" mt="2">
            <Skeleton w="50%" h="24" borderRadius="lg" />
            <Skeleton w="50%" h="24" borderRadius="lg" />
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};
export default CompanyProfile;
