"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from "@chakra-ui/theme";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#D3D5E2",
      100: "#B2B6CD",
      200: "#9197B7",
      300: "#4F598C",
      400: "#39447D",
      500: "#232F6F",
      600: "#202A64",
      700: "#1C2659",
      800: "#19214E",
      900: "#151C43",
    },
    accent: chakraTheme.colors.red,
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
};
