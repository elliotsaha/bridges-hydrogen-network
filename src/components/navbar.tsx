"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Img,
  Flex,
  Spacer,
  Button,
  Stack,
  Link,
  Container,
  useDisclosure,
  IconButton,
  VStack,
  Collapse,
  Icon,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

interface Link {
  name: string;
  href: string;
}

const links: Array<Link> = [
  { name: "Home", href: "/" },
  { name: "Search", href: "/search" },
  { name: "My Company", href: "/company-profile" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  // state for mobile nav
  const { isOpen, onToggle } = useDisclosure();

  // on scroll, border will appear
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box as="nav" bg="white" w="100%" position="fixed" zIndex="500">
      <Box
        w="100%"
        borderBottomWidth={scrollPosition > 0 ? "2px" : "0px"}
        transition="ease-in-out border 0.1s"
      >
        <Container maxW="container.xl" ml="auto" mr="auto">
          <Flex w="100%" p="5" flexDirection="row">
            <Img src="/static/images/logo.svg" alt="Bridges" width="120px" />
            <Spacer />
            <Flex display={{ base: "flex", lg: "none" }}>
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant={"ghost"}
                aria-label={"Toggle Navigation"}
              />
            </Flex>
            <Stack
              spacing="8"
              direction="row"
              align="center"
              pl="10"
              display={{ base: "none", lg: "flex" }}
            >
              {links.map((i) => (
                <Link
                  as={NextLink}
                  href={i.href}
                  key={i.href}
                  fontWeight="bold"
                  color="gray.500"
                  sx={{
                    ":hover": {
                      color: "brand.500",
                      textDecoration: "none",
                    },
                    ":focus": {
                      color: "brand.800",
                    },
                  }}
                >
                  {i.name}
                </Link>
              ))}
            </Stack>
            <Spacer display={{ base: "none", lg: "flex" }} />
            <Stack
              spacing="4"
              direction="row"
              align="center"
              display={{ base: "none", lg: "flex" }}
            >
              <Button>Login</Button>
              <Button colorScheme="brand">Sign up</Button>
            </Stack>
          </Flex>
        </Container>
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const MobileNav = () => (
  <Container
    maxW="container.xl"
    ml="auto"
    mr="auto"
    display={{ lg: "none" }}
    pb="8"
    borderBottomWidth="2px"
  >
    <Box px="5" pt="3" bg="white">
      <VStack align="left">
        {links.map((i) => (
          <Link
            as={NextLink}
            href={i.href}
            key={i.href}
            fontWeight="bold"
            color="gray.500"
            py="2"
            sx={{
              ":hover": {
                color: "brand.500",
                textDecoration: "none",
              },
              ":focus": {
                color: "brand.800",
              },
            }}
          >
            {i.name}
          </Link>
        ))}
        <Button w={{ base: "auto", sm: "xs" }}>Login</Button>
        <Button w={{ base: "auto", sm: "xs" }} colorScheme="brand">
          Sign up
        </Button>
      </VStack>
    </Box>
  </Container>
);
