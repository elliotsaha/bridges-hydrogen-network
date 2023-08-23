"use client";
import { useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  Container,
  Text,
  Heading,
  SimpleGrid,
  Img,
  VStack,
  Wrap,
  WrapItem,
  Center,
  Card,
  CardHeader,
  CardBody,
  Icon,
  HStack,
  Badge,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Subheader } from "@components";
import {
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiMapPin,
  FiExternalLink,
  FiHeart,
  FiFileText,
  FiMail,
  FiUser,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";
import { redirect, useSearchParams } from "next/navigation";
import { authBroadcast } from "@broadcasts";

const showcaseCompanies = [
  { name: "Suncor", url: "suncor.png" },
  { name: "TC Energy", url: "tc_energy.png" },
  { name: "Shell", url: "shell.png" },
  { name: "Air Products", url: "air_products.png" },
  { name: "Hydrogen Optimized", url: "hydrogen_optimized.png" },
  { name: "Northland Power", url: "northland_power.png" },
  { name: "EIA", url: "eia.png" },
];

const chaInfo = [
  { text: "1.2M Raised", icon: FiDollarSign },
  { text: "500+ Partners", icon: FiUsers },
  { text: "7+ Services", icon: FiPackage },
  { text: "Vancouver, BC", icon: FiMapPin },
  { text: "Non-profit", icon: FiHeart },
];

const companyPotentialCards = [
  {
    header: "Research",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    icon: FiFileText,
  },
  {
    header: "Market",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    icon: FiMail,
  },
  {
    header: "Partner",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
    icon: FiUser,
  },
];

const Home = () => {
  const searchParams = useSearchParams();
  const statusToast = useToast();

  const statusQuery = searchParams.get("status");
  const reloadSession = searchParams.get("reloadSession");
  useEffect(() => {
    if (statusQuery === "confirmedAuth") {
      statusToast({
        title: "Account confirmation successful",
        status: "success",
      });
    }
    if (reloadSession === "true") {
      authBroadcast.postMessage("reload-auth");
      redirect("/");
    }
  }, [reloadSession, statusQuery, statusToast]);

  return (
    <>
      <Container maxW="container.xl">
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          spacing="12"
          px="4"
          alignItems="center"
          pt="14"
        >
          <VStack alignItems="flex-start">
            <HStack>
              <Subheader>A CHA Project</Subheader>
              <Badge colorScheme="orange">Beta</Badge>
            </HStack>
            <Heading as="h1" size="3xl" mb="3">
              Do you know what companies you should be working with?
            </Heading>
            <Text color="gray.600" fontSize="lg" mr="9">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
              excepturi magnam, aperiam ipsam incidunt at sunt asperiores
              molestiae nobis nisi.
            </Text>
            <Button
              colorScheme="brand"
              size="lg"
              mt="6"
              as={NextLink}
              href="/"
              rightIcon={<Icon as={FiArrowRight} />}
            >
              Get Started
            </Button>
          </VStack>
          <Img
            src="/static/images/stock/handshake_glow.png"
            alt="Hand Shake"
            borderRadius="lg"
            width="xl"
            display={{ base: "none", lg: "block" }}
          />
        </SimpleGrid>
      </Container>

      <Flex
        py="16"
        bg="gray.100"
        mt="20"
        alignItems="center"
        px="8"
        textAlign="center"
        flexDir="column"
        gap="12"
      >
        <Heading
          as="h3"
          size="md"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="widest"
        >
          Trusted by companies all around the world
        </Heading>
        <Wrap spacing="12" justify="center">
          {showcaseCompanies.map((i) => (
            <WrapItem key={i.name}>
              <Img
                src={`/static/images/companies/${i.url}`}
                alt={i.name}
                h="42"
              />
            </WrapItem>
          ))}
        </Wrap>
        <Link
          as={NextLink}
          href="/my-company"
          color="brand.600"
          fontWeight="bold"
        >
          <Center>
            Register your company
            <Icon as={FiExternalLink} mx="1" />
          </Center>
        </Link>
      </Flex>

      <Container maxW="container.xl" mt="12">
        <Stack
          spacing="12"
          px="4"
          alignItems="center"
          pt="14"
          direction={{ base: "column-reverse", lg: "row" }}
        >
          <Card overflow="hidden" variant="outline" p="6">
            <CardHeader>
              <Img src="/static/images/brand/cha.png" w="16" mb="4" />
              <Heading as="h4" mb="4" size="xl">
                Canadian Hydrogen Association
              </Heading>
              <Subheader>A Non-profit Organization</Subheader>
            </CardHeader>
            <CardBody>
              <Wrap mt="-6" mb="8">
                {chaInfo.map((i) => (
                  <WrapItem key={i.text} mr="4">
                    <Center>
                      <Icon as={i.icon} mr="1" />
                      <Text
                        fontWeight="bold"
                        letterSpacing="wide"
                        color="gray.600"
                      >
                        {i.text}
                      </Text>
                    </Center>
                  </WrapItem>
                ))}
              </Wrap>
              <Text>
                The Canadian Hydrogen and Fuel Cell Association (CHFCA) is a
                national, non-profit sector association comprising industry,
                academia, research agencies and other stakeholders focused on...
              </Text>
              <Text fontWeight="bold" mt="8">
                Are you partnered with this company?{" "}
              </Text>
              <Flex color="blue.500" alignItems="center" fontWeight="bold">
                Request Partnership Status <Icon as={FiExternalLink} ml="1" />
              </Flex>
            </CardBody>
          </Card>
          <VStack alignItems="flex-start">
            <Subheader>Showcasing</Subheader>
            <Heading as="h1" size="2xl" mb="3">
              Showcase your company and have others request to partner with you
            </Heading>
            <Text color="gray.600" fontSize="lg" mr="9">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
              excepturi magnam, aperiam ipsam incidunt at sunt asperiores
              molestiae nobis nisi.
            </Text>
          </VStack>
        </Stack>
      </Container>

      <Container maxW="container.xl" mt="36" mb="24">
        <Center>
          <VStack>
            <Heading as="h2" size="2xl" textAlign="center">
              {"Are you ready to see your company's potential?"}{" "}
            </Heading>
            <Subheader mb="16" mt="4" textAlign="center">
              Growing Company Influence using Bridges
            </Subheader>
            <Wrap justify="center" spacing={{ base: "12", lg: "24" }}>
              {companyPotentialCards.map((i) => (
                <WrapItem key={i.header}>
                  <VStack>
                    <Icon as={i.icon} fontSize="42" color="brand.500" />
                    <Heading as="h5" size="lg" color="brand.500">
                      {i.header}
                    </Heading>
                    <Text maxW="64" align="center" color="gray.600">
                      {i.text}
                    </Text>
                  </VStack>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        </Center>
      </Container>

      <Container maxW="container.xl" mb="32">
        <Stack
          spacing="12"
          px="4"
          alignItems="center"
          pt="14"
          direction={{ base: "column-reverse", lg: "row" }}
        >
          <Box
            bg="brand.500"
            color="white"
            borderRadius="lg"
            px={{ base: "12", md: "24" }}
            py={{ base: "24", md: "32" }}
          >
            <Icon as={FiSend} fontSize="62" mb="4" mt="8" />
            <Heading as="h4" mb="8">
              Partner Request Sent
            </Heading>
            <Box>
              <Subheader color="white">Your message:</Subheader>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
                excepturi magnam, aperiam ipsam incidunt at sunt asperiores
                molestiae nobis nisi.
              </Text>
            </Box>
          </Box>
          <VStack alignItems="flex-start">
            <Subheader>Creating connections</Subheader>
            <Heading as="h1" size="2xl" mb="3">
              Easily form bridges between you and other corporations
            </Heading>
            <Text color="gray.600" fontSize="lg" mr="9">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga
              excepturi magnam, aperiam ipsam incidunt at sunt asperiores
              molestiae nobis nisi.
            </Text>
          </VStack>
        </Stack>
      </Container>

      <Container maxW="container.xl" mb="24">
        <Center flexDirection="column">
          <Heading as="h2" size="2xl" textAlign="center">
            What are you waiting for?
          </Heading>
          <Text maxW="md" textAlign="center" mx="auto" mt="4" mb="8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur
            dolore, autem officiis molestiae
          </Text>
          <Button
            as={NextLink}
            colorScheme="brand"
            size="lg"
            rightIcon={<Icon as={FiArrowRight} />}
            href="/"
          >
            Register Today
          </Button>
        </Center>
      </Container>
    </>
  );
};

export default Home;
