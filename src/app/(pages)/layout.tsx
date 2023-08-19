import type { Metadata } from "next";
import { Providers, Navbar, Footer, PageWrapper } from "@components";
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
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </Providers>
        {/* Google Maps API Setup */}
        <Script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=Function.prototype`}
        />
      </body>
    </html>
  );
}
