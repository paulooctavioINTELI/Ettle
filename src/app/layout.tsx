// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ettle — Science-based, personalised workouts",
  description:
    "Smart, evidence-based training plans that adapt to your level and routine. Free beta in Edinburgh.",
  applicationName: "Ettle",
  themeColor: "#181918",
  openGraph: {
    title: "Ettle — Science-based, personalised workouts",
    description:
      "Smart, evidence-based training plans that adapt to your level and routine. Free beta in Edinburgh.",
    url: "https://ettle.app",
    siteName: "Ettle",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Ettle preview" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ettle — Science-based, personalised workouts",
    description:
      "Smart, evidence-based training plans that adapt to your level and routine. Free beta in Edinburgh.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ettle",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS, Android, Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  };

  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
