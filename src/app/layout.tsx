import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RootWrapper } from "@/components/rootWrapper";

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
      </body>
    </html>
  );
}
