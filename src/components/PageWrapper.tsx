'use client';
import {Box} from '@chakra-ui/react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({children}: PageWrapperProps) => {
  // 220px is min height of footer
  return (
    <Box pt="20" minH="max(calc(100vh - 220px), 750px)">
      {children}
    </Box>
  );
};
