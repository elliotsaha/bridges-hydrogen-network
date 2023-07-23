"use client";
import { Flex } from "@chakra-ui/react";

interface HeroProps {
  children: React.ReactNode;
}

export const Hero = ({ children }: HeroProps) => {
  return <Flex pt="20">{children}</Flex>;
};
