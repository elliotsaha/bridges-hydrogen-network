"use client";
import { Box } from "@chakra-ui/react";

interface RootWrapperProps {
  children: React.ReactNode;
}

export const RootWrapper = ({ children }: RootWrapperProps) => {
  // 220px is min height of footer
  return (
    <Box pt="20" minH="calc(100vh - 220px)">
      {children}
    </Box>
  );
};
