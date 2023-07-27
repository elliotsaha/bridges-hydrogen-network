import React from "react";
import { Flex, Icon, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { FiExternalLink } from "react-icons/fi";

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

export const ExternalLink = ({ href, children }: LinkProps) => {
  return (
    <ChakraLink as={NextLink} href={href}>
      <Flex color="blue.500" alignItems="center" fontWeight="bold">
        {children}
        <Icon as={FiExternalLink} ml="1" />
      </Flex>
    </ChakraLink>
  );
};
