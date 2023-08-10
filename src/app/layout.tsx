import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RootWrapper } from "@/components/rootWrapper";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Bridges by CHA",
  description:
    "Bridges is a B2B platform aimed to connect hydrogen and clean energy companies around the world to achieve net zero carbon emissions before 2050",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <RootWrapper>{children}</RootWrapper>
          <Footer />
        </Providers>
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=Function.prototype`}
        />
      </body>
    </html>
  );
}
