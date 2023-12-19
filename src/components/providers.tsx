'use client';
import {AuthProvider, ChakraUIProvider, ReactQueryProvider} from '@providers';

// Combines all providers into one wrapper component
export const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <ChakraUIProvider>
      <ReactQueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </ReactQueryProvider>
    </ChakraUIProvider>
  );
};
