"use client";
import React from "react";
import { Box } from "@chakra-ui/react";

interface RootWrapperProps {
  children: React.ReactNode;
}

export const RootWrapper = ({ children }: RootWrapperProps) => {
  return <Box pt="20">{children}</Box>;
};
