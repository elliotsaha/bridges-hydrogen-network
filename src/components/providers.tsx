"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";
import { AuthContextProvider } from "@/app/auth/context";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#F2F3FA",
      100: "#DBDEF0",
      200: "#B6BCDB",
      300: "#4F598C",
      400: "#39447D",
      500: "#232F6F",
      600: "#202A64",
      700: "#1C2659",
      800: "#19214E",
      900: "#151C43",
    },
    accent: chakraTheme.colors.orange,
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        toastOptions={{
          defaultOptions: {
            position: "bottom-right",
            duration: 5000,
            isClosable: true,
          },
        }}
      >
        <AuthContextProvider>{children}</AuthContextProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
